import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
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

export interface NextLearningPoint {
  learningPointId: number;
  title: string;
  description: string;
  sequenceOrder: number;
  estimatedDuration: number;
  difficultyWeight: number;
  unlockCriteria: string;
  unitId: number;
  unitTitle: string;
  totalLessons: number;
  lessons: LessonProgress[];
  unlocked: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class ProgressService {
  private baseUrl = `${environment.apiUrl}/progress`;

  constructor(private http: HttpClient) { }

  /**
   * Obtiene el learning path de un estudiante
   */
  getLearningPathByStudent(studentId: number): Observable<LearningPath> {
    return this.http.get<LearningPath>(`${this.baseUrl}/students/${studentId}/learning-path`);
  }

  /**
   * Obtiene el progreso actual completo de un estudiante
   */
  getCurrentProgress(studentId: number): Observable<CurrentProgress> {
    return this.http.get<CurrentProgress>(`${this.baseUrl}/students/${studentId}/current-progress`);
  }

  /**
   * Marca una lección como completada
   */
  completeLesson(studentId: number, lessonId: number, timeSpentMinutes?: number): Observable<LessonCompletion> {
    const params = timeSpentMinutes ? `?timeSpentMinutes=${timeSpentMinutes}` : '';
    
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
    
    return this.http.post<LearningPath>(`${this.baseUrl}/students/${studentId}/learning-path`, createData);
  }

  /**
   * Obtiene el siguiente learning point disponible
   */
  getNextLearningPoint(studentId: number): Observable<NextLearningPoint> {
    return this.http.get<NextLearningPoint>(`${this.baseUrl}/students/${studentId}/learning-path/next-learning-point`);
  }
} 