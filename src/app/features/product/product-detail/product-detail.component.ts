import { Component, OnInit } from '@angular/core';
import { CommonModule, AsyncPipe, CurrencyPipe } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, switchMap } from 'rxjs';

import { ProductService } from '../../../core/services/product.service';
import { CartService } from '../../../core/services/cart.service';
import { AuthService } from '../../../core/services/auth.service';
import { Product } from '../../../core/models/product.model';

@Component({
    selector: 'app-product-detail',
    standalone: true,
    imports: [CommonModule, AsyncPipe, CurrencyPipe],
    templateUrl: './product-detail.component.html'
})
export class ProductDetailComponent implements OnInit {
    product$!: Observable<Product>;

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private productService: ProductService,
        private cartService: CartService,
        private authService: AuthService
    ) {}

    ngOnInit() {
        this.product$ = this.route.paramMap.pipe(
            switchMap(params => this.productService.getById(params.get('id')!))
        );
    }

    addToCart(product: Product) {
    if (!this.authService.isLoggedIn) {
        this.router.navigate(['/login']);
        return;
    }
    this.cartService.addItem({
        productId: product.id,
        quantity: 1
    }).subscribe();
}

    goBack() {
        this.router.navigate(['/products']);
    }
}