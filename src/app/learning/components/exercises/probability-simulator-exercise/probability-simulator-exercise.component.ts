import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

export interface Sphere {
  id: number;
  color: string;
  colorName: string;
  position: { x: number; y: number };
  isSelected?: boolean;
}

export interface ProbabilityCalculation {
  totalSpheres: number;
  colorCounts: { [color: string]: number };
  probabilities: { [color: string]: number };
  selectedColor?: string;
  selectedProbability?: number;
}

export interface SimulationResult {
  extractedColor: string;
  wasCorrect: boolean;
  attempt: number;
}

export interface ProbabilityExerciseConfig {
  id: string;
  title: string;
  instructions: string;
  sphereColors: string[];
  colorNames: string[];
  questionType: 'probability' | 'extraction' | 'comparison';
  targetColor?: string;
  targetProbability?: number;
  simulationRounds?: number;
  allowColorChange: boolean;
}

@Component({
  selector: 'app-probability-simulator-exercise',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './probability-simulator-exercise.component.html',
  styleUrl: './probability-simulator-exercise.component.scss'
})
export class ProbabilitySimulatorExerciseComponent implements OnInit, OnDestroy {
  
  // Configuración del ejercicio
  config: ProbabilityExerciseConfig = {
    id: 'probability-basic',
    title: 'Simulador de Probabilidades',
    instructions: 'Configura los colores de las esferas y calcula la probabilidad de extraer un color específico. Haz clic en las esferas para cambiar sus colores.',
    sphereColors: ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD'],
    colorNames: ['Rojo', 'Verde', 'Azul', 'Verde Claro', 'Amarillo', 'Morado'],
    questionType: 'probability',
    allowColorChange: true,
    simulationRounds: 10
  };

  // Estado de las esferas (disposición piramidal 3-2-1)
  spheres: Sphere[] = [];
  
  // Colores disponibles
  availableColors = [
    { color: '#FF6B6B', name: 'Rojo' },
    { color: '#4ECDC4', name: 'Verde' },
    { color: '#45B7D1', name: 'Azul' },
    { color: '#96CEB4', name: 'Verde Claro' },
    { color: '#FFEAA7', name: 'Amarillo' },
    { color: '#DDA0DD', name: 'Morado' },
    { color: '#FFB366', name: 'Naranja' },
    { color: '#A8E6CF', name: 'Menta' }
  ];

  // Cálculos de probabilidad
  probabilityData: ProbabilityCalculation = {
    totalSpheres: 6,
    colorCounts: {},
    probabilities: {}
  };

  // Hacer Object disponible en el template
  Object = Object;

  // Estado del ejercicio
  selectedColorForQuestion: string = '';
  userProbabilityAnswer: number | null = null;
  isSimulating: boolean = false;
  simulationResults: SimulationResult[] = [];
  currentSimulationRound: number = 0;
  showResults: boolean = false;
  isCompleted: boolean = false;
  showFeedback: boolean = false;
  feedbackMessage: string = '';
  isCorrect: boolean = false;

