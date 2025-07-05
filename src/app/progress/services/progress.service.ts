import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { environment } from '../../environment/environment';

// Interfaces basadas en la API
export interface LearningPath {
  id: number;
  studentProfileId: number;
  currentLearningPointId: number;
  currentLearningPointTitle: string;
  unitsId: number;
  unitTitle: string;
  completionPercentage: number;
  difficultyAdjustment: number;
  createdAt: string;
  updatedAt: string;
  totalLessons: number;
  completedLessons: number;
  remainingLessons: number;
  active: boolean;
}

export interface LearningPointProgress {
  learningPointId: number;
  title: string;
  description: string;
  totalLessons: number;
  completedLessons: number;
  completionPercentage: number;
  completedAt: string;
  completed: boolean;
}

export interface LessonProgress {
  lessonId: number;
  title: string;
  sequenceOrder: number;
  completedAt: string;
  timeSpentMinutes: number;
  mandatory: boolean;
  completed: boolean;
}

export interface CurrentProgress {
  studentProfileId: number;
  learningPath: LearningPath;
  totalLearningPoints: number;
  completedLearningPoints: number;
  totalLessons: number;
  completedLessons: number;
  overallCompletionPercentage: number;
  currentLearningPoint: LearningPointProgress;
  currentLessons: LessonProgress[];
}

export interface LessonCompletion {
  lessonId: number;
  lessonTitle: string;
  wasAlreadyCompleted: boolean;
  completedAt: string;
  learningPointProgress: LearningPointProgress;
  overallProgress: number;
  nextLessonId: number;
  nextLessonTitle: string;
  allLessonsCompleted: boolean;
  nextLearningPointId: number;
  nextLearningPointTitle: string;
}

@Injectable({
  providedIn: 'root'
})
export class ProgressService {
  private baseUrl = `${environment.apiUrl}/progress`;
  private isDevelopment = !environment.production;

  constructor(private http: HttpClient) { }

  /**
   * Obtiene el learning path de un estudiante
   */
  getLearningPathByStudent(studentId: number): Observable<LearningPath> {
    if (this.isDevelopment) {
      return of(this.getMockLearningPath(studentId));
    }
    return this.http.get<LearningPath>(`${this.baseUrl}/students/${studentId}/learning-path`);
  }

  /**
   * Obtiene el progreso actual completo de un estudiante
   */
  getCurrentProgress(studentId: number): Observable<CurrentProgress> {
    if (this.isDevelopment) {
      return of(this.getMockCurrentProgress(studentId));
    }
    return this.http.get<CurrentProgress>(`${this.baseUrl}/students/${studentId}/current-progress`);
  }

  /**
   * Marca una lección como completada
   */
  completeLesson(studentId: number, lessonId: number, timeSpentMinutes?: number): Observable<LessonCompletion> {
    const params = timeSpentMinutes ? `?timeSpentMinutes=${timeSpentMinutes}` : '';
    
    if (this.isDevelopment) {
      return of(this.getMockLessonCompletion(lessonId));
    }
    
    return this.http.post<LessonCompletion>(
      `${this.baseUrl}/students/${studentId}/lessons/${lessonId}/complete${params}`, 
      {}
    );
  }

  /**
   * Crea un learning path para un estudiante
   */
  createLearningPath(studentId: number, data: {
    unitsId: number;
    startingLearningPointId: number;
    difficultyAdjustment?: number;
  }): Observable<LearningPath> {
    const createData = {
      studentProfileId: studentId,
      ...data
    };
    
    if (this.isDevelopment) {
      return of(this.getMockLearningPath(studentId));
    }
    
    return this.http.post<LearningPath>(`${this.baseUrl}/students/${studentId}/learning-path`, createData);
  }

  /**
   * Obtiene el siguiente learning point disponible
   */
  getNextLearningPoint(studentId: number): Observable<any> {
    if (this.isDevelopment) {
      return of(this.getMockNextLearningPoint());
    }
    return this.http.get(`${this.baseUrl}/students/${studentId}/learning-path/next-learning-point`);
  }

  // Datos mock para desarrollo
  private getMockLearningPath(studentId: number): LearningPath {
    return {
      id: 1,
      studentProfileId: studentId,
      currentLearningPointId: 1,
      currentLearningPointTitle: 'Contar del 1 al 10',
      unitsId: 1,
      unitTitle: 'Números Naturales',
      completionPercentage: 37.5, // 3 de 8 lecciones completadas
      difficultyAdjustment: 1.0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      totalLessons: 8,
      completedLessons: 3,
      remainingLessons: 5,
      active: true
    };
  }

  private getMockCurrentProgress(studentId: number): CurrentProgress {
    return {
      studentProfileId: studentId,
      learningPath: this.getMockLearningPath(studentId),
      totalLearningPoints: 4,
      completedLearningPoints: 1,
      totalLessons: 8,
      completedLessons: 3,
      overallCompletionPercentage: 37.5,
      currentLearningPoint: {
        learningPointId: 1,
        title: 'Contar del 1 al 10',
        description: 'Aprende a contar números del 1 al 10',
        totalLessons: 3,
        completedLessons: 3,
        completionPercentage: 100,
        completedAt: new Date().toISOString(),
        completed: true
      },
      currentLessons: [
        {
          lessonId: 1,
          title: 'Los números del 1 al 5',
          sequenceOrder: 1,
          completedAt: new Date().toISOString(),
          timeSpentMinutes: 15,
          mandatory: true,
          completed: true
        },
        {
          lessonId: 2,
          title: 'Los números del 6 al 10',
          sequenceOrder: 2,
          completedAt: new Date().toISOString(),
          timeSpentMinutes: 12,
          mandatory: true,
          completed: true
        },
        {
          lessonId: 3,
          title: 'Práctica de conteo',
          sequenceOrder: 3,
          completedAt: new Date().toISOString(),
          timeSpentMinutes: 18,
          mandatory: false,
          completed: true
        }
      ]
    };
  }

  private getMockLessonCompletion(lessonId: number): LessonCompletion {
    return {
      lessonId: lessonId,
      lessonTitle: 'Lección completada',
      wasAlreadyCompleted: false,
      completedAt: new Date().toISOString(),
      learningPointProgress: {
        learningPointId: 1,
        title: 'Contar del 1 al 10',
        description: 'Aprende a contar números del 1 al 10',
        totalLessons: 3,
        completedLessons: 3,
        completionPercentage: 100,
        completedAt: new Date().toISOString(),
        completed: true
      },
      overallProgress: 40,
      nextLessonId: lessonId + 1,
      nextLessonTitle: 'Siguiente lección',
      allLessonsCompleted: false,
      nextLearningPointId: 2,
      nextLearningPointTitle: 'Números del 11 al 20'
    };
  }

  private getMockNextLearningPoint(): any {
    return {
      learningPointId: 2,
      title: 'Números del 11 al 20',
      description: 'Continúa aprendiendo números',
      sequenceOrder: 2,
      estimatedDuration: 30,
      difficultyWeight: 1.2,
      unlockCriteria: 'Completar punto anterior',
      unitId: 1,
      unitTitle: 'Números Naturales',
      totalLessons: 4,
      lessons: [],
      unlocked: true
    };
  }
} 