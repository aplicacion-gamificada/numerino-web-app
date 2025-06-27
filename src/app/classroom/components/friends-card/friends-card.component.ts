import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-friends-card',
  imports: [],
  templateUrl: './friends-card.component.html',
  styleUrl: './friends-card.component.scss'
})
export class FriendsCardComponent {
  @Input() nombre!: string;
  @Input() bloque!: string;
  @Input() imagenUrl!: string;
}
