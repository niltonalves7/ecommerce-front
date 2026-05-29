import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, tap } from 'rxjs';

import { AuthResponse, LoginRequest, RegisterRequest } from '../models/auth.model';

@Injectable({ providedIn: 'root' })
export class AuthService {

    private readonly STORAGE_KEY = 'user_data';
    private currentUserSubject = new BehaviorSubject<AuthResponse | null>(null);
    public currentUser$ = this.currentUserSubject.asObservable();

    constructor(private http: HttpClient, private router: Router) {
        const savedUser = localStorage.getItem(this.STORAGE_KEY);
        if (savedUser) {
            this.currentUserSubject.next(JSON.parse(savedUser));
        }
    }

    login(credentials: LoginRequest): Observable<AuthResponse> {
        return this.http.post<AuthResponse>('/auth/login', credentials).pipe(
            tap(user => {
                localStorage.setItem(this.STORAGE_KEY, JSON.stringify(user));
                this.currentUserSubject.next(user);
            })
        );
    }

    register(data: RegisterRequest): Observable<AuthResponse> {
        return this.http.post<AuthResponse>('/auth/register', data).pipe(
            tap(user => {
                localStorage.setItem(this.STORAGE_KEY, JSON.stringify(user));
                this.currentUserSubject.next(user);
            })
        );
    }

    updateCurrentUser(user: AuthResponse) {
        this.currentUserSubject.next(user);
    }

    logout() {
        localStorage.removeItem(this.STORAGE_KEY);
        this.currentUserSubject.next(null);
        this.router.navigate(['/login']);
    }

    getToken(): string | null {
        return this.currentUserSubject.value?.token ?? null;
    }

    get isLoggedIn(): boolean {
        return this.currentUserSubject.value !== null;
    }

    get currentUser(): AuthResponse | null {
        return this.currentUserSubject.value;
    }
}