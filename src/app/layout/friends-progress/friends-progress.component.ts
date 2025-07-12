import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Classmates } from '../../classroom/models/classmates.model';
import { ClassroomService } from '../../classroom/services/classroom.service';
import { FriendsComponent } from '../components/friends/friends.component';
import { AuthService } from '../../auth/services/auth-services.service';

@Component({
  selector: 'app-friends-progress',
  imports: [FriendsComponent, CommonModule],
  templateUrl: './friends-progress.component.html',
  styleUrl: './friends-progress.component.scss'
})
export class FriendsProgressComponent implements OnInit {
  classmates: Classmates[] = [];
  loading = true;
  error = false;

  constructor(
    private classroomService: ClassroomService,
    private authService: AuthService 
  ) { }

  ngOnInit(): void {
    const userId = Number(this.authService.getUserId());
    if (userId) {
      this.loadClassmates();
    } else {
      console.error('userId is required for FriendsProgressComponent');
      this.error = true;
      this.loading = false;
    }
  }

  loadClassmates(): void {
    this.loading = true;
    this.error = false;
    const userId = Number(this.authService.getUserId());
    this.classroomService.getClassmatesByUser(userId).subscribe({
      next: (data: Classmates[]) => {
        this.classmates = data;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading classmates:', error);
        this.error = true;
        this.loading = false;
      }
    });
  }

  trackByEmail(index: number, classmate: Classmates): string {
    return classmate.email;
  }
}
