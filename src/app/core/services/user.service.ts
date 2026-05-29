import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { User } from '../models/user.model';

export interface UpdateProfileRequest {
    name: string;
    email: string;
}

export interface UpdatePasswordRequest {
    currentPassword: string;
    newPassword: string;
}

@Injectable({ providedIn: 'root' })
  export class UserService {
    constructor(private http: HttpClient) {}

    register(user: User): Observable<User> {
      return this.http.post<User>('/users', user);
    }

    getProfile(): Observable<User> {
        return this.http.get<User>('/account/profile');
    }

    updateProfile(data: UpdateProfileRequest): Observable<User> {
        return this.http.put<User>('/account/profile', data);
    }

    updatePassword(data: UpdatePasswordRequest): Observable<void> {
        return this.http.put<void>('/account/password', data);
    }
}