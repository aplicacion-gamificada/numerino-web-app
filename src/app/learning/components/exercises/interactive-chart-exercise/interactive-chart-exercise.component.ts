import { Component, OnInit, ViewChild, ElementRef, AfterViewInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

export interface ChartData {
  categories: string[];
  values: number[];
  colors: string[];
  maxValue: number;
  gridSize: number;
}

export interface ChartExerciseConfig {
  id: string;
  title: string;
  instructions: string;
  chartData: ChartData;
  correctAnswers?: number[];
  allowTableEdit: boolean;
  showAdultsFilter?: boolean;
}

@Component({
  selector: 'app-interactive-chart-exercise',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './interactive-chart-exercise.component.html',
  styleUrl: './interactive-chart-exercise.component.scss'
})
export class InteractiveChartExerciseComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('chartCanvas', { static: false }) canvasRef!: ElementRef<HTMLCanvasElement>;
  
  // Configuración del ejercicio
  config: ChartExerciseConfig = {
    id: 'chart-exercise-1',
    title: 'Construye el Gráfico de Barras',
    instructions: 'Arrastra las barras para ajustar los valores según los datos de la tabla. Puedes también editar los valores directamente en la tabla.',
    allowTableEdit: true,
    showAdultsFilter: false,
    chartData: {
      categories: ['Perro', 'Gato', 'Conejo', 'Pájaro'],
      values: [8, 6, 4, 10],
      colors: ['#FFB366', '#66B3FF', '#66FF66', '#FF6666'],
      maxValue: 14,
      gridSize: 30
    }
  };

  // Estado del canvas
  private canvas!: HTMLCanvasElement;
  private ctx!: CanvasRenderingContext2D;
  private isDragging = false;
  private dragBarIndex = -1;
  private canvasRect!: DOMRect;

  // Dimensiones del gráfico
  private readonly MARGIN = { top: 40, right: 40, bottom: 80, left: 60 };
  private chartWidth = 0;
  private chartHeight = 0;
  private barWidth = 0;

  // Estado del ejercicio
  isCompleted = false;
  showFeedback = false;
  feedbackMessage = '';
  isCorrect = false;
  
  // Filtro de adultos (para ejercicios avanzados)
  showAdultsOnly = false;
  originalValues: number[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadExerciseConfig();
    this.originalValues = [...this.config.chartData.values];
  }

  private loadExerciseConfig(): void {
    // Intentar cargar configuración desde sessionStorage
    const savedConfig = sessionStorage.getItem('currentExerciseConfig');
    if (savedConfig) {
      try {
        this.config = JSON.parse(savedConfig);
      } catch (error) {
        console.error('Error parsing exercise config:', error);
      }
    }
  }

  ngAfterViewInit(): void {
    this.initializeCanvas();
    this.drawChart();
    this.setupEventListeners();
  }

  ngOnDestroy(): void {
    this.removeEventListeners();
  }

  private initializeCanvas(): void {
    this.canvas = this.canvasRef.nativeElement;
    this.ctx = this.canvas.getContext('2d')!;
    
    // Configurar el tamaño del canvas
    const container = this.canvas.parentElement!;
    this.canvas.width = container.clientWidth;
    this.canvas.height = 400;
    
    this.updateCanvasRect();
    this.calculateDimensions();
  }

  private updateCanvasRect(): void {
    this.canvasRect = this.canvas.getBoundingClientRect();
  }

  private calculateDimensions(): void {
    this.chartWidth = this.canvas.width - this.MARGIN.left - this.MARGIN.right;
    this.chartHeight = this.canvas.height - this.MARGIN.top - this.MARGIN.bottom;
    this.barWidth = this.chartWidth / this.config.chartData.categories.length * 0.6;
  }

  private drawChart(): void {
    // Limpiar canvas
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    
    // Configurar estilos
    this.ctx.fillStyle = '#333';
    this.ctx.strokeStyle = '#ddd';
    this.ctx.lineWidth = 1;
    this.ctx.font = '12px Arial';

    // Dibujar grid
    this.drawGrid();
    
    // Dibujar ejes
    this.drawAxes();
    
    // Dibujar barras
    this.drawBars();
    
    // Dibujar etiquetas
    this.drawLabels();
  }

  private drawGrid(): void {
    const { maxValue, gridSize } = this.config.chartData;
    
    this.ctx.strokeStyle = '#f0f0f0';
    this.ctx.lineWidth = 1;
    
    // Líneas horizontales
    for (let i = 0; i <= maxValue; i += 2) {
      const y = this.MARGIN.top + this.chartHeight - (i / maxValue) * this.chartHeight;
      this.ctx.beginPath();
      this.ctx.moveTo(this.MARGIN.left, y);
      this.ctx.lineTo(this.MARGIN.left + this.chartWidth, y);
      this.ctx.stroke();
    }
    
    // Líneas verticales
    const barSpacing = this.chartWidth / this.config.chartData.categories.length;
    for (let i = 0; i <= this.config.chartData.categories.length; i++) {
      const x = this.MARGIN.left + i * barSpacing;
      this.ctx.beginPath();
      this.ctx.moveTo(x, this.MARGIN.top);
      this.ctx.lineTo(x, this.MARGIN.top + this.chartHeight);
      this.ctx.stroke();
    }
  }

  private drawAxes(): void {
    this.ctx.strokeStyle = '#333';
    this.ctx.lineWidth = 2;
    
    // Eje Y
    this.ctx.beginPath();
    this.ctx.moveTo(this.MARGIN.left, this.MARGIN.top);
    this.ctx.lineTo(this.MARGIN.left, this.MARGIN.top + this.chartHeight);
    this.ctx.stroke();
    
    // Eje X
    this.ctx.beginPath();
    this.ctx.moveTo(this.MARGIN.left, this.MARGIN.top + this.chartHeight);
    this.ctx.lineTo(this.MARGIN.left + this.chartWidth, this.MARGIN.top + this.chartHeight);
    this.ctx.stroke();
  }

  private drawBars(): void {
    const { categories, values, colors, maxValue } = this.config.chartData;
    const barSpacing = this.chartWidth / categories.length;
    
    values.forEach((value, index) => {
      const barHeight = (value / maxValue) * this.chartHeight;
      const x = this.MARGIN.left + index * barSpacing + (barSpacing - this.barWidth) / 2;
      const y = this.MARGIN.top + this.chartHeight - barHeight;
      
      // Dibujar barra
      this.ctx.fillStyle = colors[index];
      this.ctx.fillRect(x, y, this.barWidth, barHeight);
      
      // Borde de la barra
      this.ctx.strokeStyle = '#333';
      this.ctx.lineWidth = 1;
      this.ctx.strokeRect(x, y, this.barWidth, barHeight);
      
      // Valor encima de la barra
      this.ctx.fillStyle = '#333';
      this.ctx.textAlign = 'center';
      this.ctx.fillText(value.toString(), x + this.barWidth / 2, y - 5);
    });
  }

  private drawLabels(): void {
    const { categories, maxValue } = this.config.chartData;
    
    this.ctx.fillStyle = '#333';
    this.ctx.textAlign = 'center';
    
    // Etiquetas del eje X (categorías)
    const barSpacing = this.chartWidth / categories.length;
    categories.forEach((category, index) => {
      const x = this.MARGIN.left + index * barSpacing + barSpacing / 2;
      const y = this.MARGIN.top + this.chartHeight + 20;
      this.ctx.fillText(category, x, y);
    });
    
    // Etiquetas del eje Y (valores)
    this.ctx.textAlign = 'right';
    for (let i = 0; i <= maxValue; i += 2) {
      const y = this.MARGIN.top + this.chartHeight - (i / maxValue) * this.chartHeight + 4;
      this.ctx.fillText(i.toString(), this.MARGIN.left - 10, y);
    }
  }

  private setupEventListeners(): void {
    this.canvas.addEventListener('mousedown', this.onMouseDown.bind(this));
    this.canvas.addEventListener('mousemove', this.onMouseMove.bind(this));
    this.canvas.addEventListener('mouseup', this.onMouseUp.bind(this));
    this.canvas.addEventListener('mouseleave', this.onMouseUp.bind(this));
    
    // Touch events para dispositivos móviles
    this.canvas.addEventListener('touchstart', this.onTouchStart.bind(this));
    this.canvas.addEventListener('touchmove', this.onTouchMove.bind(this));
    this.canvas.addEventListener('touchend', this.onTouchEnd.bind(this));
    
    window.addEventListener('resize', this.onResize.bind(this));
  }

  private removeEventListeners(): void {
    this.canvas.removeEventListener('mousedown', this.onMouseDown.bind(this));
    this.canvas.removeEventListener('mousemove', this.onMouseMove.bind(this));
    this.canvas.removeEventListener('mouseup', this.onMouseUp.bind(this));
    this.canvas.removeEventListener('mouseleave', this.onMouseUp.bind(this));
    this.canvas.removeEventListener('touchstart', this.onTouchStart.bind(this));
    this.canvas.removeEventListener('touchmove', this.onTouchMove.bind(this));
    this.canvas.removeEventListener('touchend', this.onTouchEnd.bind(this));
    window.removeEventListener('resize', this.onResize.bind(this));
  }

  private onMouseDown(event: MouseEvent): void {
    const rect = this.canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    
    const barIndex = this.getBarIndexAtPosition(x, y);
    if (barIndex !== -1) {
      this.isDragging = true;
      this.dragBarIndex = barIndex;
      this.canvas.style.cursor = 'grabbing';
    }
  }

  private onMouseMove(event: MouseEvent): void {
    const rect = this.canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    
    if (this.isDragging && this.dragBarIndex !== -1) {
      this.updateBarValue(y);
    } else {
      // Cambiar cursor si está sobre una barra
      const barIndex = this.getBarIndexAtPosition(x, y);
      this.canvas.style.cursor = barIndex !== -1 ? 'grab' : 'default';
    }
  }

  private onMouseUp(): void {
    this.isDragging = false;
    this.dragBarIndex = -1;
    this.canvas.style.cursor = 'default';
  }

  private onTouchStart(event: TouchEvent): void {
    event.preventDefault();
    const touch = event.touches[0];
    const rect = this.canvas.getBoundingClientRect();
    const x = touch.clientX - rect.left;
    const y = touch.clientY - rect.top;
    
    const barIndex = this.getBarIndexAtPosition(x, y);
    if (barIndex !== -1) {
      this.isDragging = true;
      this.dragBarIndex = barIndex;
    }
  }

  private onTouchMove(event: TouchEvent): void {
    event.preventDefault();
    if (this.isDragging && this.dragBarIndex !== -1) {
      const touch = event.touches[0];
      const rect = this.canvas.getBoundingClientRect();
      const y = touch.clientY - rect.top;
      this.updateBarValue(y);
    }
  }

  private onTouchEnd(event: TouchEvent): void {
    event.preventDefault();
    this.isDragging = false;
    this.dragBarIndex = -1;
  }

  private onResize(): void {
    this.updateCanvasRect();
    this.calculateDimensions();
    this.drawChart();
  }

  private getBarIndexAtPosition(x: number, y: number): number {
    const { values, maxValue } = this.config.chartData;
    const barSpacing = this.chartWidth / values.length;
    
    for (let i = 0; i < values.length; i++) {
      const barX = this.MARGIN.left + i * barSpacing + (barSpacing - this.barWidth) / 2;
      const barHeight = (values[i] / maxValue) * this.chartHeight;
      const barY = this.MARGIN.top + this.chartHeight - barHeight;
      
      if (x >= barX && x <= barX + this.barWidth && y >= barY && y <= barY + barHeight) {
        return i;
      }
    }
    return -1;
  }

  private updateBarValue(mouseY: number): void {
    const { maxValue } = this.config.chartData;
    const relativeY = mouseY - this.MARGIN.top;
    const value = Math.max(0, Math.min(maxValue, maxValue - (relativeY / this.chartHeight) * maxValue));
    const snappedValue = Math.round(value);
    
    this.config.chartData.values[this.dragBarIndex] = snappedValue;
    this.drawChart();
  }

  onInputChange(event: Event, index: number): void {
    const target = event.target as HTMLInputElement;
    const newValue = Number(target.value);
    this.onTableValueChange(index, newValue);
  }

  onTableValueChange(index: number, newValue: number): void {
    if (newValue >= 0 && newValue <= this.config.chartData.maxValue) {
      this.config.chartData.values[index] = newValue;
      this.drawChart();
    }
  }

  onAdultsFilterChange(): void {
    if (this.showAdultsOnly) {
      // Aplicar filtro de adultos (ejemplo: reducir valores a la mitad)
      this.config.chartData.values = this.originalValues.map(val => Math.floor(val * 0.6));
    } else {
      // Restaurar valores originales
      this.config.chartData.values = [...this.originalValues];
    }
    this.drawChart();
  }

  checkAnswer(): void {
    if (this.config.correctAnswers) {
      const isCorrect = this.config.chartData.values.every((val, index) => 
        val === this.config.correctAnswers![index]
      );
      
      this.isCorrect = isCorrect;
      this.feedbackMessage = isCorrect 
        ? '¡Excelente! Has construido el gráfico correctamente.' 
        : 'Revisa los valores. Algunos no coinciden con los datos esperados.';
    } else {
      this.isCorrect = true;
      this.feedbackMessage = '¡Buen trabajo! Has completado el gráfico.';
    }
    
    this.showFeedback = true;
    this.isCompleted = this.isCorrect;
  }

  resetExercise(): void {
    this.config.chartData.values = [...this.originalValues];
    this.showFeedback = false;
    this.isCompleted = false;
    this.showAdultsOnly = false;
    this.drawChart();
  }

  continueToNext(): void {
    // Lógica para continuar al siguiente ejercicio
    console.log('Continuar al siguiente ejercicio');
    // Por ahora, volver al demo
    this.router.navigate(['/exercise-demo']);
  }

  goBack(): void {
    this.router.navigate(['/exercise-demo']);
  }
} 