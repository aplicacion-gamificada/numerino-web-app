import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { UserService } from '../../../auth/services/user.service';
import { catchError, finalize, forkJoin, switchMap } from 'rxjs';
import { StudentDetail } from '../../../auth/models/studentDetail.model';

@Component({
  selector: 'app-sidebar-menu',
  imports: [RouterModule, CommonModule],
  templateUrl: './sidebar-menu.component.html',
  styleUrl: './sidebar-menu.component.scss'
})
export class SidebarMenuComponent implements OnInit{
  studentDetail: StudentDetail | null = null;
  studentName: string = '';
  isLoading = false;
  hasError = false;
  errorMessage = '';

  constructor(private userService: UserService) { }

  ngOnInit(): void{
    this.loadStudentData();
  }

  loadStudentData(): void {
    this.isLoading = true;
    this.userService.getProfile().subscribe({
      next: (student: StudentDetail) => {
        this.studentDetail = student;
        this.studentName = student.fullName || student.firstName || '';
        this.user.name = this.studentName;
        this.user.avatar = student.profilePictureUrl || 'images/icon-avatar-2.png';
        this.isLoading = false;
      },
      error: (err) => {
        this.hasError = true;
        this.errorMessage = 'No se pudo cargar el perfil del estudiante';
        this.isLoading = false;
        console.error('Error al cargar perfil:', err);
      }
    });
  }

  menuItems = [
    { label: 'Inicio', icon: 'images/icon-home.png', route: '/home' },
    { label: 'Fichas', icon: 'images/icon-bloques.png', route: '/learning' },
    { label: 'Logros', icon: 'images/icon-logro.png', route: '/achievements' },
    { label: 'Progreso', icon: 'images/icon-progress.png', route: '/progress' },
    { label: 'Aula', icon: 'images/icon-classroom.png', route: '/classroom' },
    { label: 'Salir', icon: 'images/icon-logout.png', route: '/welcome' }
  ];

  user = {
    name: 'Diego Merino',
    avatar: 'images/icon-avatar-2.png'
  };
}
