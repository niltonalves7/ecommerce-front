import { Component, OnInit } from '@angular/core';
import { CommonModule, AsyncPipe, CurrencyPipe } from '@angular/common';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { ProductService } from '../../../core/services/product.service';
import { CartService } from '../../../core/services/cart.service';
import { AuthService } from '../../../core/services/auth.service';
import { Product } from '../../../core/models/product.model';

@Component({
    selector: 'app-product-list',
    standalone: true,
    imports: [CommonModule, AsyncPipe, CurrencyPipe],
    templateUrl: './product-list.component.html'
})
export class ProductListComponent implements OnInit {
    products$!: Observable<Product[]>;
    isLoading = true;
    errorMessage: string | null = null;

    constructor(
        private productService: ProductService,
        private cartService: CartService,
        private router: Router,
        private authService: AuthService
    ) {}

    ngOnInit() {
        this.products$ = this.productService.getProducts().pipe(
            map(response => {
                this.isLoading = false;
                return response.content;
            })
        );
    }

    verDetalhe(id: string) {
        this.router.navigate(['/products', id]);
    }

    addToCart(event: Event, product: Product) {
    event.stopPropagation();

    if (!this.authService.isLoggedIn) {
        this.router.navigate(['/login']);
        return;
    }

    if (product.stockQuantity === 0) return;

    this.cartService.addItem({
        productId: product.id,
        quantity: 1
    }).subscribe();
}
}