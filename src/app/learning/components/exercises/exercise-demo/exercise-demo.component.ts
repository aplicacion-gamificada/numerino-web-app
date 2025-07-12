import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { EmojiExerciseConfig } from '../interactive-chart-exercise/interactive-chart-exercise.component';
import { SequenceExerciseConfig } from '../sequence-analysis-exercise/sequence-analysis-exercise.component';
import { ProbabilityExerciseConfig } from '../probability-simulator-exercise/probability-simulator-exercise.component';

@Component({
  selector: 'app-exercise-demo',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './exercise-demo.component.html',
  styleUrl: './exercise-demo.component.scss'
})
export class ExerciseDemoComponent {
  
  // Configuraciones de ejercicios de conteo con emojis
  emojiExerciseConfigs: EmojiExerciseConfig[] = [
    {
      id: 'animals-demo',
      title: 'Cuenta los Animales',
      question: '¿Cuántos animales hay de cada tipo?',
      instructions: 'Observa los animales dispersos y cuenta cuántos hay de cada tipo. Arrastra las celdas o usa los controles numéricos.',
      allowEdit: true,
      maxTotal: 25,
      items: [
        { emoji: '🐶', name: 'Perros', adults: 4, children: 2, color: '#FFB366' },
        { emoji: '😺', name: 'Gatos', adults: 3, children: 3, color: '#66B3FF' },
        { emoji: '🐰', name: 'Conejos', adults: 2, children: 3, color: '#66FF66' }
      ],
      correctAnswers: [6, 6, 5]
    },
    {
      id: 'fruits-demo',
      title: 'Cuenta las Frutas',
      question: '¿Cuántas frutas observas?',
      instructions: 'Identifica y cuenta las diferentes frutas. Usa los controles interactivos para registrar tu respuesta.',
      allowEdit: true,
      maxTotal: 25,
      items: [
        { emoji: '🍎', name: 'Manzanas', adults: 5, children: 2, color: '#FF6B6B' },
        { emoji: '🍌', name: 'Bananas', adults: 3, children: 4, color: '#FFE66D' },
        { emoji: '🍇', name: 'Uvas', adults: 2, children: 3, color: '#9B59B6' }
      ],
      correctAnswers: [7, 7, 5]
    },
    {
      id: 'vehicles-demo',
      title: 'Cuenta los Vehículos',
      question: '¿Cuántos vehículos hay en total?',
      instructions: 'Observa los diferentes tipos de vehículos y registra las cantidades correctas.',
      allowEdit: true,
      maxTotal: 25,
      items: [
        { emoji: '🚗', name: 'Autos', adults: 4, children: 1, color: '#4ECDC4' },
        { emoji: '🚲', name: 'Bicicletas', adults: 3, children: 3, color: '#45B7D1' },
        { emoji: '🛵', name: 'Motos', adults: 2, children: 2, color: '#96CEB4' }
      ],
      correctAnswers: [5, 6, 4]
    },
    {
      id: 'sports-demo',
      title: 'Cuenta los Elementos Deportivos',
      question: '¿Cuántos elementos deportivos ves?',
      instructions: 'Identifica los diferentes elementos deportivos y cuenta con precisión cada tipo.',
      allowEdit: true,
      maxTotal: 25,
      items: [
        { emoji: '⚽', name: 'Pelotas de Fútbol', adults: 6, children: 0, color: '#E17055' },
        { emoji: '🏀', name: 'Pelotas de Básquet', adults: 3, children: 2, color: '#FDCB6E' },
        { emoji: '🎾', name: 'Pelotas de Tenis', adults: 2, children: 4, color: '#A29BFE' }
      ],
      correctAnswers: [6, 5, 6]
    }
  ];

  // Configuraciones de ejercicios de secuencias
  sequenceExerciseConfigs: SequenceExerciseConfig[] = [
    {
      id: 'arithmetic-sequence',
      title: 'Secuencia Aritmética',
      instructions: 'Analiza esta secuencia aritmética y predice los siguientes 3 valores. Identifica la diferencia común.',
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
    },
    {
      id: 'geometric-sequence',
      title: 'Secuencia Geométrica',
      instructions: 'Identifica el patrón en esta secuencia geométrica y calcula los próximos valores.',
      initialSequence: [3, 6, 12, 24, 48],
      targetPredictions: 3,
      allowInput: true,
      showFormula: true,
      correctAnswers: [96, 192, 384],
      hints: [
        'Observa la razón entre números consecutivos',
        'Si la razón es constante, es una secuencia geométrica',
        'La fórmula general es: an = a1 × r^(n-1)'
      ]
    },
    {
      id: 'fibonacci-sequence',
      title: 'Secuencia de Fibonacci',
      instructions: 'Analiza esta famosa secuencia matemática y continúa el patrón.',
      initialSequence: [1, 1, 2, 3, 5],
      targetPredictions: 4,
      allowInput: false,
      showFormula: true,
      correctAnswers: [8, 13, 21, 34],
      hints: [
        'Cada número es la suma de los dos anteriores',
        'Esta es la famosa secuencia de Fibonacci',
        'La fórmula es: an = an-1 + an-2'
      ]
    },
    {
      id: 'custom-sequence',
      title: 'Secuencia Personalizada',
      instructions: 'Ingresa tu propia secuencia y analiza su patrón matemático.',
      initialSequence: [1, 4, 9, 16, 25],
      targetPredictions: 2,
      allowInput: true,
      showFormula: false,
      hints: [
        'Prueba con diferentes tipos de secuencias',
        'Observa las diferencias entre términos consecutivos',
        'Algunos patrones pueden ser más complejos'
      ]
    }
  ];

