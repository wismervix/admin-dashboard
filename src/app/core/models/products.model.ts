export interface ProductsApiResponse {
  products: Product[];
}

export interface Product {
  id: number;
  title: string;
  description: string;
  category: string;
  price: number;
  discountPercentage: number;
  rating: number;
  stock: number;
  tags: string[];
  brand: string;
  sku: string;
  weight: number;
  dimensions: Dimensions;
  warrantyInformation: string;
  shippingInformation: string;
  availabilityStatus: string;
  reviews: Review[];
  returnPolicy: string;
  minimumOrderQuantity: number;
  meta: Meta;
  images: string[];
  thumbnail: string;
  created_at: string; // ISO date string
  updated_at: string; // ISO date string
}

export interface Dimensions {
  width: number;
  height: number;
  depth: number;
}

export interface Review {
  rating: number;
  comment: string;
  date: Date; // could also be Date if you transform it
  reviewerName: string;
  reviewerEmail: string;
}

export interface Meta {
  createdAt: Date; // or Date if parsed
  updatedAt: Date; // or Date if parsed
  barcode: string;
  qrCode: string;
}

export interface DisplayImage {
  type: 'existing' | 'new';
  url: string;
  path?: string;
  file?: File;
}