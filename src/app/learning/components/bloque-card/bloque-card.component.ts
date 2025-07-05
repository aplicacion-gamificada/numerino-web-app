import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface LearningBlock {
  id: number;
  sequence: number;
  title: string;
  subtitle?: string;
  completedLessons: number;
  totalLessons: number;
  points?: number;
  status: 'completed' | 'in-progress' | 'locked' | 'recommended';
  color: 'primary' | 'secondary' | 'tertiary' | 'blue' | 'green' | 'success' | 'locked';
}

@Component({
  selector: 'app-bloque-card',
  imports: [CommonModule],
  templateUrl: './bloque-card.component.html',
  styleUrl: './bloque-card.component.scss'
})
export class BloqueCardComponent {
  @Input() block!: LearningBlock;
  @Input() position: 'left' | 'right' = 'left';

  getProgressPercentage(): number {
    if (this.block.totalLessons === 0) return 0;
    return (this.block.completedLessons / this.block.totalLessons) * 100;
  }

  getProgressDots(): boolean[] {
    const dots = new Array(this.block.totalLessons).fill(false);
    for (let i = 0; i < this.block.completedLessons; i++) {
      dots[i] = true;
    }
    return dots;
  }

  getBlockClass(): string {
    const classes = [`block-${this.block.color}`, `position-${this.position}`];

    if (this.block.status === 'locked') {
      classes.push('locked');
    }

    return classes.join(' ');
  }

  getDisplayNumber(): string {
    return this.block.sequence.toString();
  }

  getProgressText(): string {
    switch (this.block.status) {
      case 'completed':
        return `${this.block.completedLessons}/${this.block.totalLessons} Completados`;
      case 'in-progress':
        return `${this.block.completedLessons}/${this.block.totalLessons} Completados`;
      case 'recommended':
        return 'Recomendado';
      case 'locked':
        return '¡Desbloquea este módulo!';
      default:
        return '';
    }
  }
}
