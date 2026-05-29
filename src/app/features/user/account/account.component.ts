import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { UserService } from '../../../core/services/user.service';
import { AuthService } from '../../../core/services/auth.service';
import { User } from '../../../core/models/user.model';

@Component({
    selector: 'app-account',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule],
    templateUrl: './account.component.html'
})
export class AccountComponent implements OnInit {
    user: User | null = null;
    isLoading = true;

    profileForm: FormGroup;
    passwordForm: FormGroup;

    profileSuccess: string | null = null;
    profileError: string | null = null;
    passwordSuccess: string | null = null;
    passwordError: string | null = null;

    constructor(
        private userService: UserService,
        private authService: AuthService,
        private fb: FormBuilder,
        private router: Router,
         private cdr: ChangeDetectorRef
    ) {
        this.profileForm = this.fb.group({
            name: ['', [Validators.required, Validators.maxLength(100)]],
            email: ['', [Validators.required, Validators.email]]
        });

        this.passwordForm = this.fb.group({
            currentPassword: ['', Validators.required],
            newPassword: ['', [Validators.required, Validators.minLength(8)]],
            confirmPassword: ['', Validators.required]
        });
    }

    ngOnInit() {
        this.userService.getProfile().subscribe({
            next: (user) => {
                this.user = user;
                this.profileForm.patchValue({
                    name: user.name,
                    email: user.email
                });
                this.isLoading = false;
                this.cdr.detectChanges();
            },
            error: () => this.isLoading = false
        });
    }

    updateProfile() {
    if (this.profileForm.invalid) return;
    this.profileSuccess = null;
    this.profileError = null;

    const emailChanged = this.profileForm.value.email !== this.user?.email;

    this.userService.updateProfile(this.profileForm.value).subscribe({
        next: (updatedUser) => {
            if (emailChanged) {
                this.profileSuccess = 'Email alterado! Faça login novamente.';
                this.cdr.detectChanges();
                setTimeout(() => this.authService.logout(), 2000);
            } else {
                const currentUser = this.authService.currentUser;
                if (currentUser) {
                    const updated = { ...currentUser, name: updatedUser.name };
                    localStorage.setItem('user_data', JSON.stringify(updated));
                    this.authService.updateCurrentUser(updated);
                }
                this.profileSuccess = 'Dados atualizados com sucesso!';
                this.cdr.detectChanges();
            }
        },
        error: (err) => {
            this.profileError = err.error?.message || 'Erro ao atualizar dados.';
            this.cdr.detectChanges();
        }
    });
}

    updatePassword() {
        if (this.passwordForm.invalid) return;
        this.passwordSuccess = null;
        this.passwordError = null;

        const { newPassword, confirmPassword, currentPassword } = this.passwordForm.value;

        if (newPassword !== confirmPassword) {
            this.passwordError = 'As senhas não coincidem.';
            return;
        }

        this.userService.updatePassword({ currentPassword, newPassword }).subscribe({
        next: () => {
            this.passwordSuccess = 'Senha alterada! Faça login novamente.';
            this.cdr.detectChanges();
            setTimeout(() => this.authService.logout(), 2000);
        },
            error: (err) => {
                this.passwordError = err.error?.message || 'Erro ao alterar senha.';
                this.cdr.detectChanges();
            }
        });
    }

    goBack() {
        this.router.navigate(['/products']);
    }
}