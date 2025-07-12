import { Component, Input } from '@angular/core';
import { NgFor } from '@angular/common';
import { CommonModule } from '@angular/common';
import { Classmates } from '../../../classroom/models/classmates.model';

@Component({
  selector: 'app-friends',
  imports: [NgFor, CommonModule],
  templateUrl: './friends.component.html',
  styleUrl: './friends.component.scss'
})
export class FriendsComponent {
 @Input() classmate!: Classmates;
  
  imageError = false;

  onImageError(): void {
    this.imageError = true;
  }

  onFriendClick(): void {
    // Lógica para cuando se hace clic en un amigo
    console.log('Clicked on friend:', this.classmate.full_name);
  }

  getInitials(name: string): string {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  }
}
