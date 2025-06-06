import { Component, Input  } from '@angular/core';

@Component({
  selector: 'app-progress-bar',
  imports: [],
  templateUrl: './progress-bar.component.html',
  styleUrl: './progress-bar.component.scss'
})
export class ProgressBarComponent {
  @Input() level: string = 'Nivel 1';
  @Input() progress: number = 0; // En porcentaje: 0 - 100
  @Input() points: number = 0;
  @Input() streak: number = 0;
  @Input() completed: number = 0;
  @Input() total: number = 0;
}
