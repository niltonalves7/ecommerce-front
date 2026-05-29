import { OrderStatus } from './order-status.enum';

export interface OrderItem {
    id: string;
    productId: string;
    productName: string;
    quantity: number;
    unitPrice: number;
    createdAt?: string;
}

export interface Order {
    id: string;
    userId: string;
    status: OrderStatus;
    totalAmount: number;
    items: OrderItem[];
    createdAt?: string;
    updatedAt?: string;
}