import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { CreateProductRequest, Product, UpdateProductRequest } from '../models/product.model';
import { Page } from '../models/page.model';

@Injectable({ providedIn: 'root' })
export class ProductService {

    constructor(private http: HttpClient) {}

    getProducts(page: number = 0, size: number = 12, categoryId?: string, name?: string): Observable<Page<Product>> {
        let params = `?page=${page}&size=${size}`;
        if (categoryId) params += `&categoryId=${categoryId}`;
        if (name) params += `&name=${name}`;
        return this.http.get<Page<Product>>(`/products${params}`);
    }

    getById(id: string): Observable<Product> {
        return this.http.get<Product>(`/products/${id}`);
    }

    createProduct(data: CreateProductRequest): Observable<Product> {
        return this.http.post<Product>('/products', data);
    }

    updateProduct(id: string, data: UpdateProductRequest): Observable<Product> {
        return this.http.put<Product>(`/products/${id}`, data);
    }

    deleteProduct(id: string): Observable<void> {
        return this.http.delete<void>(`/products/${id}`);
    }
}