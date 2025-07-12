import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { InteractiveChartExerciseConfig } from '../interactive-chart-exercise/interactive-chart-exercise.component';
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
  
  // Configuraciones de ejercicios de gráficos
  chartExerciseConfigs: InteractiveChartExerciseConfig[] = [
    {
      id: 'pets-counting',
      title: 'Cuenta las Mascotas',
      question: '¿Cuántas mascotas hay de cada tipo?',
      instructions: 'Observa las mascotas dispersas y cuenta cuántas hay de cada tipo usando los deslizadores.',
      allowSliderEdit: true,
      maxTotal: 25,
      items: [
        { symbol: '🐶', name: 'Perros', largeCount: 6, smallCount: 3, color: '#FFB366' },
        { symbol: '😺', name: 'Gatos', largeCount: 4, smallCount: 2, color: '#66B3FF' },
        { symbol: '🐰', name: 'Conejos', largeCount: 3, smallCount: 4, color: '#66FF66' }
      ],
      correctAnswers: [9, 6, 7]
    },
    {
      id: 'animals-counting',
      title: 'Animales de la Granja',
      question: '¿Cuántos animales ves en la granja?',
      instructions: 'Cuenta los animales grandes y pequeños y ajusta los valores con los deslizadores.',
      allowSliderEdit: true,
      maxTotal: 25,
      items: [
        { symbol: '🐄', name: 'Vacas', largeCount: 4, smallCount: 2, color: '#FF6B6B' },
        { symbol: '🐖', name: 'Cerdos', largeCount: 3, smallCount: 3, color: '#4ECDC4' },
        { symbol: '🐓', name: 'Gallinas', largeCount: 5, smallCount: 4, color: '#45B7D1' }
      ],
      correctAnswers: [6, 6, 9]
    },
    {
      id: 'toys-counting',
      title: 'Juguetes del Salón',
      question: '¿Cuántos juguetes hay de cada tipo?',
      instructions: 'Observa los juguetes dispersos y cuenta cuántos hay de cada tipo.',
      allowSliderEdit: true,
      maxTotal: 25,
      items: [
        { symbol: '🧸', name: 'Ositos', largeCount: 5, smallCount: 3, color: '#FF9F43' },
        { symbol: '🎈', name: 'Globos', largeCount: 4, smallCount: 4, color: '#10AC84' },
        { symbol: '🎾', name: 'Pelotas', largeCount: 3, smallCount: 2, color: '#EE5A24' }
      ],
      correctAnswers: [8, 8, 5]
    },
    {
      id: 'fruits-counting',
      title: 'Frutas del Mercado',
      question: '¿Cuántas frutas hay de cada tipo?',
      instructions: 'Cuenta las frutas que ves y ajusta los valores. Este ejercicio es solo para observar.',
      allowSliderEdit: false,
      maxTotal: 25,
      items: [
        { symbol: '🍎', name: 'Manzanas', largeCount: 6, smallCount: 2, color: '#E74C3C' },
        { symbol: '🍌', name: 'Bananas', largeCount: 4, smallCount: 3, color: '#F1C40F' },
        { symbol: '🍊', name: 'Naranjas', largeCount: 3, smallCount: 4, color: '#FF8C00' }
      ]
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

  navigateToChartExercise(config: InteractiveChartExerciseConfig): void {
    // Guardamos la configuración en sessionStorage para pasarla al componente
    sessionStorage.setItem('currentInteractiveExerciseConfig', JSON.stringify(config));
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

  getTotalItemsForConfig(config: InteractiveChartExerciseConfig): number {
    return config.items.reduce((total, item) => total + item.largeCount + item.smallCount, 0);
  }

  goBack(): void {
    this.router.navigate(['/learning/home']);
  }
} 