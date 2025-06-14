import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-progress-bar',
  imports: [],
  templateUrl: './progress-bar.component.html',
  styleUrl: './progress-bar.component.scss'
})
export class ProgressBarComponent {
  @Input() bloqueNombre: string = 'Bloque 1';
  @Input() progreso: number = 0; 
  @Input() bloqueImagenUrl?: string; 
}
