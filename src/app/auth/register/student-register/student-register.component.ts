import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RegisterService } from '../../services/register.service';
import { StudentRegisterRequest } from '../../models/student-register.model';

@Component({
  selector: 'app-student-register',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './student-register.component.html',
  styleUrl: './student-register.component.scss'
})
export class StudentRegisterComponent implements OnInit {
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
      nickname: ['', [Validators.required, Validators.minLength(2)]],
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
      classCode: ['']
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
        nickname: this.registrationForm.get('nickname')?.value,
        email: this.registrationForm.get('email')?.value,
        password: this.registrationForm.get('password')?.value,
        confirmPassword: this.registrationForm.get('confirmPassword')?.value,
        classCode: this.registrationForm.get('classCode')?.value
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

  private submitRegistration(data: any): void {
    const [firstName, ...lastNameArr] = data.fullName.trim().split(' ');
    const lastName = lastNameArr.join(' ') || '';

    const studentData: StudentRegisterRequest = {
      firstName: firstName,
      lastName: lastName,
      email: data.email,
      password: data.password,
      username: data.nickname,
      birth_date: '', 
      institutionId: 1, 
      guardianProfileId: 1 
    };

    this.registerService.registerStudent(studentData).subscribe({
      next: (response) => {
        this.router.navigate(['/home']);
      },
      error: (error) => {
        alert('Error al registrar. Por favor, inténtalo de nuevo.');
      }
    });
  }

  get fullName() { return this.registrationForm.get('fullName'); }
  get nickname() { return this.registrationForm.get('nickname'); }
  get email() { return this.registrationForm.get('email'); }
  get password() { return this.registrationForm.get('password'); }
  get confirmPassword() { return this.registrationForm.get('confirmPassword'); }
  get classCode() { return this.registrationForm.get('classCode'); }
}