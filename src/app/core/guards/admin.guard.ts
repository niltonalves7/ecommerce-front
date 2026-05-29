import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

import { AuthService } from '../services/auth.service';

export const adminGuard: CanActivateFn = () => {
    const authService = inject(AuthService);
    const router = inject(Router);

    if (!authService.isLoggedIn) {
        router.navigate(['/login']);
        return false;
    }

    if (authService.currentUser?.role !== 'ADMIN') {
        router.navigate(['/products']);
        return false;
    }

    return true;
};