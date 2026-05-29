import { Component, OnInit } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { Router } from '@angular/router';

import { CartService } from '../../../core/services/cart.service';
import { Cart } from '../../../core/models/cart.model';

@Component({
    selector: 'app-cart-sidebar',
    standalone: true,
    imports: [CommonModule, CurrencyPipe],
    templateUrl: './cart-sidebar.component.html'
})
export class CartSidebarComponent implements OnInit {
    cart: Cart | null = null;
    isOpen = false;

    constructor(
        public cartService: CartService,
        private router: Router
    ) {}

    ngOnInit() {
        this.cartService.cart$.subscribe(cart => this.cart = cart);
        this.cartService.sidebarOpen$.subscribe(open => this.isOpen = open);
    }

    updateQuantity(itemId: string, quantity: number) {
        if (quantity < 1) return;
        this.cartService.updateItem(itemId, { quantity }).subscribe();
    }

    removeItem(itemId: string) {
        this.cartService.removeItem(itemId).subscribe();
    }

    checkout() {
        this.cartService.closeSidebar();
        this.router.navigate(['/checkout']);
    }
}