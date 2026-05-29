import { Routes } from '@angular/router';

import { authGuard } from './core/guards/auth.guard';
import { adminGuard } from './core/guards/admin.guard';

export const routes: Routes = [
    { path: '', loadComponent: () => import('./features/home/home.component').then(m => m.HomeComponent) },

    { path: 'login', loadComponent: () => import('./features/auth/login/login.component').then(m => m.LoginComponent) },
    { path: 'register', loadComponent: () => import('./features/auth/register/register.component').then(m => m.RegisterComponent) },

    { path: 'products', loadComponent: () => import('./features/product/product-list/product-list.component').then(m => m.ProductListComponent) },
    { path: 'products/:id', loadComponent: () => import('./features/product/product-detail/product-detail.component').then(m => m.ProductDetailComponent) },

    { path: 'checkout', loadComponent: () => import('./features/checkout/checkout.component').then(m => m.CheckoutComponent), canActivate: [authGuard] },

    { path: 'orders', loadComponent: () => import('./features/orders/orders.component').then(m => m.OrdersComponent), canActivate: [authGuard] },
    { path: 'orders/:id', loadComponent: () => import('./features/orders/order-detail/order-detail.component').then(m => m.OrderDetailComponent), canActivate: [authGuard] },

    { path: 'admin', loadComponent: () => import('./features/admin/dashboard/dashboard.component').then(m => m.DashboardComponent), canActivate: [adminGuard] },
    { path: 'admin/products', loadComponent: () => import('./features/admin/product-management/product-management.component').then(m => m.ProductManagementComponent), canActivate: [adminGuard] },
    { path: 'admin/categories', loadComponent: () => import('./features/admin/category-management/category-management.component').then(m => m.CategoryManagementComponent), canActivate: [adminGuard] },
    { path: 'admin/orders', loadComponent: () => import('./features/admin/order-management/order-management.component').then(m => m.OrderManagementComponent), canActivate: [adminGuard] },

    { path: 'account', loadComponent: () => import('./features/user/account/account.component').then(m => m.AccountComponent), canActivate: [authGuard] },

    { path: '**', redirectTo: '' }
];