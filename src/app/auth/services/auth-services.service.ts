import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LoginRequest, StudentLoginRequest } from '../models/login.model';
import { ForgotPasswordRequest, RefreshTokenRequest, ResetPasswordRequest } from '../models/auth-aux.model';
import { environment } from '../../environment/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private baseUrl = `${environment.apiUrl}/auth`;

  private tokenKey = 'accessToken';
  private userIdKey = 'userId';

  constructor(private http: HttpClient) {}

  login(data: LoginRequest) {
    return this.http.post(`${this.baseUrl}/login`, data);
  }

  studentLogin(data: StudentLoginRequest) {
    return this.http.post(`${this.baseUrl}/student-login`, data);
  }

  refreshToken(data: RefreshTokenRequest) {
    return this.http.post(`${this.baseUrl}/refresh-token`, data);
  }

  forgotPassword(data: ForgotPasswordRequest) {
    return this.http.post(`${this.baseUrl}/forgot-password`, data);
  }

  resetPassword(data: ResetPasswordRequest) {
    return this.http.post(`${this.baseUrl}/reset-password`, data);
  }

  isAuthenticated(): boolean {
    const token = localStorage.getItem(this.tokenKey);
    return !!token;
  }

  setToken(token: string): void {
    localStorage.setItem('accessToken', token);
  }

  logout(): void {
    localStorage.removeItem(this.tokenKey);
  }

  setUserId(id: string): void {
    localStorage.setItem(this.userIdKey, id);
  }

  getUserId(): string | null {
    return localStorage.getItem(this.userIdKey);
  }

  getStudentInfo(userId: string) {
    return this.http.get(`${this.baseUrl.replace('/auth', '')}/users/students/${userId}`);
  }

  // Método para verificar si un identificador es válido (simulado)
  checkIdentifierAvailability(identifier: string): Observable<{exists: boolean, type: 'email' | 'username'}> {
    // Simulación - en producción esto haría una llamada real al backend
    const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(identifier);
    
    return new Observable(observer => {
      setTimeout(() => {
        observer.next({
          exists: true, // Siempre existe para la simulación
          type: isEmail ? 'email' : 'username'
        });
        observer.complete();
      }, 1000);
    });
  }

  // Método para obtener información del dispositivo
  getDeviceInfo(): string {
    return `${navigator.platform} - ${navigator.appVersion}`;
  }
}
