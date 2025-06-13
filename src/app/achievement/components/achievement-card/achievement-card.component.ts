import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-achievement-card',
  imports: [CommonModule],
  templateUrl: './achievement-card.component.html',
  styleUrl: './achievement-card.component.scss'
})
export class AchievementCardComponent {
  @Input() imageUrl!: string;
  @Input() title!: string;
  @Input() titleColor: string = '#000000';
  @Input() subtitle!: string;
  @Input() points!: string;
  @Input() pointsColor: string = '#000000';
}
