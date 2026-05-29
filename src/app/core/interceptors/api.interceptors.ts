import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';

import { environment } from '../../../environments/environment';
import { AuthService } from '../services/auth.service';

export const apiInterceptor: HttpInterceptorFn = (req, next) => {
    const authService = inject(AuthService);
    const baseUrl = environment.apiUrl;

    if (!req.url.startsWith('/') && !req.url.startsWith(baseUrl)) {
        return next(req);
    }

    const token = authService.getToken();

    const apiReq = req.clone({
        url: `${baseUrl}${req.url}`,
        headers: token
            ? req.headers.set('Authorization', `Bearer ${token}`)
            : req.headers
    });

    return next(apiReq);
};