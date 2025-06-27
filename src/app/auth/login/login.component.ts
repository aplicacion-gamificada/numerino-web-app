import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../services/auth-services.service'; // Asegúrate de importar tu servicio

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit {
  registrationForm!: FormGroup;
  showPassword: boolean = false;
  showTooltip: boolean = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService // Inyecta el servicio
  ) { }

  ngOnInit(): void {
    this.initializeForm();
  }

  private initializeForm(): void {
    this.registrationForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(2)]],
      password: ['', [Validators.required, Validators.minLength(2)]]
    });
  }

  goBack(): void {
    window.history.back();
    console.log('Navegando hacia atrás');
  }

  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }

  handleSubmit(): void {
    if (this.registrationForm.valid) {
      const usernameValue = this.registrationForm.get('username')?.value;
      const passwordValue = this.registrationForm.get('password')?.value;
      const isEmail = usernameValue.includes('@');

      if (isEmail) {
        // Login con email
        const loginData = {
          email: usernameValue,
          password: passwordValue,
          rememberMe: true,
          deviceInfo: window.navigator.platform,
          userAgent: window.navigator.userAgent
        };
        this.authService.login(loginData).subscribe({
          next: (response: any) => {
            this.authService.setToken(response.accessToken); // Usa accessToken
            if (response.userInfo && response.userInfo.id != null) {
              this.authService.setUserId(response.userInfo.id.toString());
            }
            window.location.href = 'http://localhost:63196/home';
          },
          error: (error) => {
            alert('Error al iniciar sesión. Por favor, inténtalo de nuevo.');
          }
        });
      } else {
        // Login con username
        const studentLoginData = {
          username: usernameValue,
          password: passwordValue,
          rememberMe: true,
          deviceInfo: window.navigator.platform,
          userAgent: window.navigator.userAgent
        };
        this.authService.studentLogin(studentLoginData).subscribe({
          next: (response: any) => {
            this.authService.setToken(response.accessToken); // Usa accessToken
            if (response.userInfo && typeof response.userInfo.id !== 'undefined' && response.userInfo.id !== null) {
              this.authService.setUserId(response.userInfo.id.toString());
            } else {
              console.warn('userInfo o userInfo.id no está disponible en la respuesta:', response);
            }
            console.log('Token guardado:', response.accessToken);
            console.log('User ID guardado:', response.userInfo.id);
            this.router.navigate(['/home']);
          },
          error: (error) => {
            alert('Error al iniciar sesión. Por favor, inténtalo de nuevo.');
          }
        });
      }
    } else {
      this.markFormGroupTouched();
    }
  }

  private markFormGroupTouched(): void {
    Object.keys(this.registrationForm.controls).forEach(key => {
      const control = this.registrationForm.get(key);
      control?.markAsTouched();
    });
  }

  toggleTooltip(): void {
    this.showTooltip = !this.showTooltip;
  }

  hideTooltip(): void {
    this.showTooltip = false;
  }

  get username() { return this.registrationForm.get('username'); }
  get password() { return this.registrationForm.get('password'); }
}
