import uuid
import math
from fastapi import HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import func, or_, desc, asc
from sqlmodel import select

from app.models.product import Product
from app.models.product_image import ProductImage
from app.models.review import Review
from app.schemas.product import ProductCreate, ProductUpdate, ProductImageCreate
from app.schemas.review import ReviewCreate


class ProductService:
    @staticmethod
    async def get_product_with_images(session: AsyncSession, product_id: uuid.UUID):
        product = await session.get(Product, product_id)
        if not product:
            raise HTTPException(status_code=404, detail="Product not found")

        images_result = await session.exec(select(ProductImage).where(ProductImage.product_id == product_id))

        product_dict = product.model_dump()
        product_dict["images"] = images_result.all()
        return product_dict

    @staticmethod
    async def get_products(
            session: AsyncSession, page: int, limit: int, search: str,
            category_id: uuid.UUID, brand_id: uuid.UUID, min_price: float, max_price: float,
            sort_by: str, sort_order: str, only_active: bool = True
    ):
        query = select(Product)
        if only_active:
            query = query.where(Product.is_active == True)

        if search:
            query = query.where(
                or_(Product.name.ilike(f"%{search}%"), Product.description.ilike(f"%{search}%"))
            )
        if category_id: query = query.where(Product.category_id == category_id)
        if brand_id: query = query.where(Product.brand_id == brand_id)
        if min_price is not None: query = query.where(Product.price >= min_price)
        if max_price is not None: query = query.where(Product.price <= max_price)

        # Count total
        count_query = select(func.count()).select_from(query.subquery())
        total = (await session.exec(count_query)).one()

        # Sorting
        if sort_by == "price":
            query = query.order_by(desc(Product.price) if sort_order == "desc" else asc(Product.price))
        elif sort_by == "rating":
            query = query.order_by(
                desc(Product.average_rating) if sort_order == "desc" else asc(Product.average_rating))
        else:
            query = query.order_by(desc(Product.created_at) if sort_order == "desc" else asc(Product.created_at))

        # Pagination
        query = query.offset((page - 1) * limit).limit(limit)
        products = (await session.exec(query)).all()

        # Fetch images for products to avoid N+1
        product_ids = [p.id for p in products]
        images_result = await session.exec(select(ProductImage).where(ProductImage.product_id.in_(product_ids)))
        all_images = images_result.all()

        data = []
        for p in products:
            p_dict = p.model_dump()
            p_dict["images"] = [img for img in all_images if img.product_id == p.id]
            data.append(p_dict)

        return {
            "total": total,
            "page": page,
            "limit": limit,
            "total_pages": math.ceil(total / limit) if total > 0 else 1,
            "data": data
        }

    @staticmethod
    async def create(session: AsyncSession, data: ProductCreate):
        # Admin
        product = Product(**data.model_dump())
        session.add(product)
        await session.commit()
        await session.refresh(product)
        return await ProductService.get_product_with_images(session, product.id)

    @staticmethod
    async def update(session: AsyncSession, id: uuid.UUID, data: ProductUpdate):
        # Admin
        product = await session.get(Product, id)
        if not product: raise HTTPException(status_code=404, detail="Product not found")

        for key, value in data.model_dump(exclude_unset=True).items():
            setattr(product, key, value)

        session.add(product)
        await session.commit()
        return await ProductService.get_product_with_images(session, id)

    @staticmethod
    async def add_image(session: AsyncSession, product_id: uuid.UUID, data: ProductImageCreate):
        # Admin
        product = await session.get(Product, product_id)
        if not product: raise HTTPException(status_code=404, detail="Product not found")

        image = ProductImage(**data.model_dump(), product_id=product_id)
        session.add(image)
        await session.commit()
        await session.refresh(image)
        return image

    @staticmethod
    async def add_review(session: AsyncSession, product_id: uuid.UUID, user_id: uuid.UUID, data: ReviewCreate):
        # Customer
        product = await session.get(Product, product_id)
        if not product: raise HTTPException(status_code=404, detail="Product not found")

        review = Review(**data.model_dump(), product_id=product_id, user_id=user_id)
        session.add(review)

        # Update aggregate rating logic
        product.review_count += 1
        product.average_rating = ((product.average_rating * (
                    product.review_count - 1)) + review.rating) / product.review_count

        session.add(product)
        await session.commit()
        await session.refresh(review)
        return review

    @staticmethod
    async def get_reviews(session: AsyncSession, product_id: uuid.UUID):
        result = await session.exec(
            select(Review).where(Review.product_id == product_id).order_by(desc(Review.created_at)))
        return result.all()