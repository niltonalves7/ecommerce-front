export interface CartItem {
    id: string;
    productId: string;
    productName: string;
    productImage?: string;
    unitPrice: number;
    quantity: number;
}

export interface Cart {
    id: string;
    items: CartItem[];
    total: number;
    updatedAt?: string;
}

export interface AddCartItemRequest {
    productId: string;
    quantity: number;
}

export interface UpdateCartItemRequest {
    quantity: number;
}