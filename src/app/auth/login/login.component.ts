import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit {
  registrationForm!: FormGroup;
  showPassword: boolean = false;
  showConfirmPassword: boolean = false;
  showTooltip: boolean = false;

  constructor(
    private fb: FormBuilder,
    private router: Router
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
    // Implementar navegación hacia atrás
    // Opción 1: Usar Router
    // this.router.navigate(['/login']);

    // Opción 2: Usar location
    // this.location.back();

    // Opción 3: Usar window.history
    window.history.back();

    console.log('Navegando hacia atrás');
  }

  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }

  handleSubmit(): void {
    if (this.registrationForm.valid) {
      const formData = {
        username: this.registrationForm.get('username')?.value,
        password: this.registrationForm.get('password')?.value
      };

      console.log('Datos del formulario:', formData);

      // Llamar al servicio de registro
      this.submitRegistration(formData);
      this.router.navigate(['/home']);
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

  private async submitRegistration(data: any): Promise<void> {
    try {
      // Aquí implementarías la llamada a tu servicio
      // Ejemplo:
      // const result = await this.authService.register(data);

      console.log('Enviando datos de registro:', data);

      // Simular respuesta exitosa
      setTimeout(() => {
        console.log('Registro exitoso');
        // Redirigir al usuario después del registro exitoso
        // this.router.navigate(['/dashboard']);
        alert('¡Registro exitoso!');
      }, 1000);

    } catch (error) {
      console.error('Error en el registro:', error);
      alert('Error al registrar. Por favor, inténtalo de nuevo.');
    }
  }

  // Getters para facilitar el acceso a los controles del formulario
  get username() { return this.registrationForm.get('username'); }
  get password() { return this.registrationForm.get('password'); }
}
