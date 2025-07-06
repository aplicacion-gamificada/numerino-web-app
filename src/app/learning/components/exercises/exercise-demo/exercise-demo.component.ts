import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ChartExerciseConfig } from '../interactive-chart-exercise/interactive-chart-exercise.component';
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
  chartExerciseConfigs: ChartExerciseConfig[] = [
    {
      id: 'pets-chart',
      title: 'Mascotas Favoritas',
      instructions: 'Construye un gráfico de barras que muestre las mascotas favoritas de los estudiantes. Arrastra las barras o edita los valores en la tabla.',
      allowTableEdit: true,
      showAdultsFilter: false,
      chartData: {
        categories: ['Perro', 'Gato', 'Conejo', 'Pájaro'],
        values: [8, 6, 4, 10],
        colors: ['#FFB366', '#66B3FF', '#66FF66', '#FF6666'],
        maxValue: 14,
        gridSize: 30
      },
      correctAnswers: [12, 8, 6, 14]
    },
    {
      id: 'sports-chart',
      title: 'Deportes Más Populares',
      instructions: 'Analiza los datos de deportes más populares en tu escuela. Ajusta el gráfico para reflejar los valores correctos.',
      allowTableEdit: true,
      showAdultsFilter: false,
      chartData: {
        categories: ['Fútbol', 'Básquet', 'Voleibol', 'Natación', 'Tenis'],
        values: [15, 12, 8, 6, 4],
        colors: ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7'],
        maxValue: 20,
        gridSize: 25
      },
      correctAnswers: [18, 14, 10, 8, 6]
    },
    {
      id: 'colors-chart',
      title: 'Colores Favoritos',
      instructions: 'Crea un gráfico que muestre los colores favoritos de la clase. Puedes filtrar solo los datos de adultos si es necesario.',
      allowTableEdit: true,
      showAdultsFilter: true,
      chartData: {
        categories: ['Azul', 'Rojo', 'Verde', 'Amarillo', 'Morado'],
        values: [20, 15, 12, 8, 5],
        colors: ['#3498DB', '#E74C3C', '#2ECC71', '#F1C40F', '#9B59B6'],
        maxValue: 25,
        gridSize: 20
      }
    },
    {
      id: 'subjects-chart',
      title: 'Materias Favoritas',
      instructions: 'Representa las materias favoritas de los estudiantes. Este ejercicio solo permite ver los datos, no editarlos.',
      allowTableEdit: false,
      showAdultsFilter: false,
      chartData: {
        categories: ['Matemáticas', 'Ciencias', 'Historia', 'Arte', 'Educación Física'],
        values: [14, 18, 10, 12, 16],
        colors: ['#FF9F43', '#10AC84', '#EE5A24', '#F79F1F', '#5F27CD'],
        maxValue: 20,
        gridSize: 25
      }
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

  navigateToChartExercise(config: ChartExerciseConfig): void {
    // Guardamos la configuración en sessionStorage para pasarla al componente
    sessionStorage.setItem('currentExerciseConfig', JSON.stringify(config));
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