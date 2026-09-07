import {type Product, type Category, type Brand, type Review } from "../../features/products/types";

export const MOCK_CATEGORIES: Category[] = [
  { id: "c1", name: "Books", slug: "books", count: 120 },
  { id: "c2", name: "Stationery", slug: "stationery", count: 85 },
  { id: "c3", name: "School Supplies", slug: "school-supplies", count: 200 },
  { id: "c4", name: "Office Supplies", slug: "office-supplies", count: 150 },
  { id: "c5", name: "Accessories", slug: "accessories", count: 45 },
];

export const MOCK_BRANDS: Brand[] = [
  { id: "b1", name: "Pace Publishing", slug: "pace-publishing", count: 45 },
  { id: "b2", name: "EcoPrint", slug: "ecoprint", count: 80 },
  { id: "b3", name: "Luxor", slug: "luxor", count: 30 },
  { id: "b4", name: "Casio", slug: "casio", count: 15 },
  { id: "b5", name: "Pilot", slug: "pilot", count: 50 },
];

export const MOCK_PRODUCTS: Product[] = [
  {
    id: "p1",
    name: "African Economic Horizons: Sustainable Growth",
    slug: "african-economic-horizons",
    description: "A comprehensive guide on sustainable economic growth strategies across the African continent.",
    sku: "BOK-AEH-001",
    price: 25000,
    discountPrice: 21500,
    stock: 50,
    categoryId: "c1",
    brandId: "b1",
    rating: 4.8,
    reviewsCount: 124,
    images: ["bg-blue-100", "bg-blue-200", "bg-blue-300"],
    isNew: false,
    isFeatured: true,
  },
  {
    id: "p2",
    name: "Premium Office Paper Ream (500 Sheets)",
    slug: "premium-office-paper-ream",
    description: "High-quality A4 printer paper for daily office use. Jam-free and extra bright.",
    sku: "STA-PPR-500",
    price: 11000,
    stock: 200,
    categoryId: "c4",
    brandId: "b2",
    rating: 4.5,
    reviewsCount: 89,
    images: ["bg-green-100", "bg-green-200"],
    isNew: false,
    isFeatured: true,
  },
  {
    id: "p3",
    name: "Executive Writing Pen Set",
    slug: "executive-writing-pen-set",
    description: "Premium smooth-writing pen set, perfect for professionals and gifting.",
    sku: "STA-PEN-002",
    price: 8500,
    stock: 0,
    categoryId: "c2",
    brandId: "b3",
    rating: 5.0,
    reviewsCount: 42,
    images: ["bg-slate-200"],
    isNew: true,
    isFeatured: false,
  },
  {
    id: "p4",
    name: "Scientific Calculator fx-991",
    slug: "scientific-calculator-fx-991",
    description: "Advanced scientific calculator for university and high school students.",
    sku: "ACC-CAL-991",
    price: 18000,
    discountPrice: 15000,
    stock: 35,
    categoryId: "c5",
    brandId: "b4",
    rating: 4.7,
    reviewsCount: 215,
    images: ["bg-gray-100", "bg-gray-200"],
    isNew: false,
    isFeatured: true,
  },
  {
    id: "p5",
    name: "Pilot G2 Retractable Gel Pens (Pack of 5)",
    slug: "pilot-g2-pens-pack",
    description: "Smooth writing gel pens in assorted colors.",
    sku: "STA-PEN-G2",
    price: 6500,
    stock: 120,
    categoryId: "c2",
    brandId: "b5",
    rating: 4.9,
    reviewsCount: 310,
    images: ["bg-red-100"],
    isNew: false,
    isFeatured: false,
  }
];

export const MOCK_REVIEWS: Review[] = [
  {
    id: "r1",
    productId: "p1",
    userId: "u1",
    userName: "Jean-Claude Kamga",
    rating: 5,
    comment: "Excellent book! Very insightful for my studies.",
    createdAt: "2026-08-15T10:00:00Z"
  },
  {
    id: "r2",
    productId: "p1",
    userId: "u2",
    userName: "Marie Ndongo",
    rating: 4,
    comment: "Good read, fast delivery.",
    createdAt: "2026-08-10T14:30:00Z"
  }
];