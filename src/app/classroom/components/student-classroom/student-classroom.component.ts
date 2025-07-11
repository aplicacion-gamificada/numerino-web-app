import { Component, OnInit } from '@angular/core';
import { SidebarMenuComponent } from '../../../layout/components/sidebar-menu/sidebar-menu.component';
import { FriendsCardComponent } from '../friends-card/friends-card.component';
import { NgFor } from '@angular/common';
import { ClassroomService } from '../../services/classroom.service';
import { AuthService } from '../../../auth/services/auth-services.service';
import { ClassRoomData } from '../../models/classroom-data.model';
import { Classmates } from '../../models/classmates.model';

@Component({
  selector: 'app-student-classroom',
  imports: [SidebarMenuComponent, FriendsCardComponent, NgFor],
  templateUrl: './student-classroom.component.html',
  styleUrl: './student-classroom.component.scss'
})
export class StudentClassroomComponent implements OnInit {
  classroomData: ClassRoomData | null = null;
  companeros: Classmates[] = [];

  constructor(
    private classroomService: ClassroomService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    const userId = Number(this.authService.getUserId());
    if (userId) {
      this.classroomService.getClassroomDataByUser(userId).subscribe({
        next: (data: ClassRoomData) => {
          console.log('Compañeros:', data);
          this.classroomData = data;
        }
      });
      this.classroomService.getClassmatesByUser(userId).subscribe({
        next: (data: Classmates[]) => {
          console.log('Compañeros:', data);
          this.companeros = data;
        },
        error: (err) => {
          console.error('Error al obtener compañeros:', err);
        }
      });
    }
  }
}
