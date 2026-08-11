export interface Product {
  id: string;
  name: string;
  genericName?: string;
  category: string;
  price: number;
  originalPrice?: number;
  rating?: number;
  image: string;
  strength?: string;
  manufacturer?: string;
  stock?: number;
}
