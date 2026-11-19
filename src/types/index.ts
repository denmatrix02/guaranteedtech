export type ProductCondition = "BRAND_NEW" | "REFURBISHED" | "USED" | "OPEN_BOX";

export type AvailabilityStatus = "IN_STOCK" | "LOW_STOCK" | "OUT_OF_STOCK" | "PRE_ORDER" | "SOURCING_AVAILABLE";

export type IntendedUsage =
  | "OFFICE"
  | "BUSINESS"
  | "GAMING"
  | "WORKSTATION"
  | "STUDENT"
  | "GRAPHIC_DESIGN"
  | "PROGRAMMING"
  | "ENGINEERING"
  | "GENERAL_PRODUCTIVITY";

export interface ProductVariantDTO {
  id: string;
  productId: string;
  sku: string;
  name: string;
  ram?: string | null;
  storage?: string | null;
  color?: string | null;
  cpu?: string | null;
  priceAdjustment: number;
  stockQuantity: number;
  isDefault: boolean;
}

export interface ProductImageDTO {
  id: string;
  url: string;
  altText?: string | null;
  isPrimary: boolean;
  displayOrder: number;
}

export interface ProductSpecDTO {
  id: string;
  category: string;
  specKey: string;
  specValue: string;
  displayOrder: number;
}

export interface ProductDTO {
  id: string;
  name: string;
  slug: string;
  sku: string;
  brand: {
    id: string;
    name: string;
    slug: string;
    logoUrl?: string | null;
  };
  category: {
    id: string;
    name: string;
    slug: string;
  };
  series?: string | null;
  modelNumber?: string | null;
  condition: ProductCondition;
  conditionDetails?: string | null;
  basePrice: number;
  comparePrice?: number | null;
  discountPercent?: number | null;
  stockQuantity: number;
  availabilityStatus: AvailabilityStatus;
  warrantyMonths: number;
  warrantyDetails?: string | null;
  shortDescription?: string | null;
  fullDescription?: string | null;
  intendedUsage?: string | null;
  isFeatured: boolean;
  isBestSeller: boolean;
  isNewArrival: boolean;
  isSpecialOffer: boolean;
  viewCount: number;
  salesCount: number;
  images: ProductImageDTO[];
  variants: ProductVariantDTO[];
  specifications: ProductSpecDTO[];
}

export interface CartItem {
  productId: string;
  variantId?: string | null;
  product: {
    id: string;
    name: string;
    slug: string;
    basePrice: number;
    comparePrice?: number | null;
    imageUrl: string;
    sku: string;
    condition: string;
  };
  variant?: {
    id: string;
    name: string;
    priceAdjustment: number;
    ram?: string | null;
    storage?: string | null;
  } | null;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface FilterParams {
  category?: string;
  brand?: string[];
  minPrice?: number;
  maxPrice?: number;
  condition?: ProductCondition[];
  usage?: string[];
  ram?: string[];
  storage?: string[];
  processor?: string[];
  sort?: "featured" | "price_asc" | "price_desc" | "newest" | "rating";
  page?: number;
  limit?: number;
  query?: string;
}

