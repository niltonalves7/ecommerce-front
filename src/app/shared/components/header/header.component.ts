import { Component, HostListener, OnInit } from '@angular/core';
import { CommonModule, AsyncPipe } from '@angular/common';
import { RouterModule } from '@angular/router';

import { AuthService } from '../../../core/services/auth.service';
import { CartService } from '../../../core/services/cart.service';

@Component({
    selector: 'app-header',
    standalone: true,
    imports: [CommonModule, AsyncPipe, RouterModule],
    templateUrl: './header.component.html'
})
export class HeaderComponent implements OnInit {
    isDropdownOpen = false;
    get isAdmin(): boolean {
        return this.authService.currentUser?.role === 'ADMIN';
        }

    constructor(
        public authService: AuthService,
        public cartService: CartService
    ) {}

    ngOnInit() {
        if (this.authService.isLoggedIn) {
            this.cartService.loadCart().subscribe();
        }
    }

    toggleDropdown() {
        this.isDropdownOpen = !this.isDropdownOpen;
    }

    closeDropdown() {
        this.isDropdownOpen = false;
    }

    logout() {
        this.isDropdownOpen = false;
        this.cartService.clearCartState();
        this.authService.logout();
    }

    @HostListener('document:click', ['$event'])
    onDocumentClick(event: MouseEvent) {
        const target = event.target as HTMLElement;
        if (!target.closest('#user-menu')) {
            this.isDropdownOpen = false;
        }
    }
}