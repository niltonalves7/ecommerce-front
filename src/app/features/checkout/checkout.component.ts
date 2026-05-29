import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { loadStripe, Stripe, StripeCardElement } from '@stripe/stripe-js';

import { environment } from '../../../environments/environment';
import { CartService } from '../../core/services/cart.service';

interface OrderResponse {
    id: string;
    totalAmount: number;
    status: string;
}

interface PaymentResponse {
    clientSecret: string;
    paymentId: string;
    status: string;
}

@Component({
    selector: 'app-checkout',
    standalone: true,
    imports: [CommonModule, CurrencyPipe],
    templateUrl: './checkout.component.html'
})
export class CheckoutComponent implements OnInit {
    stripe: Stripe | null = null;
    cardElement: StripeCardElement | null = null;
    clientSecret: string | null = null;

    isLoading = false;
    isProcessing = false;
    errorMessage: string | null = null;
    successMessage: string | null = null;

    orderId: string | null = null;
    totalAmount = 0;

    constructor(
        private http: HttpClient,
        private router: Router,
        private cdr: ChangeDetectorRef,
        private cartService: CartService
    ) {}

    async ngOnInit() {
        this.stripe = await loadStripe(environment.stripePublishableKey);
        this.createOrder();
    }

    createOrder() {
        this.isLoading = true;
        this.http.post<OrderResponse>('/orders/checkout', {}).subscribe({
            next: (order) => {
                console.log('Order criada:', order);
                this.orderId = order.id;
                this.totalAmount = order.totalAmount;
                this.cartService.clearCartState();
                this.cdr.detectChanges(); 
                this.createPayment();
            },
            error: (err) => {
                this.isLoading = false;
                this.errorMessage = err.error?.message || 'Erro ao criar pedido.';
            }
        });
    }

    createPayment() {
        this.http.post<PaymentResponse>(`/payments/${this.orderId}`, {}).subscribe({
            next: (payment) => {
                this.clientSecret = payment.clientSecret;
                this.isLoading = false;
                this.cdr.detectChanges();
                this.mountCardElement(payment.clientSecret);
},
            error: (err) => {
                this.isLoading = false;
                this.errorMessage = err.error?.message || 'Erro ao criar pagamento.';
            }
        });
    }

    mountCardElement(clientSecret: string) {
        if (!this.stripe) return;

        const elements = this.stripe.elements();
        this.cardElement = elements.create('card', {
            style: {
                base: {
                    fontSize: '16px',
                    color: '#0a0a0a',
                    fontFamily: 'sans-serif',
                    '::placeholder': { color: '#9ca3af' }
                }
            }
        });

        this.cardElement.mount('#card-element');
    }

    async confirmPayment() {
        if (!this.stripe || !this.cardElement || !this.orderId) return;

        this.isProcessing = true;
        this.errorMessage = null;

        const { error } = await this.stripe.confirmCardPayment(
            this.clientSecret!,
            { payment_method: { card: this.cardElement } }
        );

        if (error) {
            this.isProcessing = false;
            this.errorMessage = error.message ?? 'Erro ao processar pagamento.';
        } else {
            this.isProcessing = false;
            this.cartService.clearCartState();
            this.successMessage = 'Pagamento realizado com sucesso!';
            setTimeout(() => this.router.navigate(['/orders']), 2000);
        }
    }

    goBack() {
        this.router.navigate(['/products']);
    }
}