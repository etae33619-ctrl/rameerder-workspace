import  { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Star, Heart, ShoppingCart, Truck, ShieldCheck, Check } from "lucide-react";
import { Container } from "../../../components/ui/Container";
import { Button } from "../../../components/ui/Button";
// import { Badge } from "../../../components/ui/Badge";
import { LoadingState } from "../../../components/ui/LoadingState";
import { ErrorState } from "../../../components/ui/ErrorState";
import { productsApi } from "../../../features/products/api/products.api";
import { brandsApi } from "../../../features/products/api/brands.api";
import { type Product, type Brand, type Review } from "../../../features/products/types";
import { useCart } from "../../../features/cart/CartContext";
import { useWishlist } from "../../../features/wishlist/WishlistContext";
import { cn } from "../../../utils/cn";

export function ProductDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [brand, setBrand] = useState<Brand | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeImage, setActiveImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<"description" | "specifications" | "reviews">("description");

  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();

  useEffect(() => {
    if (!id) return;
    setIsLoading(true);
    productsApi.getProductById(id)
      .then(p => {
        setProduct(p);
        brandsApi.getBrands().then(brands => setBrand(brands.find(b => b.id === p.brandId) || null));
        productsApi.getProductReviews(id).then(setReviews);
      })
      .catch(err => setError(err.message))
      .finally(() => setIsLoading(false));
  }, [id]);

  if (isLoading) return <div className="min-h-[60vh] flex items-center justify-center"><LoadingState /></div>;
  if (error || !product) return <div className="py-16"><Container><ErrorState message={error || "Product not found"} /></Container></div>;

  const formatPrice = (price: number) => `FCFA ${price.toLocaleString()}`;
  const willed = isInWishlist(product.id);

  const handleBuyNow = () => {
    addToCart(product, quantity);
    navigate("/cart");
  };

  return (
    <div className="py-8 bg-brand-bg min-h-screen">
      <Container>
        <div className="mb-6 text-sm text-brand-muted">
          <Link to="/" className="hover:text-brand-blue">Home</Link> &rsaquo;{" "}
          <Link to="/shop" className="hover:text-brand-blue">Shop</Link> &rsaquo;{" "}
          <span className="text-brand-navy font-medium">{product.name}</span>
        </div>

        <div className="bg-white rounded-2xl border border-brand-border p-6 md:p-8 lg:p-12 mb-8 shadow-sm">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="space-y-4">
              <div className={cn("aspect-square w-full rounded-xl object-cover", product.images[activeImage] || "bg-slate-100")}></div>
              <div className="flex gap-4 overflow-x-auto pb-2">
                {product.images.map((img, idx) => (
                  <button key={idx} onClick={() => setActiveImage(idx)} className={cn("w-20 h-20 rounded-lg flex-shrink-0 border-2 transition-colors", activeImage === idx ? "border-brand-blue" : "border-transparent", img)} />
                ))}
              </div>
            </div>

            <div className="flex flex-col">
              <div className="mb-2">
                {brand && <span className="text-sm font-bold tracking-widest text-brand-blue uppercase">{brand.name}</span>}
              </div>
              <h1 className="text-3xl md:text-4xl font-extrabold text-brand-navy mb-4 leading-tight">{product.name}</h1>
              
              <div className="flex items-center gap-4 mb-6">
                <div className="flex items-center text-yellow-400">
                  {[...Array(5)].map((_, i) => <Star key={i} className={cn("w-5 h-5", i < Math.floor(product.rating) ? "fill-current" : "fill-transparent text-gray-300")} />)}
                </div>
                <span className="text-sm text-brand-blue font-medium cursor-pointer" onClick={() => setActiveTab("reviews")}>{product.reviewsCount} Reviews</span>
              </div>

              <div className="mb-6 flex items-end gap-3">
                <span className="text-4xl font-black text-brand-navy">{formatPrice(product.discountPrice || product.price)}</span>
                {product.discountPrice && <span className="text-xl text-brand-muted line-through mb-1">{formatPrice(product.price)}</span>}
              </div>

              <p className="text-brand-muted text-base mb-8 leading-relaxed">{product.description}</p>

              <div className="mb-8 p-4 bg-brand-bg rounded-xl border border-brand-border space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-brand-navy">Availability:</span>
                  {product.stock > 0 ? (
                    <span className="flex items-center gap-1 text-sm font-bold text-green-600"><Check className="w-4 h-4"/> In Stock ({product.stock})</span>
                  ) : (
                    <span className="text-sm font-bold text-brand-red">Out of Stock</span>
                  )}
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-brand-navy">Quantity:</span>
                  <div className="flex items-center border border-brand-border rounded-md bg-white">
                    <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="px-3 py-1 text-brand-navy hover:bg-slate-50 transition" disabled={product.stock === 0}>-</button>
                    <span className="px-4 font-semibold w-12 text-center">{quantity}</span>
                    <button onClick={() => setQuantity(Math.min(product.stock, quantity + 1))} className="px-3 py-1 text-brand-navy hover:bg-slate-50 transition" disabled={product.stock === 0}>+</button>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <Button size="lg" className="flex-1 gap-2 text-lg" disabled={product.stock === 0} onClick={() => addToCart(product, quantity)}>
                  <ShoppingCart className="w-5 h-5" /> ADD TO CART
                </Button>
                <Button size="lg" variant="secondary" className="flex-1 text-lg" disabled={product.stock === 0} onClick={handleBuyNow}>
                  BUY NOW
                </Button>
                <Button size="lg" variant="outline" className="px-6 text-brand-muted hover:text-brand-red transition-colors" onClick={() => toggleWishlist(product)}>
                  <Heart className={cn("w-6 h-6", willed ? "fill-brand-red text-brand-red" : "")} />
                </Button>
              </div>

              <div className="grid grid-cols-2 gap-4 border-t border-brand-border pt-6 mt-auto">
                <div className="flex items-center gap-3 text-brand-muted text-sm"><Truck className="w-5 h-5 text-brand-blue" /><span>Fast Delivery Nationwide</span></div>
                <div className="flex items-center gap-3 text-brand-muted text-sm"><ShieldCheck className="w-5 h-5 text-brand-blue" /><span>Secure Payments</span></div>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}