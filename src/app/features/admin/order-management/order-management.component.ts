import { Component, OnInit } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { OrderService } from '../../../core/services/order.service';
import { Order } from '../../../core/models/order.model';
import { OrderStatus } from '../../../core/models/order-status.enum';

@Component({
    selector: 'app-order-management',
    standalone: true,
    imports: [CommonModule, CurrencyPipe, ReactiveFormsModule],
    templateUrl: './order-management.component.html'
})
export class OrderManagementComponent implements OnInit {
    orders: Order[] = [];
    isLoading = true;
    errorMessage: string | null = null;
    selectedOrder: Order | null = null;
    showStatusForm = false;
    OrderStatus = OrderStatus;

    statusForm: FormGroup;

    statuses = [
        OrderStatus.PENDING,
        OrderStatus.PROCESSING,
        OrderStatus.SHIPPED,
        OrderStatus.DELIVERED,
        OrderStatus.CANCELED,
        OrderStatus.REFUNDED
    ];

    constructor(
        private orderService: OrderService,
        private fb: FormBuilder,
        private router: Router
    ) {
        this.statusForm = this.fb.group({
            status: ['', Validators.required]
        });
    }

    ngOnInit() {
        this.loadOrders();
    }

    loadOrders() {
        this.isLoading = true;
        this.orderService.getOrders().subscribe({
            next: (response) => {
                this.orders = response.content;
                this.isLoading = false;
            },
            error: () => this.isLoading = false
        });
    }

    openStatusForm(order: Order) {
        this.selectedOrder = order;
        this.statusForm.patchValue({ status: order.status });
        this.showStatusForm = true;
    }

    closeStatusForm() {
        this.showStatusForm = false;
        this.selectedOrder = null;
        this.errorMessage = null;
    }

    updateStatus() {
        if (!this.selectedOrder || this.statusForm.invalid) return;

        const status = this.statusForm.value.status;

        this.orderService.updateOrderStatus(this.selectedOrder.id, status).subscribe({
            next: () => {
                this.closeStatusForm();
                this.loadOrders();
            },
            error: (err) => this.errorMessage = err.error?.message || 'Erro ao atualizar status.'
        });
    }

    getStatusLabel(status: OrderStatus): string {
        const labels: Record<OrderStatus, string> = {
            [OrderStatus.PENDING]: 'Aguardando pagamento',
            [OrderStatus.PROCESSING]: 'Em processamento',
            [OrderStatus.SHIPPED]: 'Enviado',
            [OrderStatus.DELIVERED]: 'Entregue',
            [OrderStatus.CANCELED]: 'Cancelado',
            [OrderStatus.REFUNDED]: 'Reembolsado'
        };
        return labels[status] ?? status;
    }

    getStatusColor(status: OrderStatus): string {
        const colors: Record<OrderStatus, string> = {
            [OrderStatus.PENDING]: 'bg-yellow-100 text-yellow-800',
            [OrderStatus.PROCESSING]: 'bg-blue-100 text-blue-800',
            [OrderStatus.SHIPPED]: 'bg-purple-100 text-purple-800',
            [OrderStatus.DELIVERED]: 'bg-green-100 text-green-800',
            [OrderStatus.CANCELED]: 'bg-red-100 text-red-800',
            [OrderStatus.REFUNDED]: 'bg-gray-100 text-gray-800'
        };
        return colors[status] ?? 'bg-gray-100 text-gray-800';
    }

    goBack() {
        this.router.navigate(['/admin']);
    }
}