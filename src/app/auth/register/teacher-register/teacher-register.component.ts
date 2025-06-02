import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-teacher-register',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './teacher-register.component.html',
  styleUrl: './teacher-register.component.scss'
})
export class TeacherRegisterComponent implements OnInit {
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
      fullName: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.minLength(2)]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]],
      schoolCode: ['']
    }, {
      validators: this.passwordMatchValidator
    });
  }

  private passwordMatchValidator(control: AbstractControl): { [key: string]: boolean } | null {
    const password = control.get('password');
    const confirmPassword = control.get('confirmPassword');

    if (!password || !confirmPassword) {
      return null;
    }

    return password.value === confirmPassword.value ? null : { passwordMismatch: true };
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

  toggleConfirmPassword(): void {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  hasPasswordMismatch(): boolean {
    const confirmPassword = this.registrationForm.get('confirmPassword');
    return confirmPassword?.touched &&
      confirmPassword?.value &&
      this.registrationForm.hasError('passwordMismatch');
  }

  handleSubmit(): void {
    if (this.registrationForm.valid) {
      const formData = {
        fullName: this.registrationForm.get('fullName')?.value,
        email: this.registrationForm.get('email')?.value,
        password: this.registrationForm.get('password')?.value,
        confirmPassword: this.registrationForm.get('confirmPassword')?.value,
        schoolCode: this.registrationForm.get('schoolCode')?.value
      };

      console.log('Datos del formulario:', formData);

      // Llamar al servicio de registro
      this.submitRegistration(formData);
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

      this.router.navigate(['/home']);

    } catch (error) {
      console.error('Error en el registro:', error);
      alert('Error al registrar. Por favor, inténtalo de nuevo.');
    }
  }

  // Getters para facilitar el acceso a los controles del formulario
  get fullName() { return this.registrationForm.get('fullName'); }
  get email() { return this.registrationForm.get('email'); }
  get password() { return this.registrationForm.get('password'); }
  get confirmPassword() { return this.registrationForm.get('confirmPassword'); }
  get schoolCode() { return this.registrationForm.get('schoolCode'); }
}
