import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { trigger, transition, style, animate } from '@angular/animations';

@Component({
  selector: 'app-achievement-card-expanded',
  imports: [CommonModule],
  templateUrl: './achievement-card-expanded.component.html',
  styleUrl: './achievement-card-expanded.component.scss',
  animations: [
    trigger('popupAnimation', [
      transition(':enter', [
        style({ opacity: 0, transform: 'scale(0.95)' }),
        animate('200ms ease-out', style({ opacity: 1, transform: 'scale(1)' }))
      ]),
      transition(':leave', [
        animate('150ms ease-in', style({ opacity: 0, transform: 'scale(0.95)' }))
      ])
    ])
  ]
})
export class AchievementCardExpandedComponent {
  @Input() imageUrl!: string;
  @Input() title!: string;
  @Input() titleColor: string = '#000';
  @Input() large_description!: string;
  @Input() description_points!: number;
  @Input() pointsColor: string = '#000';

  @Output() close = new EventEmitter<void>();
}
