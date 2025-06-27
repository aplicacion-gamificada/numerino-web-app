import { Component } from '@angular/core';
import { SidebarMenuComponent } from '../../../layout/components/sidebar-menu/sidebar-menu.component';
import { FriendsCardComponent } from '../friends-card/friends-card.component';
import { NgFor } from '@angular/common';

@Component({
  selector: 'app-student-classroom',
  imports: [SidebarMenuComponent, FriendsCardComponent, NgFor],
  templateUrl: './student-classroom.component.html',
  styleUrl: './student-classroom.component.scss'
})
export class StudentClassroomComponent {
companeros = [
    { nombre: 'Pepito', bloque: 'Bloque 1', imagenUrl: 'images/icon-avatar-1.png' },
    { nombre: 'Miguelito', bloque: 'Bloque 1', imagenUrl: 'images/icon-avatar-2.png' },
    { nombre: 'Andrea', bloque: 'Bloque 1', imagenUrl: 'images/icon-avatar-3.png' },
    { nombre: 'Juancito', bloque: 'Bloque 1', imagenUrl: 'images/icon-avatar-4.png' },
    { nombre: 'Carlitos', bloque: 'Bloque 1', imagenUrl: 'images/icon-avatar-5.png' },
    { nombre: 'Camila', bloque: 'Bloque 1', imagenUrl: 'images/icon-avatar-6.png' },
  ];
}