  // Animaciones
  extractedSphere: Sphere | null = null;
  isExtracting: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadExerciseConfig();
    this.initializeSpheres();
    this.calculateProbabilities();
  }

  ngOnDestroy(): void {
    // Cleanup si es necesario
  }

  private loadExerciseConfig(): void {
    const savedConfig = sessionStorage.getItem('currentProbabilityExerciseConfig');
    if (savedConfig) {
      try {
        this.config = JSON.parse(savedConfig);
      } catch (error) {
        console.error('Error parsing probability exercise config:', error);
      }
    }
  }

  private initializeSpheres(): void {
    // Disposición piramidal: 3 en la base, 2 en el medio, 1 en la cima
    const positions = [
      // Fila inferior (3 esferas)
      { x: 20, y: 70 },
      { x: 50, y: 70 },
      { x: 80, y: 70 },
      // Fila media (2 esferas)
      { x: 35, y: 40 },
      { x: 65, y: 40 },
      // Fila superior (1 esfera)
      { x: 50, y: 10 }
    ];

    this.spheres = positions.map((pos, index) => ({
      id: index,
      color: this.config.sphereColors[index] || this.availableColors[index % this.availableColors.length].color,
      colorName: this.config.colorNames[index] || this.availableColors[index % this.availableColors.length].name,
      position: pos
    }));
  }

  private calculateProbabilities(): void {
    // Contar colores
    const colorCounts: { [color: string]: number } = {};
    const probabilities: { [color: string]: number } = {};

    this.spheres.forEach(sphere => {
      const colorName = this.getColorName(sphere.color);
      colorCounts[colorName] = (colorCounts[colorName] || 0) + 1;
    });

    // Calcular probabilidades
    Object.keys(colorCounts).forEach(colorName => {
      probabilities[colorName] = colorCounts[colorName] / this.spheres.length;
    });

    this.probabilityData = {
      totalSpheres: this.spheres.length,
      colorCounts,
      probabilities
    };
  }

  getColorName(color: string): string {
    const colorData = this.availableColors.find(c => c.color === color);
    return colorData ? colorData.name : 'Desconocido';
  }

  getColorByName(colorName: string): string {
    const colorData = this.availableColors.find(c => c.name === colorName);
    return colorData ? colorData.color : '#CCCCCC';
  }

  getSuccessfulExtractions(): SimulationResult[] {
    return this.simulationResults.filter(r => r.wasCorrect);
  }

  onInputChange(event: Event): void {
    const target = event.target as HTMLInputElement;
    if (target) {
      this.onProbabilityAnswerChange(target.value);
    }
  }

  onSphereClick(sphere: Sphere): void {
    if (!this.config.allowColorChange || this.isSimulating) return;

    // Cambiar al siguiente color disponible
    const currentIndex = this.availableColors.findIndex(c => c.color === sphere.color);
    const nextIndex = (currentIndex + 1) % this.availableColors.length;
    const nextColor = this.availableColors[nextIndex];

    sphere.color = nextColor.color;
    sphere.colorName = nextColor.name;

    this.calculateProbabilities();
  }

  onColorSelection(colorName: string): void {
    this.selectedColorForQuestion = colorName;
    this.probabilityData.selectedColor = colorName;
    this.probabilityData.selectedProbability = this.probabilityData.probabilities[colorName] || 0;
  }

  onProbabilityAnswerChange(value: string): void {
    const numValue = parseFloat(value);
    this.userProbabilityAnswer = isNaN(numValue) ? null : numValue;
  }

  async startSimulation(): Promise<void> {
    if (!this.selectedColorForQuestion) {
      alert('Por favor, selecciona un color primero.');
      return;
    }

    this.isSimulating = true;
    this.simulationResults = [];
    this.currentSimulationRound = 0;
    this.showResults = false;

    const rounds = this.config.simulationRounds || 10;

    for (let i = 0; i < rounds; i++) {
      this.currentSimulationRound = i + 1;
      await this.simulateExtraction();
      await this.delay(800); // Pausa entre extracciones
    }

    this.isSimulating = false;
    this.showResults = true;
  }

  private async simulateExtraction(): Promise<void> {
    this.isExtracting = true;
    
    // Seleccionar esfera aleatoria
    const randomIndex = Math.floor(Math.random() * this.spheres.length);
    const selectedSphere = this.spheres[randomIndex];
    this.extractedSphere = selectedSphere;

    // Esperar animación
    await this.delay(600);

    // Determinar resultado
    const extractedColorName = this.getColorName(selectedSphere.color);
    const wasCorrect = extractedColorName === this.selectedColorForQuestion;

    this.simulationResults.push({
      extractedColor: extractedColorName,
      wasCorrect,
      attempt: this.currentSimulationRound
    });

    this.isExtracting = false;
    this.extractedSphere = null;
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  checkAnswer(): void {
    if (this.config.questionType === 'probability') {
      if (this.userProbabilityAnswer === null || !this.selectedColorForQuestion) {
        this.feedbackMessage = 'Por favor, selecciona un color y proporciona tu respuesta de probabilidad.';
        this.isCorrect = false;
      } else {
        const correctProbability = this.probabilityData.probabilities[this.selectedColorForQuestion];
        const tolerance = 0.01; // Tolerancia para errores de redondeo
        
        this.isCorrect = Math.abs(this.userProbabilityAnswer - correctProbability) <= tolerance;
        
        if (this.isCorrect) {
          this.feedbackMessage = `¡Correcto! La probabilidad de extraer ${this.selectedColorForQuestion} es ${(correctProbability * 100).toFixed(1)}%.`;
        } else {
          this.feedbackMessage = `La respuesta correcta es ${(correctProbability * 100).toFixed(1)}%. Tu respuesta fue ${(this.userProbabilityAnswer * 100).toFixed(1)}%.`;
        }
      }
    } else {
      // Para otros tipos de preguntas
      this.isCorrect = true;
      this.feedbackMessage = '¡Excelente! Has completado la simulación correctamente.';
    }

    this.showFeedback = true;
    this.isCompleted = this.isCorrect;
  }

  resetExercise(): void {
    this.initializeSpheres();
    this.calculateProbabilities();
    this.selectedColorForQuestion = '';
    this.userProbabilityAnswer = null;
    this.simulationResults = [];
    this.currentSimulationRound = 0;
    this.showResults = false;
    this.showFeedback = false;
    this.isCompleted = false;
    this.isSimulating = false;
    this.extractedSphere = null;
    this.isExtracting = false;
  }

  getSuccessRate(): number {
    if (this.simulationResults.length === 0) return 0;
    const successes = this.simulationResults.filter(r => r.wasCorrect).length;
    return (successes / this.simulationResults.length) * 100;
  }

  getTheoreticalProbability(): number {
    if (!this.selectedColorForQuestion) return 0;
    return (this.probabilityData.probabilities[this.selectedColorForQuestion] || 0) * 100;
  }

  continueToNext(): void {
    console.log('Continuar al siguiente ejercicio');
    this.router.navigate(['/exercise-demo']);
  }

  goBack(): void {
    this.router.navigate(['/exercise-demo']);
  }
} 