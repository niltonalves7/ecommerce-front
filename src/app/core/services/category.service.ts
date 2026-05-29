import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { Category } from '../models/category.model';

export interface CreateCategoryRequest {
    name: string;
    description?: string;
}

export interface UpdateCategoryRequest {
    name: string;
    description?: string;
}

@Injectable({ providedIn: 'root' })
export class CategoryService {

    constructor(private http: HttpClient) {}

    getCategories(): Observable<Category[]> {
        return this.http.get<Category[]>('/categories');
    }

    createCategory(data: CreateCategoryRequest): Observable<Category> {
        return this.http.post<Category>('/categories', data);
    }

    updateCategory(id: string, data: UpdateCategoryRequest): Observable<Category> {
        return this.http.put<Category>(`/categories/${id}`, data);
    }

    deleteCategory(id: string): Observable<void> {
        return this.http.delete<void>(`/categories/${id}`);
    }
}