  // Configuraciones de ejercicios de probabilidad
  probabilityExerciseConfigs: ProbabilityExerciseConfig[] = [
    {
      id: 'probability-basic',
      title: 'Probabilidad Básica',
      instructions: 'Aprende conceptos básicos de probabilidad con 6 esferas de colores. Cambia los colores y calcula probabilidades.',
      sphereColors: ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD'],
      colorNames: ['Rojo', 'Verde', 'Azul', 'Verde Claro', 'Amarillo', 'Morado'],
      questionType: 'probability',
      allowColorChange: true,
      simulationRounds: 10
    },
    {
      id: 'probability-colors',
      title: 'Colores Personalizados',
      instructions: 'Experimenta con diferentes combinaciones de colores y observa cómo cambian las probabilidades.',
      sphereColors: ['#FF6B6B', '#FF6B6B', '#4ECDC4', '#4ECDC4', '#45B7D1', '#45B7D1'],
      colorNames: ['Rojo', 'Rojo', 'Verde', 'Verde', 'Azul', 'Azul'],
      questionType: 'probability',
      allowColorChange: true,
      simulationRounds: 15
    },
    {
      id: 'probability-advanced',
      title: 'Simulación Avanzada',
      instructions: 'Realiza simulaciones más extensas para verificar la convergencia hacia la probabilidad teórica.',
      sphereColors: ['#FF6B6B', '#4ECDC4', '#4ECDC4', '#45B7D1', '#45B7D1', '#45B7D1'],
      colorNames: ['Rojo', 'Verde', 'Verde', 'Azul', 'Azul', 'Azul'],
      questionType: 'probability',
      allowColorChange: true,
      simulationRounds: 50
    },
    {
      id: 'probability-analysis',
      title: 'Análisis Estadístico',
      instructions: 'Analiza la distribución de probabilidades y compara resultados teóricos con simulaciones.',
      sphereColors: ['#FF6B6B', '#FF6B6B', '#FF6B6B', '#4ECDC4', '#4ECDC4', '#45B7D1'],
      colorNames: ['Rojo', 'Rojo', 'Rojo', 'Verde', 'Verde', 'Azul'],
      questionType: 'probability',
      allowColorChange: false,
      simulationRounds: 100
    }
  ];

  constructor(private router: Router) {}

  navigateToEmojiExercise(config: EmojiExerciseConfig): void {
    // Guardamos la configuración en sessionStorage para pasarla al componente
    sessionStorage.setItem('currentEmojiExerciseConfig', JSON.stringify(config));
    this.router.navigate(['/exercise/interactive-chart', config.id]);
  }

  navigateToSequenceExercise(config: SequenceExerciseConfig): void {
    // Guardamos la configuración en sessionStorage para pasarla al componente
    sessionStorage.setItem('currentSequenceExerciseConfig', JSON.stringify(config));
    this.router.navigate(['/exercise/sequence-analysis', config.id]);
  }

  navigateToProbabilityExercise(config: ProbabilityExerciseConfig): void {
    // Guardamos la configuración en sessionStorage para pasarla al componente
    sessionStorage.setItem('currentProbabilityExerciseConfig', JSON.stringify(config));
    this.router.navigate(['/exercise/probability-simulator', config.id]);
  }

  // Métodos auxiliares para la vista previa de probabilidad
  getSpherePosition(index: number): { x: number; y: number } {
    // Disposición piramidal: 3 en la base, 2 en el medio, 1 en la cima
    const positions = [
      { x: 20, y: 70 }, // Fila inferior
      { x: 50, y: 70 },
      { x: 80, y: 70 },
      { x: 35, y: 40 }, // Fila media
      { x: 65, y: 40 },
      { x: 50, y: 10 }  // Fila superior
    ];
    return positions[index] || { x: 50, y: 50 };
  }

  getUniqueColors(colorNames: string[]): string[] {
    return [...new Set(colorNames)];
  }

  getColorByName(config: ProbabilityExerciseConfig, colorName: string): string {
    const index = config.colorNames.findIndex(name => name === colorName);
    return index !== -1 ? config.sphereColors[index] : '#CCCCCC';
  }

  getColorCount(colorNames: string[], targetColor: string): number {
    return colorNames.filter(name => name === targetColor).length;
  }

  goBack(): void {
    this.router.navigate(['/learning/home']);
  }
} 