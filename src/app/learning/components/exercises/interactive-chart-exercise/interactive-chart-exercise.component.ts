import { Component, OnInit, ViewChild, ElementRef, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

// Interfaces genéricas para ejercicios de conteo con elementos
export interface ItemData {
  symbol: string;
  name: string;
  largeCount: number;
  smallCount: number;
  color: string;
}

export interface ItemPosition {
  x: number;
  y: number;
  size: number;
  isLarge: boolean;
}

export interface InteractiveChartExerciseConfig {
  id: string;
  title: string;
  question: string;
  instructions: string;
  items: ItemData[];
  maxTotal: number;
  correctAnswers?: number[];
  allowSliderEdit: boolean;
}

@Component({
  selector: 'app-interactive-chart-exercise',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './interactive-chart-exercise.component.html',
  styleUrl: './interactive-chart-exercise.component.scss'
})
export class InteractiveChartExerciseComponent implements OnInit {
  @ViewChild('questionContainer', { static: false }) questionContainer!: ElementRef;
  @ViewChild('exerciseContainer', { static: false }) exerciseContainer!: ElementRef;

  // Configuración del ejercicio
  config: InteractiveChartExerciseConfig = {
    id: 'counting-exercise-1',
    title: 'Cuenta los Elementos',
    question: '¿Cuántos elementos hay de cada tipo?',
    instructions: 'Observa los elementos y ajusta los valores con los deslizadores según lo que veas.',
    allowSliderEdit: true,
    maxTotal: 25,
    items: [
      { symbol: '🐶', name: 'Perros', largeCount: 5, smallCount: 3, color: '#FFB366' },
      { symbol: '😺', name: 'Gatos', largeCount: 4, smallCount: 2, color: '#66B3FF' },
      { symbol: '🐰', name: 'Conejos', largeCount: 3, smallCount: 4, color: '#66FF66' }
    ]
  };

  // Estado del ejercicio
  currentView: 'question' | 'exercise' = 'question';
  itemPositions: Map<string, ItemPosition[]> = new Map();
  sliderValues: number[] = [];
  isCompleted = false;
  showFeedback = false;
  feedbackMessage = '';
  isCorrect = false;
  isTransitioning = false;

  // Configuración de tamaños
  private readonly LARGE_SIZE = 48;
  private readonly SMALL_SIZE = 32;
  private readonly CONTAINER_PADDING = 40;

  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadExerciseConfig();
    this.initializeSliderValues();
    this.generateItemPositions();
  }

  private loadExerciseConfig(): void {
    const savedConfig = sessionStorage.getItem('currentInteractiveExerciseConfig');
    if (savedConfig) {
      try {
        this.config = JSON.parse(savedConfig);
      } catch (error) {
        console.error('Error parsing exercise config:', error);
      }
    }
  }

  private initializeSliderValues(): void {
    this.sliderValues = this.config.items.map(() => 0);
  }

  private generateItemPositions(): void {
    this.itemPositions.clear();
    
    this.config.items.forEach((item, index) => {
      const positions: ItemPosition[] = [];
      
      // Generar posiciones para elementos grandes
      for (let i = 0; i < item.largeCount; i++) {
        positions.push(this.generateRandomPosition(true));
      }
      
      // Generar posiciones para elementos pequeños
      for (let i = 0; i < item.smallCount; i++) {
        positions.push(this.generateRandomPosition(false));
      }
      
      this.itemPositions.set(item.symbol, positions);
    });
  }

  private generateRandomPosition(isLarge: boolean): ItemPosition {
    const size = isLarge ? this.LARGE_SIZE : this.SMALL_SIZE;
    const maxX = 100 - (size / 6); // Convertir a porcentaje
    const maxY = 100 - (size / 6);
    
    return {
      x: Math.random() * maxX,
      y: Math.random() * maxY,
      size,
      isLarge
    };
  }

  // Métodos para navegación entre vistas
  startExercise(): void {
    this.isTransitioning = true;
    
    setTimeout(() => {
      this.currentView = 'exercise';
      this.isTransitioning = false;
    }, 300);
  }

  goBackToQuestion(): void {
    this.isTransitioning = true;
    
    setTimeout(() => {
      this.currentView = 'question';
      this.isTransitioning = false;
    }, 300);
  }

  // Métodos para manejar sliders
  onSliderChange(itemIndex: number, value: number): void {
    this.sliderValues[itemIndex] = value;
    this.checkProgress();
  }

  onSliderInput(event: Event, itemIndex: number): void {
    const target = event.target as HTMLInputElement;
    const value = Number(target.value);
    this.onSliderChange(itemIndex, value);
  }

  private checkProgress(): void {
    const hasProgress = this.sliderValues.some(value => value > 0);
    // Aquí puedes agregar lógica adicional para el progreso
  }

  // Métodos para cálculos
  getTotalItems(itemIndex: number): number {
    const item = this.config.items[itemIndex];
    return item.largeCount + item.smallCount;
  }

  getCorrectTotal(): number {
    return this.config.items.reduce((total, item) => total + item.largeCount + item.smallCount, 0);
  }

  // Métodos para validación
  checkAnswer(): void {
    const correctAnswers = this.config.items.map(item => item.largeCount + item.smallCount);
    const isCorrect = this.sliderValues.every((value, index) => value === correctAnswers[index]);
    
    this.isCorrect = isCorrect;
    this.feedbackMessage = isCorrect 
      ? '¡Excelente! Has contado correctamente todos los elementos.' 
      : 'Revisa tu conteo. Algunos valores no son correctos.';
    
    this.showFeedback = true;
    this.isCompleted = isCorrect;
  }

  resetExercise(): void {
    this.initializeSliderValues();
    this.showFeedback = false;
    this.isCompleted = false;
    this.currentView = 'question';
    this.generateItemPositions();
  }

  continueToNext(): void {
    console.log('Continuar al siguiente ejercicio');
    this.router.navigate(['/exercise-demo']);
  }

  goBack(): void {
    this.router.navigate(['/exercise-demo']);
  }

  // Listeners para scroll
  @HostListener('wheel', ['$event'])
  onWheel(event: WheelEvent): void {
    if (this.currentView === 'exercise' && event.deltaY < 0) {
      event.preventDefault();
      this.goBackToQuestion();
    }
  }

  @HostListener('touchstart', ['$event'])
  onTouchStart(event: TouchEvent): void {
    if (this.currentView === 'exercise') {
      this.startY = event.touches[0].clientY;
    }
  }

  @HostListener('touchmove', ['$event'])
  onTouchMove(event: TouchEvent): void {
    if (this.currentView === 'exercise' && this.startY !== null) {
      const currentY = event.touches[0].clientY;
      const deltaY = currentY - this.startY;
      
      if (deltaY > 50) { // Deslizar hacia abajo para volver
        this.goBackToQuestion();
        this.startY = null;
      }
    }
  }

  @HostListener('touchend', ['$event'])
  onTouchEnd(event: TouchEvent): void {
    this.startY = null;
  }

  private startY: number | null = null;
} 