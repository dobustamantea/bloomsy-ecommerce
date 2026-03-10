export interface ProductColor {
  name: string;
  hex: string;
}

export interface ProductReview {
  author: string;
  rating: number;
  comment: string;
  date: string;
}

export type ProductCategory =
  | "poleras"
  | "tops"
  | "faldas"
  | "abrigos"
  | "pantalones"
  | "bodys"
  | "chalecos"
  | "conjuntos";

export interface Product {
  id: string;
  slug: string;
  name: string;
  category: ProductCategory;
  price: number;
  originalPrice?: number;
  colors: ProductColor[];
  sizes: string[];
  images: string[];
  description: string;
  care: string[];
  isNew: boolean;
  isFeatured: boolean;
  reviews: ProductReview[];
}

export interface CartItem {
  product: Product;
  size: string;
  color: ProductColor;
  quantity: number;
}

export type SortOption =
  | "newest"
  | "price-asc"
  | "price-desc"
  | "best-seller";
