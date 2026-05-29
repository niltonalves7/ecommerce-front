import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { Order } from '../models/order.model';
import { Page } from '../models/page.model';
import { OrderStatus } from '../models/order-status.enum';

@Injectable({ providedIn: 'root' })
export class OrderService {

    constructor(private http: HttpClient) {}

    getOrders(page: number = 0, size: number = 10): Observable<Page<Order>> {
        return this.http.get<Page<Order>>(`/orders?page=${page}&size=${size}`);
    }

    getOrderById(id: string): Observable<Order> {
        return this.http.get<Order>(`/orders/${id}`);
    }

    updateOrderStatus(id: string, status: OrderStatus): Observable<void> {
    return this.http.patch<void>(`/orders/${id}/status`, { status });
}
}