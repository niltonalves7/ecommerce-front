import { Category } from './category.model';

export interface Product {
  id: string;
  name: string;
  description: string,
  price: number;
  stockQuantity: number;
  imageUrl?: string;
  category?: Category;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface CreateProductRequest {
    name: string;
    description: string;
    price: number;
    stockQuantity: number;
    imageUrl?: string;
    categoryId: string;
}

export interface UpdateProductRequest {
    name: string;
    description: string;
    price: number;
    stockQuantity?: number;
    imageUrl?: string;
    categoryId?: string;
}