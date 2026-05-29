import { Component, OnInit } from '@angular/core';
import { CommonModule, CurrencyPipe, AsyncPipe } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { ProductService } from '../../../core/services/product.service';
import { CategoryService } from '../../../core/services/category.service';
import { ConfirmModalComponent } from '../../../shared/components/confirm-modal/confirm-modal.component';
import { Product } from '../../../core/models/product.model';
import { Category } from '../../../core/models/category.model';

@Component({
    selector: 'app-product-management',
    standalone: true,
    imports: [CommonModule, CurrencyPipe, ReactiveFormsModule, ConfirmModalComponent],
    templateUrl: './product-management.component.html'
})
export class ProductManagementComponent implements OnInit {
    products: Product[] = [];
    categories: Category[] = [];
    isLoading = true;
    showForm = false;
    isEditing = false;
    isModalOpen = false;
    selectedProductId: string | null = null;
    errorMessage: string | null = null;
    pendingDeleteId: string | null = null;

    productForm: FormGroup;

    constructor(
        private productService: ProductService,
        private categoryService: CategoryService,
        private fb: FormBuilder,
        private router: Router
    ) {
        this.productForm = this.fb.group({
            name: ['', [Validators.required, Validators.maxLength(100)]],
            description: ['', [Validators.required, Validators.maxLength(500)]],
            price: ['', [Validators.required, Validators.min(0.01)]],
            stockQuantity: ['', [Validators.required, Validators.min(0)]],
            imageUrl: [''],
            categoryId: ['', Validators.required]
        });
    }

    ngOnInit() {
        this.loadProducts();
        this.loadCategories();
    }

    loadProducts() {
        this.isLoading = true;
        this.productService.getProducts().subscribe({
            next: (response) => {
                this.products = response.content;
                this.isLoading = false;
            },
            error: () => this.isLoading = false
        });
    }

    loadCategories() {
        this.categoryService.getCategories().subscribe({
            next: (categories) => this.categories = categories,
            error: () => {}
        });
    }

    openCreateForm() {
        this.isEditing = false;
        this.selectedProductId = null;
        this.productForm.reset();
        this.showForm = true;
    }

    openEditForm(product: Product) {
        this.isEditing = true;
        this.selectedProductId = product.id;
        this.productForm.patchValue({
            name: product.name,
            description: product.description,
            price: product.price,
            stockQuantity: product.stockQuantity,
            imageUrl: product.imageUrl,
            categoryId: product.category?.id
        });
        this.showForm = true;
    }

    closeForm() {
        this.showForm = false;
        this.productForm.reset();
        this.errorMessage = null;
    }

    saveProduct() {
        if (this.productForm.invalid) return;

        const data = this.productForm.value;

        if (this.isEditing && this.selectedProductId) {
            this.productService.updateProduct(this.selectedProductId, data).subscribe({
                next: () => {
                    this.closeForm();
                    this.loadProducts();
                },
                error: (err) => this.errorMessage = err.error?.message || 'Erro ao atualizar produto.'
            });
        } else {
            this.productService.createProduct(data).subscribe({
                next: () => {
                    this.closeForm();
                    this.loadProducts();
                },
                error: (err) => this.errorMessage = err.error?.message || 'Erro ao criar produto.'
            });
        }
    }

    openDeleteModal(id: string) {
        this.pendingDeleteId = id;
        this.isModalOpen = true;
    }

    confirmDelete() {
        if (!this.pendingDeleteId) return;
        this.productService.deleteProduct(this.pendingDeleteId).subscribe({
            next: () => {
            this.loadProducts();
            this.closeModal();
            },
            error: (err) => {
            this.errorMessage = err.error?.message || 'Erro ao excluir produto.';
            this.closeModal();
            }
        });
    }

    closeModal() {
        this.isModalOpen = false;
        this.pendingDeleteId = null;
    }

    goBack() {
        this.router.navigate(['/admin']);
    }
}