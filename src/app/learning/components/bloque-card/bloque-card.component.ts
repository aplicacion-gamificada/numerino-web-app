import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface LearningBlock {
  id: number;
  title: string;
  subtitle?: string;
  completedLessons: number;
  totalLessons: number;
  points?: number;
  status: 'completed' | 'in-progress' | 'locked' | 'recommended';
  color: 'blue' | 'green' | 'coral' | 'gray';
  isSpecial?: boolean; // Para el bloque de refuerzo
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

    if (this.block.isSpecial) {
      classes.push('special-block');
    }

    if (this.block.status === 'locked') {
      classes.push('locked');
    }

    return classes.join(' ');
  }

  getDisplayId(): string {
    return this.block.isSpecial ? 'R' : this.block.id.toString();
  }
}
