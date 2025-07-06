import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LoginRequest, StudentLoginRequest } from '../models/login.model';
import { ForgotPasswordRequest, RefreshTokenRequest, ResetPasswordRequest } from '../models/auth-aux.model';
import { environment } from '../../environment/environment';
import { Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private baseUrl = `${environment.apiUrl}/auth`;
  private registerUrl = `${environment.apiUrl}/register`;

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

  /**
   * Verifica si un identificador (email o username) está disponible
   */
  checkIdentifierAvailability(identifier: string): Observable<{exists: boolean, type: 'email' | 'username'}> {
    const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(identifier);
    
    if (isEmail) {
      return this.http.get<boolean>(`${this.registerUrl}/check-email?email=${encodeURIComponent(identifier)}`)
        .pipe(
          map(isAvailable => ({
            exists: !isAvailable, // La API devuelve true si está disponible, nosotros queremos saber si existe
            type: 'email' as const
          }))
        );
    } else {
      return this.http.get<boolean>(`${this.registerUrl}/check-username?username=${encodeURIComponent(identifier)}`)
        .pipe(
          map(isAvailable => ({
            exists: !isAvailable, // La API devuelve true si está disponible, nosotros queremos saber si existe
            type: 'username' as const
          }))
        );
    }
  }

  /**
   * Método para obtener información del dispositivo
   */
  getDeviceInfo(): string {
    return `${navigator.platform} - ${navigator.appVersion}`;
  }
}
