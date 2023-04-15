export interface ProductTypes {
  name?: string;
  description?: string;
  brand?: string;
  category?: string;
  sizes?: string[];
  colors?: string[];
  user?: string;
  images?: string[];
  reviews?: string[];
  price?: number;
  totalQty?: number;
  totalSold?: number;
}

export interface ProductId {
  id: string;
}
export interface GetProductId {
  id: string;
}
export interface ProductQuery {
  name?: string;
  category?: string;
  brand?: string;
  price?: string;
  size?: string;
  color?: string;
  page?: number;
  limit?: number;
}
