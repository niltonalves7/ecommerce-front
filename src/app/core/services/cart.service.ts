import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { map } from 'rxjs/operators';

import { Cart, AddCartItemRequest, UpdateCartItemRequest } from '../models/cart.model';

@Injectable({ providedIn: 'root' })
export class CartService {

    private cartSubject = new BehaviorSubject<Cart | null>(null);
    cart$ = this.cartSubject.asObservable();

    private sidebarOpenSubject = new BehaviorSubject<boolean>(false);
    sidebarOpen$ = this.sidebarOpenSubject.asObservable();

    cartCount$ = this.cart$.pipe(
        map(cart => cart?.items?.reduce((acc, i) => acc + i.quantity, 0) ?? 0)
    );

    constructor(private http: HttpClient) {}

    loadCart(): Observable<Cart> {
        return this.http.get<Cart>('/cart').pipe(
            tap(cart => this.cartSubject.next(cart))
        );
    }

    addItem(request: AddCartItemRequest): Observable<Cart> {
        return this.http.post<Cart>('/cart/items', request).pipe(
            tap(cart => {
                this.cartSubject.next(cart);
                this.openSidebar();
            })
        );
    }

    updateItem(itemId: string, request: UpdateCartItemRequest): Observable<Cart> {
        return this.http.patch<Cart>(`/cart/items/${itemId}`, request).pipe(
            tap(cart => this.cartSubject.next(cart))
        );
    }

    removeItem(itemId: string): Observable<Cart> {
        return this.http.delete<Cart>(`/cart/items/${itemId}`).pipe(
            tap(cart => this.cartSubject.next(cart))
        );
    }

    clearCartState() {
        this.cartSubject.next(null);
    }   

    openSidebar() { this.sidebarOpenSubject.next(true); }
    closeSidebar() { this.sidebarOpenSubject.next(false); }
    toggleSidebar() { this.sidebarOpenSubject.next(!this.sidebarOpenSubject.value); }
}