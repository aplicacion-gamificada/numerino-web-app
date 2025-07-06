import { Component, OnInit, ViewChild, ElementRef, AfterViewInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

export interface SequenceData {
  values: number[];
  type: 'arithmetic' | 'geometric' | 'fibonacci' | 'custom' | 'unknown';
  commonDifference?: number;
  commonRatio?: number;
  formula?: string;
  nextValues?: number[];
}

export interface SequenceExerciseConfig {
  id: string;
  title: string;
  instructions: string;
  initialSequence: number[];
  targetPredictions: number;
  allowInput: boolean;
  showFormula: boolean;
  correctAnswers?: number[];
  hints?: string[];
}

@Component({
  selector: 'app-sequence-analysis-exercise',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './sequence-analysis-exercise.component.html',
  styleUrl: './sequence-analysis-exercise.component.scss'
})
export class SequenceAnalysisExerciseComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('sequenceCanvas', { static: false }) canvasRef!: ElementRef<HTMLCanvasElement>;
  
  // Configuración del ejercicio
  config: SequenceExerciseConfig = {
    id: 'sequence-analysis-1',
    title: 'Análisis de Secuencias',
    instructions: 'Analiza la secuencia numérica y predice los siguientes valores. Identifica el patrón y completa la secuencia.',
    initialSequence: [2, 5, 8, 11, 14],
    targetPredictions: 3,
    allowInput: true,
    showFormula: true,
    correctAnswers: [17, 20, 23],
    hints: [
      'Observa la diferencia entre números consecutivos',
      'Si la diferencia es constante, es una secuencia aritmética',
      'La fórmula general es: an = a1 + (n-1) × d'
    ]
  };

  // Estado del análisis
  sequenceData: SequenceData = {
    values: [],
    type: 'unknown'
  };

  // Entrada del usuario
  userInput: string = '';
  userSequence: number[] = [];
  userPredictions: number[] = [];
  currentPredictionIndex: number = 0;

  // Estado del ejercicio
  isAnalyzing: boolean = false;
  showAnalysis: boolean = false;
  showPredictions: boolean = false;
  isCompleted: boolean = false;
  showFeedback: boolean = false;
  feedbackMessage: string = '';
  isCorrect: boolean = false;
  currentHintIndex: number = 0;
  showHints: boolean = false;

  // Canvas para visualización
  private canvas!: HTMLCanvasElement;
  private ctx!: CanvasRenderingContext2D;

  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadExerciseConfig();
    this.initializeSequence();
  }

  ngAfterViewInit(): void {
    this.initializeCanvas();
    this.drawSequenceVisualization();
  }

  ngOnDestroy(): void {
    // Cleanup si es necesario
  }

  private loadExerciseConfig(): void {
    const savedConfig = sessionStorage.getItem('currentSequenceExerciseConfig');
    if (savedConfig) {
      try {
        this.config = JSON.parse(savedConfig);
      } catch (error) {
        console.error('Error parsing sequence exercise config:', error);
      }
    }
  }

  private initializeSequence(): void {
    this.sequenceData.values = [...this.config.initialSequence];
    this.userSequence = [...this.config.initialSequence];
    this.userInput = this.config.initialSequence.join(', ');
    this.userPredictions = new Array(this.config.targetPredictions).fill(null);
    this.analyzeSequence();
  }

  private initializeCanvas(): void {
    if (!this.canvasRef) return;
    
    this.canvas = this.canvasRef.nativeElement;
    this.ctx = this.canvas.getContext('2d')!;
    
    // Configurar tamaño del canvas
    const container = this.canvas.parentElement!;
    this.canvas.width = container.clientWidth;
    this.canvas.height = 200;
  }

  private analyzeSequence(): void {
    if (this.sequenceData.values.length < 2) return;

    const values = this.sequenceData.values;
    
    // Verificar si es aritmética
    const differences: number[] = [];
    for (let i = 1; i < values.length; i++) {
      differences.push(values[i] - values[i - 1]);
    }

    const isArithmetic = differences.every(diff => diff === differences[0]);
    
    if (isArithmetic) {
      this.sequenceData.type = 'arithmetic';
      this.sequenceData.commonDifference = differences[0];
      this.sequenceData.formula = `an = ${values[0]} + (n-1) × ${differences[0]}`;
      this.calculateArithmeticPredictions();
      return;
    }

    // Verificar si es geométrica
    const ratios: number[] = [];
    for (let i = 1; i < values.length; i++) {
      if (values[i - 1] !== 0) {
        ratios.push(values[i] / values[i - 1]);
      }
    }

    const isGeometric = ratios.length > 0 && ratios.every(ratio => Math.abs(ratio - ratios[0]) < 0.0001);
    
    if (isGeometric) {
      this.sequenceData.type = 'geometric';
      this.sequenceData.commonRatio = ratios[0];
      this.sequenceData.formula = `an = ${values[0]} × ${ratios[0]}^(n-1)`;
      this.calculateGeometricPredictions();
      return;
    }

    // Verificar si es Fibonacci
    if (this.isFibonacci(values)) {
      this.sequenceData.type = 'fibonacci';
      this.sequenceData.formula = 'an = an-1 + an-2';
      this.calculateFibonacciPredictions();
      return;
    }

    // Si no se identifica el patrón
    this.sequenceData.type = 'unknown';
    this.sequenceData.formula = 'Patrón no identificado';
  }

  private isFibonacci(values: number[]): boolean {
    if (values.length < 3) return false;
    
    for (let i = 2; i < values.length; i++) {
      if (values[i] !== values[i - 1] + values[i - 2]) {
        return false;
      }
    }
    return true;
  }

  private calculateArithmeticPredictions(): void {
    const { values, commonDifference } = this.sequenceData;
    if (commonDifference === undefined) return;

    const predictions = [];
    const lastValue = values[values.length - 1];
    
    for (let i = 1; i <= this.config.targetPredictions; i++) {
      predictions.push(lastValue + commonDifference * i);
    }
    
    this.sequenceData.nextValues = predictions;
  }

  private calculateGeometricPredictions(): void {
    const { values, commonRatio } = this.sequenceData;
    if (commonRatio === undefined) return;

    const predictions = [];
    const lastValue = values[values.length - 1];
    
    for (let i = 1; i <= this.config.targetPredictions; i++) {
      predictions.push(Math.round(lastValue * Math.pow(commonRatio, i) * 100) / 100);
    }
    
    this.sequenceData.nextValues = predictions;
  }

  private calculateFibonacciPredictions(): void {
    const values = this.sequenceData.values;
    const predictions = [];
    
    let prev2 = values[values.length - 2];
    let prev1 = values[values.length - 1];
    
    for (let i = 0; i < this.config.targetPredictions; i++) {
      const next = prev1 + prev2;
      predictions.push(next);
      prev2 = prev1;
      prev1 = next;
    }
    
    this.sequenceData.nextValues = predictions;
  }

  private drawSequenceVisualization(): void {
    if (!this.canvas || !this.ctx) return;

    // Limpiar canvas
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    const values = this.sequenceData.values;
    if (values.length === 0) return;

    // Configurar estilos
    this.ctx.strokeStyle = '#4A90E2';
    this.ctx.fillStyle = '#4A90E2';
    this.ctx.lineWidth = 3;
    this.ctx.font = '14px Arial';

    // Calcular dimensiones
    const margin = 40;
    const plotWidth = this.canvas.width - 2 * margin;
    const plotHeight = this.canvas.height - 2 * margin;

    const minVal = Math.min(...values);
    const maxVal = Math.max(...values);
    const range = maxVal - minVal || 1;

    // Dibujar puntos y líneas
    this.ctx.beginPath();
    values.forEach((value, index) => {
      const x = margin + (index / (values.length - 1)) * plotWidth;
      const y = margin + plotHeight - ((value - minVal) / range) * plotHeight;

      if (index === 0) {
        this.ctx.moveTo(x, y);
      } else {
        this.ctx.lineTo(x, y);
      }

      // Dibujar punto
      this.ctx.fillStyle = '#4A90E2';
      this.ctx.beginPath();
      this.ctx.arc(x, y, 6, 0, 2 * Math.PI);
      this.ctx.fill();

      // Dibujar valor
      this.ctx.fillStyle = '#333';
      this.ctx.textAlign = 'center';
      this.ctx.fillText(value.toString(), x, y - 15);
    });

    // Dibujar línea de conexión
    this.ctx.strokeStyle = '#4A90E2';
    this.ctx.stroke();

    // Dibujar predicciones si están disponibles
    if (this.sequenceData.nextValues && this.showPredictions) {
      this.drawPredictions();
    }
  }

  private drawPredictions(): void {
    if (!this.sequenceData.nextValues) return;

    const allValues = [...this.sequenceData.values, ...this.sequenceData.nextValues];
    const margin = 40;
    const plotWidth = this.canvas.width - 2 * margin;
    const plotHeight = this.canvas.height - 2 * margin;

    const minVal = Math.min(...allValues);
    const maxVal = Math.max(...allValues);
    const range = maxVal - minVal || 1;

    // Dibujar predicciones
    this.ctx.strokeStyle = '#FF6B6B';
    this.ctx.setLineDash([5, 5]);
    
    this.sequenceData.nextValues.forEach((value, index) => {
      const totalIndex = this.sequenceData.values.length + index;
      const x = margin + (totalIndex / (allValues.length - 1)) * plotWidth;
      const y = margin + plotHeight - ((value - minVal) / range) * plotHeight;

      // Dibujar punto de predicción
      this.ctx.fillStyle = '#FF6B6B';
      this.ctx.beginPath();
      this.ctx.arc(x, y, 6, 0, 2 * Math.PI);
      this.ctx.fill();

      // Dibujar valor
      this.ctx.fillStyle = '#FF6B6B';
      this.ctx.textAlign = 'center';
      this.ctx.fillText(value.toString(), x, y - 15);
    });

    this.ctx.setLineDash([]);
  }

  onSequenceInputChange(): void {
    if (!this.config.allowInput) return;

    try {
      const inputValues = this.userInput.split(',').map(val => {
        const num = parseFloat(val.trim());
        if (isNaN(num)) throw new Error('Invalid number');
        return num;
      });

      this.userSequence = inputValues;
      this.sequenceData.values = inputValues;
      this.analyzeSequence();
      this.drawSequenceVisualization();
    } catch (error) {
      console.error('Error parsing input:', error);
    }
  }

  onPredictionInputChange(event: Event, index: number): void {
    const target = event.target as HTMLInputElement;
    const value = target.value;
    this.onPredictionInput(index, value);
  }

  onPredictionInput(index: number, value: string): void {
    const numValue = parseFloat(value);
    if (!isNaN(numValue)) {
      this.userPredictions[index] = numValue;
    }
  }

  startAnalysis(): void {
    this.isAnalyzing = true;
    
    // Simular análisis con delay
    setTimeout(() => {
      this.showAnalysis = true;
      this.isAnalyzing = false;
    }, 1500);
  }

  showPredictionSection(): void {
    this.showPredictions = true;
    this.drawSequenceVisualization();
  }

  checkAnswer(): void {
    if (!this.config.correctAnswers) {
      this.isCorrect = true;
      this.feedbackMessage = '¡Excelente análisis! Has completado el ejercicio correctamente.';
    } else {
      const correctCount = this.userPredictions.filter((pred, index) => 
        pred === this.config.correctAnswers![index]
      ).length;

      this.isCorrect = correctCount === this.config.correctAnswers.length;
      
      if (this.isCorrect) {
        this.feedbackMessage = '¡Perfecto! Has identificado correctamente el patrón y las predicciones.';
      } else {
        this.feedbackMessage = `Has acertado ${correctCount} de ${this.config.correctAnswers.length} predicciones. Revisa el patrón identificado.`;
      }
    }

    this.showFeedback = true;
    this.isCompleted = this.isCorrect;
  }

  showHint(): void {
    if (this.config.hints && this.currentHintIndex < this.config.hints.length) {
      this.showHints = true;
      this.currentHintIndex++;
    }
  }

  resetExercise(): void {
    this.initializeSequence();
    this.userInput = this.config.initialSequence.join(', ');
    this.userPredictions = new Array(this.config.targetPredictions).fill(null);
    this.showAnalysis = false;
    this.showPredictions = false;
    this.showFeedback = false;
    this.showHints = false;
    this.currentHintIndex = 0;
    this.isCompleted = false;
    this.drawSequenceVisualization();
  }

  continueToNext(): void {
    console.log('Continuar al siguiente ejercicio');
    this.router.navigate(['/exercise-demo']);
  }

  goBack(): void {
    this.router.navigate(['/exercise-demo']);
  }

  getPatternTypeName(type: string): string {
    switch (type) {
      case 'arithmetic':
        return 'Aritmética';
      case 'geometric':
        return 'Geométrica';
      case 'fibonacci':
        return 'Fibonacci';
      case 'custom':
        return 'Personalizada';
      case 'unknown':
        return 'Desconocido';
      default:
        return 'No identificado';
    }
  }
} 