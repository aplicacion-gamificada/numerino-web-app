import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-achievement-summary',
  imports: [CommonModule],
  templateUrl: './achievement-summary.component.html',
  styleUrl: './achievement-summary.component.scss'
})
export class AchievementSummaryComponent {
  @Input() imageUrl!: string;
  @Input() title!: string;
  @Input() subtitle!: string;
  @Input() subtitleColor: string = '#000000';
}
