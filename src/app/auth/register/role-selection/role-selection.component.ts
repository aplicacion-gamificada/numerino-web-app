import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';

@Component({
  selector: 'app-role-selection',
  imports: [],
  templateUrl: './role-selection.component.html',
  styleUrl: './role-selection.component.scss'
})
export class RoleSelectionComponent {
  constructor(
    private router: Router,
    private location: Location
  ) { }

  navigateToRegister(type: string): void {
    if (type == 'student') {
      this.router.navigate(['/student-register']);
    }
    else if (type == 'teacher') {
      this.router.navigate(['/teacher-register']);
    }
  }

  goBackToScreenX(): void {
    console.log('Regresando a la pantalla de Landing...');
    this.location.back();
  }
}
