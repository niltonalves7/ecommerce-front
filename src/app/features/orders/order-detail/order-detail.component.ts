import { Component, OnInit } from '@angular/core';
import { CommonModule, CurrencyPipe, AsyncPipe } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Observable, switchMap } from 'rxjs';

import { OrderService } from '../../../core/services/order.service';
import { Order } from '../../../core/models/order.model';
import { OrderStatus } from '../../../core/models/order-status.enum';

@Component({
    selector: 'app-order-detail',
    standalone: true,
    imports: [CommonModule, CurrencyPipe, AsyncPipe, RouterModule],
    templateUrl: './order-detail.component.html'
})
export class OrderDetailComponent implements OnInit {
    order$!: Observable<Order>;
    OrderStatus = OrderStatus;

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private orderService: OrderService
    ) {}

    ngOnInit() {
        this.order$ = this.route.paramMap.pipe(
            switchMap(params => this.orderService.getOrderById(params.get('id')!))
        );
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
        this.router.navigate(['/orders']);
    }
}