import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RegisterService } from '../../services/register.service';
import { TeacherRegisterRequest } from '../../models/teacher-register.model';

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
    private router: Router,
    private registerService: RegisterService
  ) { }

  ngOnInit(): void {
    this.initializeForm();
  }

  private initializeForm(): void {
    this.registrationForm = this.fb.group({
      fullName: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.minLength(2)]],
      password: [
        '',
        [
          Validators.required,
          Validators.minLength(6),
          Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d])[A-Za-z\d\W]{6,}$/)
        ]
      ],
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
    const [firstName, ...lastName] = data.fullName.trim().split(' ');
    const lastNameStr = lastName.join(' ') || '';

    const teacherData: TeacherRegisterRequest = {
      firstName: firstName.trim(),
      lastName: lastNameStr.trim(),
      email: data.email.trim(),
      password: data.password,
      stemAreaId: 1,
      institutionId: 1
    }

    this.registerService.registerTeacher(teacherData).subscribe({
      next: (response) => {
        window.location.href = 'http://localhost:63196/home';
      },
      error: (error) => {
        alert('Error al registrar. Por favor, inténtalo de nuevo.');
      }
    });
  }

  get fullName() { return this.registrationForm.get('fullName'); }
  get email() { return this.registrationForm.get('email'); }
  get password() { return this.registrationForm.get('password'); }
  get confirmPassword() { return this.registrationForm.get('confirmPassword'); }
  get schoolCode() { return this.registrationForm.get('schoolCode'); }
  }
