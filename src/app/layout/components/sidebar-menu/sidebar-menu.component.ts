import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-sidebar-menu',
  imports: [RouterModule, CommonModule],
  templateUrl: './sidebar-menu.component.html',
  styleUrl: './sidebar-menu.component.scss'
})
export class SidebarMenuComponent {
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
