import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../services/auth-services.service';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit {
  // Estados de la interfaz
  currentStep: 'identifier' | 'password' = 'identifier';
  identifierType: 'email' | 'username' | null = null;
  isLoading = false;
  showPassword = false;
  
  // Formularios
  identifierForm!: FormGroup;
  passwordForm!: FormGroup;
  
  // Datos del usuario
  userIdentifier = '';
  detectedUserType = '';

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.initializeForms();
  }

  private initializeForms(): void {
    this.identifierForm = this.fb.group({
      identifier: ['', [Validators.required, Validators.minLength(3)]]
    });

    this.passwordForm = this.fb.group({
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  // Paso 1: Analizar el identificador
  async analyzeIdentifier(): Promise<void> {
    if (!this.identifierForm.valid) {
      this.markFormGroupTouched(this.identifierForm);
      return;
    }

    this.isLoading = true;
    this.userIdentifier = this.identifierForm.get('identifier')?.value.trim();
    
    // Simular análisis con animación
    await this.simulateAnalysis();
    
    // Determinar tipo de identificador
    this.identifierType = this.detectIdentifierType(this.userIdentifier);
    
    this.isLoading = false;
    this.currentStep = 'password';
  }

  private async simulateAnalysis(): Promise<void> {
    // Ya no necesitamos simular análisis, los datos vienen directamente de la API
    return Promise.resolve();
  }

  private detectIdentifierType(identifier: string): 'email' | 'username' {
    // Lógica de detección mejorada
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (emailPattern.test(identifier)) {
      this.detectedUserType = 'Profesor/Guardian';
      return 'email';
    } else {
      this.detectedUserType = 'Estudiante';
      return 'username';
    }
  }

  // Paso 2: Iniciar sesión
  async handleLogin(): Promise<void> {
    if (!this.passwordForm.valid) {
      this.markFormGroupTouched(this.passwordForm);
      return;
    }

    this.isLoading = true;
    const password = this.passwordForm.get('password')?.value;
    
    try {
      if (this.identifierType === 'email') {
        await this.loginWithEmail(password);
      } else {
        await this.loginWithUsername(password);
      }
    } catch (error) {
      console.error('Error en login:', error);
      alert('Error al iniciar sesión. Por favor, verifica tus credenciales.');
    } finally {
      this.isLoading = false;
    }
  }

  private async loginWithEmail(password: string): Promise<void> {
    const loginData = {
      email: this.userIdentifier,
      password,
      rememberMe: true,
      deviceInfo: this.getDeviceInfo(),
      userAgent: navigator.userAgent,
      ipAddress: '' // Se puede obtener del backend
    };

    return new Promise((resolve, reject) => {
      this.authService.login(loginData).subscribe({
        next: (response: any) => {
          this.handleSuccessfulLogin(response);
          resolve();
        },
        error: (error) => {
          reject(error);
        }
      });
    });
  }

  private async loginWithUsername(password: string): Promise<void> {
    const studentLoginData = {
      username: this.userIdentifier,
      password,
      rememberMe: true,
      deviceInfo: this.getDeviceInfo(),
      userAgent: navigator.userAgent,
      ipAddress: '' // Se puede obtener del backend
    };

    return new Promise((resolve, reject) => {
      this.authService.studentLogin(studentLoginData).subscribe({
        next: (response: any) => {
          this.handleSuccessfulLogin(response);
          resolve();
        },
        error: (error) => {
          reject(error);
        }
      });
    });
  }

  private handleSuccessfulLogin(response: any): void {
    // Guardar token y datos del usuario
    this.authService.setToken(response.accessToken);
    
    if (response.userInfo?.id) {
      this.authService.setUserId(response.userInfo.id.toString());
    }

    // Navegar basado en el tipo de usuario
    const userRole = response.userInfo?.role?.code;
    this.navigateBasedOnRole(userRole);
  }

  private navigateBasedOnRole(roleCode: string): void {
    switch (roleCode) {
      case 'STUDENT':
        this.router.navigate(['/home']);
        break;
      case 'TEACHER':
        this.router.navigate(['/teacher-dashboard']);
        break;
      case 'GUARDIAN':
        this.router.navigate(['/guardian-dashboard']);
        break;
      default:
        this.router.navigate(['/home']);
    }
  }

  private getDeviceInfo(): string {
    return `${navigator.platform} - ${navigator.userAgent.split(' ')[0]}`;
  }

  // Utilidades
  goBack(): void {
    if (this.currentStep === 'password') {
      this.currentStep = 'identifier';
      this.identifierType = null;
      this.passwordForm.reset();
    } else {
      window.history.back();
    }
  }

  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }

  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.keys(formGroup.controls).forEach(key => {
      const control = formGroup.get(key);
      control?.markAsTouched();
    });
  }

  // Getters para el template
  get identifier() { return this.identifierForm.get('identifier'); }
  get password() { return this.passwordForm.get('password'); }
  get isIdentifierValid() { return this.identifierForm.valid; }
  get isPasswordValid() { return this.passwordForm.valid; }
}
