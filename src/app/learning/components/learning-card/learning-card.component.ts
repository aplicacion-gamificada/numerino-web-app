import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface LearningCard {
  id: number;
  title: string;
  subtitle: string;
  exerciseCount: number;
  status: 'COMPLETADO' | 'EN PROCESO' | 'BLOQUEADO';
  points: number;
  isBlocked?: boolean;
}

@Component({
  selector: 'app-learning-card',
  imports: [CommonModule],
  templateUrl: './learning-card.component.html',
  styleUrl: './learning-card.component.scss'
})
export class LearningCardComponent {
@Input() card!: LearningCard;

  getStatusClass(): string {
    switch (this.card.status) {
      case 'COMPLETADO':
        return 'status-completed';
      case 'EN PROCESO':
        return 'status-in-progress';
      case 'BLOQUEADO':
        return 'status-blocked';
      default:
        return '';
    }
  }

  getStatusColor(): string {
    switch (this.card.status) {
      case 'COMPLETADO':
        return '#4CAF50';
      case 'EN PROCESO':
        return '#FF9800';
      case 'BLOQUEADO':
        return '#9E9E9E';
      default:
        return '#9E9E9E';
    }
  }
}
