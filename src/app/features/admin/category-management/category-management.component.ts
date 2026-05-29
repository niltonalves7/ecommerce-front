import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { CategoryService } from '../../../core/services/category.service';
import { ConfirmModalComponent } from '../../../shared/components/confirm-modal/confirm-modal.component';
import { Category } from '../../../core/models/category.model';

@Component({
    selector: 'app-category-management',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, ConfirmModalComponent],
    templateUrl: './category-management.component.html'
})
export class CategoryManagementComponent implements OnInit {
    categories: Category[] = [];
    isLoading = true;
    showForm = false;
    isEditing = false;
    isModalOpen = false;
    selectedCategoryId: string | null = null;
    errorMessage: string | null = null;
    pendingDeleteId: string | null = null;

    categoryForm: FormGroup;

    constructor(
        private categoryService: CategoryService,
        private fb: FormBuilder,
        private router: Router
    ) {
        this.categoryForm = this.fb.group({
            name: ['', [Validators.required, Validators.maxLength(100)]],
            description: ['', Validators.maxLength(255)]
        });
    }

    ngOnInit() {
        this.loadCategories();
    }

    loadCategories() {
        this.isLoading = true;
        this.categoryService.getCategories().subscribe({
            next: (categories) => {
                this.categories = categories;
                this.isLoading = false;
            },
            error: () => this.isLoading = false
        });
    }

    openCreateForm() {
        this.isEditing = false;
        this.selectedCategoryId = null;
        this.categoryForm.reset();
        this.showForm = true;
    }

    openEditForm(category: Category) {
        this.isEditing = true;
        this.selectedCategoryId = category.id;
        this.categoryForm.patchValue({
            name: category.name,
            description: category.description
        });
        this.showForm = true;
    }

    closeForm() {
        this.showForm = false;
        this.categoryForm.reset();
        this.errorMessage = null;
    }

    saveCategory() {
        if (this.categoryForm.invalid) return;

        const data = this.categoryForm.value;

        if (this.isEditing && this.selectedCategoryId) {
            this.categoryService.updateCategory(this.selectedCategoryId, data).subscribe({
                next: () => {
                    this.closeForm();
                    this.loadCategories();
                },
                error: (err) => this.errorMessage = err.error?.message || 'Erro ao atualizar categoria.'
            });
        } else {
            this.categoryService.createCategory(data).subscribe({
                next: () => {
                    this.closeForm();
                    this.loadCategories();
                },
                error: (err) => this.errorMessage = err.error?.message || 'Erro ao criar categoria.'
            });
        }
    }

    openDeleteModal(id: string) {
        this.pendingDeleteId = id;
        this.isModalOpen = true;
    }

    confirmDelete() {
        if (!this.pendingDeleteId) return;
        this.categoryService.deleteCategory(this.pendingDeleteId).subscribe({
            next: () => {
            this.loadCategories();
            this.closeModal();
            },
            error: (err) => {
            this.errorMessage = err.error?.message || 'Erro ao excluir categoria.';
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