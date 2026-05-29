import { Component, OnInit } from '@angular/core';
import { CommonModule, CurrencyPipe, AsyncPipe } from '@angular/common';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { OrderService } from '../../core/services/order.service';
import { Order } from '../../core/models/order.model';
import { OrderStatus } from '../../core/models/order-status.enum';

@Component({
    selector: 'app-orders',
    standalone: true,
    imports: [CommonModule, CurrencyPipe, AsyncPipe],
    templateUrl: './orders.component.html'
})
export class OrdersComponent implements OnInit {
    orders$!: Observable<Order[]>;
    isLoading = true;
    OrderStatus = OrderStatus;

    constructor(
        private orderService: OrderService,
        private router: Router
    ) {}

    ngOnInit() {
        this.orders$ = this.orderService.getOrders().pipe(
            map(response => {
                this.isLoading = false;
                return response.content;
            })
        );
    }

    verDetalhe(id: string) {
        this.router.navigate(['/orders', id]);
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
}