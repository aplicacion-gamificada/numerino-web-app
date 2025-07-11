import { Component, OnInit, ViewChild, ElementRef, HostListener, AfterViewInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

// Interfaces genéricas para ejercicios de conteo con emojis
export interface EmojiItemData {
  emoji: string;
  name: string;
  adults: number;
  children: number;
  color: string;
}

export interface EmojiPosition {
  x: number;
  y: number;
  size: number;
  isAdult: boolean;
  isClicked: boolean;
  id: string;
}

export interface EmojiExerciseConfig {
  id: string;
  title: string;
  question: string;
  instructions: string;
  items: EmojiItemData[];
  maxTotal: number;
  correctAnswers?: number[];
  allowEdit: boolean;
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
  @ViewChild('questionContainer', { static: false }) questionContainer!: ElementRef;
  @ViewChild('exerciseContainer', { static: false }) exerciseContainer!: ElementRef;

  // Configuración del ejercicio
  config: EmojiExerciseConfig = {
    id: 'emoji-counting-1',
    title: 'Cuenta los Emojis',
    question: '¿Cuántos hay de cada tipo?',
    instructions: 'Observa los emojis y ajusta los valores arrastrando las celdas o usando los controles numéricos.',
    allowEdit: true,
    maxTotal: 25,
    items: [
      { emoji: '🐶', name: 'Perros', adults: 4, children: 2, color: '#FFB366' },
      { emoji: '😺', name: 'Gatos', adults: 3, children: 3, color: '#66B3FF' },
      { emoji: '🐰', name: 'Conejos', adults: 2, children: 3, color: '#66FF66' }
    ]
  };

  // Estado del ejercicio
  currentView: 'question' | 'exercise' = 'question';
  emojiPositions: EmojiPosition[] = [];
  tableValues: number[] = [];
  isCompleted = false;
  showFeedback = false;
  feedbackMessage = '';
  isCorrect = false;
  isTransitioning = false;

  // Estado del canvas y gráfico
  private canvas!: HTMLCanvasElement;
  private ctx!: CanvasRenderingContext2D;
  private canvasRect!: DOMRect;
  private readonly MARGIN = { top: 40, right: 40, bottom: 80, left: 60 };
  private chartWidth = 0;
  private chartHeight = 0;
  private barWidth = 0;

  // Estado del drag en celdas
  isDragging = false;
  dragCellIndex = -1;
  private dragStartY = 0;
  private dragCurrentValue = 0;
  
  // Estado del drag en barras del canvas
  isDraggingBar = false;
  dragBarIndex = -1;
  private barDragStartY = 0;
  private barDragCurrentValue = 0;
  private hoveredBarIndex = -1;
  
  // Para animaciones suaves
  private animationFrameId: number | null = null;
  private targetValues: number[] = [];
  private currentValues: number[] = [];
  private readonly LERP_FACTOR = 0.3;
  private readonly DEAD_ZONE = 8; // Aumentado para mayor precisión inicial
  private readonly UPDATE_THROTTLE = 32; // Reducido a 30fps para más control
  private readonly SENSITIVITY_FACTOR = 0.4; // Factor de sensibilidad reducido
  private lastUpdateTime = 0;

  // Configuración de tamaños
  private readonly ADULT_SIZE = 52;
  private readonly CHILD_SIZE = 28;
  private readonly MIN_DISTANCE = 60;
  private readonly MAX_ATTEMPTS = 3;

  // Touch handling
  private startY: number | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadExerciseConfig();
    this.initializeTableValues();
    this.generateEmojiPositions();
  }

  private loadExerciseConfig(): void {
    const savedConfig = sessionStorage.getItem('currentEmojiExerciseConfig');
    if (savedConfig) {
      try {
        this.config = JSON.parse(savedConfig);
      } catch (error) {
        console.error('Error parsing exercise config:', error);
      }
    }
  }

  // Ejemplos de configuraciones para demostrar modularidad
  loadAnimalsExercise(): void {
    this.config = {
      id: 'animals-counting',
      title: 'Cuenta los Animales',
      question: '¿Cuántos animales hay de cada tipo?',
      instructions: 'Observa los animales y ajusta los valores arrastrando las celdas.',
      allowEdit: true,
      maxTotal: 25,
      items: [
        { emoji: '🐶', name: 'Perros', adults: 4, children: 2, color: '#FFB366' },
        { emoji: '😺', name: 'Gatos', adults: 3, children: 3, color: '#66B3FF' },
        { emoji: '🐰', name: 'Conejos', adults: 2, children: 3, color: '#66FF66' }
      ]
    };
    this.resetExercise();
  }

  loadFruitsExercise(): void {
    this.config = {
      id: 'fruits-counting',
      title: 'Cuenta las Frutas',
      question: '¿Cuántas frutas hay de cada tipo?',
      instructions: 'Observa las frutas y ajusta los valores usando los controles.',
      allowEdit: true,
      maxTotal: 25,
      items: [
        { emoji: '🍎', name: 'Manzanas', adults: 5, children: 2, color: '#FF6B6B' },
        { emoji: '🍌', name: 'Bananas', adults: 3, children: 4, color: '#FFE66D' },
        { emoji: '🍇', name: 'Uvas', adults: 2, children: 3, color: '#9B59B6' }
      ]
    };
    this.resetExercise();
  }

  loadVehiclesExercise(): void {
    this.config = {
      id: 'vehicles-counting',
      title: 'Cuenta los Vehículos',
      question: '¿Cuántos vehículos hay de cada tipo?',
      instructions: 'Observa los vehículos y arrastra las celdas para ajustar los valores.',
      allowEdit: true,
      maxTotal: 25,
      items: [
        { emoji: '🚗', name: 'Autos', adults: 4, children: 1, color: '#4ECDC4' },
        { emoji: '🚲', name: 'Bicicletas', adults: 3, children: 3, color: '#45B7D1' },
        { emoji: '🛵', name: 'Motos', adults: 2, children: 2, color: '#96CEB4' }
      ]
    };
    this.resetExercise();
  }

  loadSportsExercise(): void {
    this.config = {
      id: 'sports-counting',
      title: 'Cuenta los Deportes',
      question: '¿Cuántos elementos deportivos hay?',
      instructions: 'Cuenta los elementos deportivos y ajusta los valores correctamente.',
      allowEdit: true,
      maxTotal: 25,
      items: [
        { emoji: '⚽', name: 'Pelotas', adults: 6, children: 0, color: '#E17055' },
        { emoji: '🏀', name: 'Basketballs', adults: 3, children: 2, color: '#FDCB6E' },
        { emoji: '🎾', name: 'Tenis', adults: 2, children: 4, color: '#A29BFE' }
      ]
    };
    this.resetExercise();
  }

  ngAfterViewInit(): void {
    if (this.currentView === 'exercise') {
      this.initializeCanvas();
    }
  }

  ngOnDestroy(): void {
    this.removeEventListeners();
    
    // Limpiar animaciones pendientes
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
  }

  private initializeTableValues(): void {
    this.tableValues = this.config.items.map(() => 0);
    this.targetValues = [...this.tableValues];
    this.currentValues = [...this.tableValues];
  }

  private generateEmojiPositions(): void {
    this.emojiPositions = [];
    let idCounter = 0;
    
    this.config.items.forEach((item, itemIndex) => {
      // Generar posiciones para adultos
      for (let i = 0; i < item.adults; i++) {
        const position = this.generateValidPosition(true);
        if (position) {
          this.emojiPositions.push({
            ...position,
            id: `${item.emoji}-adult-${idCounter++}`,
            isClicked: false
          });
        }
      }
      
      // Generar posiciones para crías
      for (let i = 0; i < item.children; i++) {
        const position = this.generateValidPosition(false);
        if (position) {
          this.emojiPositions.push({
            ...position,
            id: `${item.emoji}-child-${idCounter++}`,
            isClicked: false
          });
        }
      }
    });
  }

  private generateValidPosition(isAdult: boolean): EmojiPosition | null {
    const size = isAdult ? this.ADULT_SIZE : this.CHILD_SIZE;
    
    for (let attempt = 0; attempt < this.MAX_ATTEMPTS; attempt++) {
      const x = Math.random() * (100 - (size / 8));
      const y = Math.random() * (100 - (size / 8));
      
      const newPosition: EmojiPosition = {
        x, y, size, isAdult,
        isClicked: false,
        id: ''
      };
      
      if (this.isValidPosition(newPosition)) {
        return newPosition;
      }
    }
    
    // Fallback: grid positioning
    return this.getFallbackGridPosition(isAdult);
  }

  private isValidPosition(newPosition: EmojiPosition): boolean {
    return this.emojiPositions.every(existing => {
      const distance = Math.sqrt(
        Math.pow(newPosition.x - existing.x, 2) + 
        Math.pow(newPosition.y - existing.y, 2)
      );
      return distance >= (this.MIN_DISTANCE / 10); // Convert to percentage
    });
  }

  private getFallbackGridPosition(isAdult: boolean): EmojiPosition {
    const gridSize = 20;
    const size = isAdult ? this.ADULT_SIZE : this.CHILD_SIZE;
    const positions = this.emojiPositions.length;
    
    return {
      x: (positions % 5) * gridSize,
      y: Math.floor(positions / 5) * gridSize,
      size,
      isAdult,
      isClicked: false,
      id: ''
    };
  }

  // Métodos de navegación
  startExercise(): void {
    this.isTransitioning = true;
    
    setTimeout(() => {
      this.currentView = 'exercise';
      
      // Permitir que Angular procese el cambio de vista
      setTimeout(() => {
        this.isTransitioning = false;
        
        // Inicializar canvas después de que termine la transición
        setTimeout(() => {
          this.initializeCanvas();
        }, 500);
      }, 50);
    }, 100);
  }

  goBackToQuestion(): void {
    this.isTransitioning = true;
    
    setTimeout(() => {
      this.currentView = 'question';
      this.isTransitioning = false;
    }, 300);
  }

  // Métodos de interacción con emojis
  onEmojiClick(emojiId: string): void {
    const emoji = this.emojiPositions.find(e => e.id === emojiId);
    if (emoji) {
      emoji.isClicked = !emoji.isClicked;
    }
  }

  getEmojiStyle(emoji: EmojiPosition): any {
    const baseStyle = {
      position: 'absolute',
      left: emoji.x + '%',
      top: emoji.y + '%',
      fontSize: emoji.size + 'px',
      cursor: 'pointer',
      userSelect: 'none',
      transition: 'all 0.2s ease',
      zIndex: emoji.isClicked ? 10 : 1
    };

    if (emoji.isClicked) {
      return {
        ...baseStyle,
        transform: 'scale(1.1)',
        filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.3))'
      };
    }

    if (!emoji.isAdult) {
      return {
        ...baseStyle,
        opacity: 0.9
      };
    }

    return baseStyle;
  }

  getEmojiOutlineStyle(emoji: EmojiPosition, itemColor: string): any {
    if (!emoji.isClicked) return {};
    
    return {
      position: 'absolute',
      left: emoji.x + '%',
      top: emoji.y + '%',
      width: emoji.size + 'px',
      height: emoji.size + 'px',
      border: `2px solid ${itemColor}`,
      borderRadius: '50%',
      pointerEvents: 'none',
      zIndex: 9
    };
  }

  // Métodos de canvas y gráfico
  private initializeCanvas(): void {
    if (!this.canvasRef) return;
    
    this.canvas = this.canvasRef.nativeElement;
    this.ctx = this.canvas.getContext('2d')!;
    
    const container = this.canvas.parentElement!;
    this.canvas.width = container.clientWidth;
    this.canvas.height = 500;
    
    this.updateCanvasRect();
    this.calculateDimensions();
    this.drawChart();
    
    // Agregar listeners para el arrastre en las barras
    this.canvas.addEventListener('mousedown', this.onCanvasMouseDown.bind(this));
    this.canvas.addEventListener('mousemove', this.onCanvasMouseMove.bind(this));
    this.canvas.addEventListener('mouseup', this.onCanvasMouseUp.bind(this));
    this.canvas.addEventListener('mouseleave', this.onCanvasMouseUp.bind(this));
  }

  private updateCanvasRect(): void {
    this.canvasRect = this.canvas.getBoundingClientRect();
  }

  private calculateDimensions(): void {
    this.chartWidth = this.canvas.width - this.MARGIN.left - this.MARGIN.right;
    this.chartHeight = this.canvas.height - this.MARGIN.top - this.MARGIN.bottom;
    this.barWidth = this.chartWidth / this.config.items.length * 0.6;
  }

  private drawChart(): void {
    if (!this.ctx) return;
    
    // Limpiar canvas
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    
    // Configurar estilos base
    this.ctx.fillStyle = '#333';
    this.ctx.strokeStyle = '#ddd';
    this.ctx.lineWidth = 1;
    this.ctx.font = '14px "DM Sans", sans-serif';

    // Calcular escala automática
    const maxValue = Math.max(...this.tableValues, 1) + 2;
    
    // Dibujar grid
    this.drawGrid(maxValue);
    
    // Dibujar ejes
    this.drawAxes();
    
    // Dibujar barras
    this.drawBars(maxValue);
    
    // Dibujar etiquetas
    this.drawLabels(maxValue);
  }

  private drawGrid(maxValue: number): void {
    this.ctx.strokeStyle = '#e5e7eb';
    this.ctx.lineWidth = 0.5;
    
    // Líneas horizontales cada 1 unidad (exactas para cada valor)
    for (let i = 0; i <= maxValue; i++) {
      const y = this.MARGIN.top + this.chartHeight - (i / maxValue) * this.chartHeight;
      this.ctx.beginPath();
      this.ctx.moveTo(this.MARGIN.left, y);
      this.ctx.lineTo(this.MARGIN.left + this.chartWidth, y);
      this.ctx.stroke();
    }
    
    // Líneas verticales exactas basadas en las barras
    const barSpacing = this.chartWidth / this.config.items.length;
    
    // Líneas en los bordes izquierdo y derecho del área del gráfico
    this.ctx.beginPath();
    this.ctx.moveTo(this.MARGIN.left, this.MARGIN.top);
    this.ctx.lineTo(this.MARGIN.left, this.MARGIN.top + this.chartHeight);
    this.ctx.stroke();
    
    this.ctx.beginPath();
    this.ctx.moveTo(this.MARGIN.left + this.chartWidth, this.MARGIN.top);
    this.ctx.lineTo(this.MARGIN.left + this.chartWidth, this.MARGIN.top + this.chartHeight);
    this.ctx.stroke();
    
    // Líneas en los bordes de cada barra
    for (let i = 0; i < this.config.items.length; i++) {
      const x = this.MARGIN.left + i * barSpacing + (barSpacing - this.barWidth) / 2;
      const xEnd = x + this.barWidth;
      
      // Línea izquierda de la barra
      this.ctx.beginPath();
      this.ctx.moveTo(x, this.MARGIN.top);
      this.ctx.lineTo(x, this.MARGIN.top + this.chartHeight);
      this.ctx.stroke();
      
      // Línea derecha de la barra
      this.ctx.beginPath();
      this.ctx.moveTo(xEnd, this.MARGIN.top);
      this.ctx.lineTo(xEnd, this.MARGIN.top + this.chartHeight);
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

  private drawBars(maxValue: number): void {
    const barSpacing = this.chartWidth / this.config.items.length;
    const minBarHeight = 20; // Altura mínima para barras con valor 0
    
    this.currentValues.forEach((value, index) => {
      let barHeight = (value / maxValue) * this.chartHeight;
      const x = this.MARGIN.left + index * barSpacing + (barSpacing - this.barWidth) / 2;
      let y = this.MARGIN.top + this.chartHeight - barHeight;
      
      // Para valores 0, mostrar una barra mínima del color correspondiente
      if (value === 0) {
        barHeight = minBarHeight;
        y = this.MARGIN.top + this.chartHeight - barHeight;
      }
      
      // Efectos visuales mejorados
      const isHovered = this.hoveredBarIndex === index;
      const isDragging = this.isDraggingBar && this.dragBarIndex === index;
      
      // Aplicar efectos hover y drag
      if (isHovered || isDragging) {
        // Glow effect
        this.ctx.shadowColor = this.config.items[index].color;
        this.ctx.shadowBlur = isHovered ? 8 : 15;
        this.ctx.shadowOffsetX = 0;
        this.ctx.shadowOffsetY = 0;
      }
      
      // Dibujar barra principal
      this.ctx.fillStyle = this.config.items[index].color;
      if (isDragging) {
        this.ctx.globalAlpha = 0.9;
      }
      this.ctx.fillRect(x, y, this.barWidth, barHeight);
      
      // Resetear sombra y opacidad
      this.ctx.shadowBlur = 0;
      this.ctx.globalAlpha = 1;
      
      // Borde de la barra mejorado
      this.ctx.strokeStyle = isDragging ? '#000' : '#333';
      this.ctx.lineWidth = isDragging ? 2 : 1;
      this.ctx.strokeRect(x, y, this.barWidth, barHeight);
      
      // Border top brillante durante drag
      if (isDragging) {
        this.ctx.strokeStyle = this.config.items[index].color;
        this.ctx.lineWidth = 3;
        this.ctx.beginPath();
        this.ctx.moveTo(x, y);
        this.ctx.lineTo(x + this.barWidth, y);
        this.ctx.stroke();
      }
      
      // Puntos de agarre en la parte superior (3 círculos)
      const dotRadius = 2;
      const dotY = y - 12;
      const dotSpacing = this.barWidth / 4;
      
      for (let i = 0; i < 3; i++) {
        const dotX = x + dotSpacing + i * dotSpacing;
        
        // Sombra del punto
        this.ctx.shadowColor = 'rgba(0, 0, 0, 0.3)';
        this.ctx.shadowBlur = 2;
        this.ctx.shadowOffsetY = 1;
        
        // Punto de agarre
        this.ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
        this.ctx.beginPath();
        this.ctx.arc(dotX, dotY, dotRadius, 0, 2 * Math.PI);
        this.ctx.fill();
        
        // Resetear sombra
        this.ctx.shadowBlur = 0;
        this.ctx.shadowOffsetY = 0;
      }
      
      // Valor encima con fondo destacado durante drag
      const valueY = y - 20;
      const valueText = Math.round(this.tableValues[index]).toString();
      
      if (isDragging) {
        // Fondo semi-transparente más destacado para el valor
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
        this.ctx.fillRect(x + this.barWidth / 2 - 18, valueY - 20, 36, 24);
        this.ctx.fillStyle = '#fff';
        
        // Mostrar también indicador de "arrastrando"
        this.ctx.font = 'bold 18px "DM Sans", sans-serif';
      } else if (isHovered) {
        // Fondo sutil para hover
        this.ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
        this.ctx.fillRect(x + this.barWidth / 2 - 15, valueY - 18, 30, 20);
        this.ctx.fillStyle = '#333';
        this.ctx.font = 'bold 16px "DM Sans", sans-serif';
      } else {
        this.ctx.fillStyle = '#333';
        this.ctx.font = 'bold 16px "DM Sans", sans-serif';
      }
      
      this.ctx.textAlign = 'center';
      this.ctx.fillText(valueText, x + this.barWidth / 2, valueY);
    });
  }

  private drawLabels(maxValue: number): void {
    this.ctx.fillStyle = '#333';
    this.ctx.textAlign = 'center';
    this.ctx.font = '14px "DM Sans", sans-serif';
    
    // Etiquetas del eje X (emojis)
    const barSpacing = this.chartWidth / this.config.items.length;
    this.config.items.forEach((item, index) => {
      const x = this.MARGIN.left + index * barSpacing + barSpacing / 2;
      const y = this.MARGIN.top + this.chartHeight + 30;
      this.ctx.font = '24px Arial';
      this.ctx.fillText(item.emoji, x, y);
    });
    
    // Etiquetas del eje Y (valores) - tick marks cada 2 unidades
    this.ctx.textAlign = 'right';
    this.ctx.font = '12px "DM Sans", sans-serif';
    for (let i = 0; i <= maxValue; i += 2) {
      const y = this.MARGIN.top + this.chartHeight - (i / maxValue) * this.chartHeight + 4;
      this.ctx.fillText(i.toString(), this.MARGIN.left - 10, y);
    }
  }

  // Métodos de drag en celdas
  onCellMouseDown(event: MouseEvent, index: number): void {
    event.preventDefault();
    this.isDragging = true;
    this.dragCellIndex = index;
    this.dragStartY = event.clientY;
    this.dragCurrentValue = this.tableValues[index];
    
    document.addEventListener('mousemove', this.onDocumentMouseMove.bind(this));
    document.addEventListener('mouseup', this.onDocumentMouseUp.bind(this));
  }

  private onDocumentMouseMove(event: MouseEvent): void {
    if (!this.isDragging || this.dragCellIndex === -1) return;
    
    const deltaY = this.dragStartY - event.clientY; // Invertir para drag up = increase
    const valueChange = Math.floor(deltaY / 5); // 5px = 1 unidad
    const newValue = Math.max(0, Math.min(25, this.dragCurrentValue + valueChange));
    
    this.tableValues[this.dragCellIndex] = newValue;
    this.drawChart();
  }

  private onDocumentMouseUp(): void {
    this.isDragging = false;
    this.dragCellIndex = -1;
    
    document.removeEventListener('mousemove', this.onDocumentMouseMove.bind(this));
    document.removeEventListener('mouseup', this.onDocumentMouseUp.bind(this));
  }

  // Métodos de input numérico
  onNumberInputChange(event: Event, index: number): void {
    const target = event.target as HTMLInputElement;
    const newValue = Math.max(0, Math.min(25, Number(target.value)));
    this.tableValues[index] = newValue;
    this.targetValues[index] = newValue;
    this.startSmoothAnimation();
  }

  incrementValue(index: number): void {
    if (this.tableValues[index] < 25) {
      this.tableValues[index]++;
      this.targetValues[index] = this.tableValues[index];
      this.startSmoothAnimation();
    }
  }

  decrementValue(index: number): void {
    if (this.tableValues[index] > 0) {
      this.tableValues[index]--;
      this.targetValues[index] = this.tableValues[index];
      this.startSmoothAnimation();
    }
  }

  // Métodos de cálculo
  getTotalCorrect(itemIndex: number): number {
    const item = this.config.items[itemIndex];
    return item.adults + item.children;
  }

  getAllCorrectTotals(): number[] {
    return this.config.items.map(item => item.adults + item.children);
  }

  // Métodos de validación
  checkAnswer(): void {
    const correctAnswers = this.getAllCorrectTotals();
    const isCorrect = this.tableValues.every((value, index) => value === correctAnswers[index]);
    
    this.isCorrect = isCorrect;
    this.feedbackMessage = isCorrect 
      ? '¡Excelente! Has contado correctamente todos los emojis.' 
      : 'Revisa tu conteo. Algunos valores no son correctos.';
    
    this.showFeedback = true;
    this.isCompleted = isCorrect;
  }

  resetExercise(): void {
    // Limpiar animaciones pendientes
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
    
    this.initializeTableValues();
    this.showFeedback = false;
    this.isCompleted = false;
    this.currentView = 'question';
    this.hoveredBarIndex = -1;
    this.isDraggingBar = false;
    this.dragBarIndex = -1;
    this.generateEmojiPositions();
    this.drawChart();
  }

  continueToNext(): void {
    console.log('Continuar al siguiente ejercicio');
    this.router.navigate(['/exercise-demo']);
  }

  goBack(): void {
    this.router.navigate(['/exercise-demo']);
  }

  private removeEventListeners(): void {
    document.removeEventListener('mousemove', this.onDocumentMouseMove.bind(this));
    document.removeEventListener('mouseup', this.onDocumentMouseUp.bind(this));
    
    // Remover listeners del canvas
    if (this.canvas) {
      this.canvas.removeEventListener('mousedown', this.onCanvasMouseDown.bind(this));
      this.canvas.removeEventListener('mousemove', this.onCanvasMouseMove.bind(this));
      this.canvas.removeEventListener('mouseup', this.onCanvasMouseUp.bind(this));
      this.canvas.removeEventListener('mouseleave', this.onCanvasMouseUp.bind(this));
    }
  }

  // Métodos para arrastre en las barras del canvas
  private onCanvasMouseDown(event: MouseEvent): void {
    if (!this.canvas) return;
    
    const rect = this.canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    
    // Detectar si el clic está en una barra
    const barIndex = this.getBarIndexAtPosition(x, y);
    if (barIndex !== -1) {
      this.isDraggingBar = true;
      this.dragBarIndex = barIndex;
      this.barDragStartY = y;
      this.barDragCurrentValue = this.tableValues[barIndex];
      this.canvas.className = 'chart-canvas cursor-grabbing';
      
      // Haptic feedback si está disponible
      if (navigator.vibrate) {
        navigator.vibrate(10);
      }
    }
  }

  private onCanvasMouseMove(event: MouseEvent): void {
    if (!this.canvas) return;
    
    const rect = this.canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    
    if (this.isDraggingBar && this.dragBarIndex !== -1) {
      // Zona muerta para evitar cambios accidentales
      const deltaY = this.barDragStartY - y;
      if (Math.abs(deltaY) < this.DEAD_ZONE) return;
      
      // Throttling para mejor control
      const now = Date.now();
      if (now - this.lastUpdateTime < this.UPDATE_THROTTLE) return;
      this.lastUpdateTime = now;
      
      // Calcular nuevo valor con sensibilidad reducida
      const maxValue = Math.max(...this.tableValues, 1) + 2;
      const baseSensitivity = this.chartHeight / maxValue;
      const adjustedSensitivity = baseSensitivity * this.SENSITIVITY_FACTOR;
      
      // Movimiento más preciso sin aceleración agresiva
      const rawValueChange = deltaY / adjustedSensitivity;
      
      // Suavizar el cambio para mayor precisión
      let valueChange: number;
      if (Math.abs(rawValueChange) < 0.5) {
        valueChange = 0; // Muy pequeño, ignorar
      } else if (Math.abs(rawValueChange) < 2) {
        valueChange = Math.sign(rawValueChange); // ±1 para movimientos pequeños
      } else {
        valueChange = Math.round(rawValueChange * 0.7); // Reducir velocidad para movimientos grandes
      }
      
      let newValue = Math.max(0, Math.min(25, this.barDragCurrentValue + valueChange));
      
      // Solo aplicar magnetismo sutil para valores muy cercanos a enteros
      const snapThreshold = 0.15; // Más estricto
      const fractionalPart = newValue % 1;
      if (fractionalPart < snapThreshold) {
        newValue = Math.floor(newValue);
      } else if (fractionalPart > (1 - snapThreshold)) {
        newValue = Math.ceil(newValue);
      }
      
      // Resistencia suave cerca de límites
      if (newValue <= 0.5) {
        newValue = 0;
      } else if (newValue >= 24.5) {
        newValue = 25;
      }
      
      // Solo actualizar si hay cambio real
      if (newValue !== this.tableValues[this.dragBarIndex]) {
        this.targetValues[this.dragBarIndex] = newValue;
        this.tableValues[this.dragBarIndex] = newValue;
        this.startSmoothAnimation();
      }
    } else {
      // Actualizar estado hover
      const barIndex = this.getBarIndexAtPosition(x, y);
      if (barIndex !== this.hoveredBarIndex) {
        this.hoveredBarIndex = barIndex;
        this.updateCanvasCursor(barIndex);
        this.drawChart();
      }
    }
  }

  private onCanvasMouseUp(): void {
    if (this.isDraggingBar) {
      this.isDraggingBar = false;
      this.dragBarIndex = -1;
      
      // Pulso visual breve al soltar
      if (this.canvas) {
        this.canvas.style.transform = 'scale(1.01)';
        setTimeout(() => {
          if (this.canvas) {
            this.canvas.style.transform = 'scale(1)';
          }
        }, 150);
      }
      
      // Haptic feedback al soltar
      if (navigator.vibrate) {
        navigator.vibrate(5);
      }
      
      this.updateCanvasCursor(this.hoveredBarIndex);
      
      // Debounce para el valor final
      setTimeout(() => {
        this.drawChart();
      }, 100);
    }
  }

  private updateCanvasCursor(barIndex: number): void {
    if (!this.canvas) return;
    
    if (this.isDraggingBar) {
      this.canvas.className = 'chart-canvas cursor-grabbing';
    } else if (barIndex !== -1) {
      this.canvas.className = 'chart-canvas cursor-grab';
    } else {
      this.canvas.className = 'chart-canvas';
    }
  }

  private startSmoothAnimation(): void {
    // Temporalmente deshabilitado para debugging
    // if (this.animationFrameId) return;
    
    // Solo sincronizar los valores sin animación
    for (let i = 0; i < this.currentValues.length; i++) {
      this.currentValues[i] = this.targetValues[i];
    }
    this.drawChart();
    
    // const animate = () => {
    //   let needsUpdate = false;
    //   
    //   // Interpolación suave usando lerp
    //   for (let i = 0; i < this.currentValues.length; i++) {
    //     const diff = this.targetValues[i] - this.currentValues[i];
    //     if (Math.abs(diff) > 0.01) {
    //       this.currentValues[i] += diff * this.LERP_FACTOR;
    //       needsUpdate = true;
    //     } else {
    //       this.currentValues[i] = this.targetValues[i];
    //     }
    //   }
    //   
    //   if (needsUpdate) {
    //     this.drawChart();
    //     this.animationFrameId = requestAnimationFrame(animate);
    //   } else {
    //     this.animationFrameId = null;
    //   }
    // };
    // 
    // this.animationFrameId = requestAnimationFrame(animate);
  }

  private getBarIndexAtPosition(x: number, y: number): number {
    const barSpacing = this.chartWidth / this.config.items.length;
    const maxValue = Math.max(...this.tableValues, 1) + 2;
    const minBarHeight = 20;
    
    for (let i = 0; i < this.config.items.length; i++) {
      const value = this.currentValues[i];
      let barHeight = (value / maxValue) * this.chartHeight;
      const barX = this.MARGIN.left + i * barSpacing + (barSpacing - this.barWidth) / 2;
      let barY = this.MARGIN.top + this.chartHeight - barHeight;
      
      // Ajustar para barras con valor 0
      if (value === 0) {
        barHeight = minBarHeight;
        barY = this.MARGIN.top + this.chartHeight - barHeight;
      }
      
      // Área expandida para mejor detección (incluye puntos de agarre)
      const detectionPadding = 10;
      const topY = barY - 25; // Incluir área de puntos de agarre
      const bottomY = this.MARGIN.top + this.chartHeight;
      const leftX = barX - detectionPadding;
      const rightX = barX + this.barWidth + detectionPadding;
      
      // Verificar si el clic está en el área expandida de la barra
      if (x >= leftX && x <= rightX && y >= topY && y <= bottomY) {
        return i;
      }
    }
    
    return -1;
  }

  // Listeners para scroll/touch navigation - TEMPORALMENTE DESACTIVADOS
  // @HostListener('wheel', ['$event'])
  // onWheel(event: WheelEvent): void {
  //   if (this.currentView === 'exercise' && event.deltaY < 0) {
  //     event.preventDefault();
  //     this.goBackToQuestion();
  //   }
  // }

  // @HostListener('touchstart', ['$event'])
  // onTouchStart(event: TouchEvent): void {
  //   if (this.currentView === 'exercise') {
  //     this.startY = event.touches[0].clientY;
  //   }
  // }

  // @HostListener('touchmove', ['$event'])
  // onTouchMove(event: TouchEvent): void {
  //   if (this.currentView === 'exercise' && this.startY !== null) {
  //     const currentY = event.touches[0].clientY;
  //     const deltaY = currentY - this.startY;
  //     
  //     if (deltaY > 50) {
  //       this.goBackToQuestion();
  //       this.startY = null;
  //     }
  //   }
  // }

  // @HostListener('touchend', ['$event'])
  // onTouchEnd(event: TouchEvent): void {
  //   this.startY = null;
  // }
} 