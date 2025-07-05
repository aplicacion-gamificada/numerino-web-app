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

export interface CurrentProgress {
  studentProfileId: number;
  learningPath: LearningPath;
  totalLearningPoints: number;
  completedLearningPoints: number;
  totalLessons: number;
  completedLessons: number;
  overallCompletionPercentage: number;
  currentLearningPoint: LearningPointProgress;
  currentLessons: any[];
}

@Injectable({
  providedIn: 'root'
})
export class ProgressService {
  private baseUrl = `${environment.apiUrl}/progress`;

  constructor(private http: HttpClient) { }

  getLearningPathByStudent(studentId: number): Observable<LearningPath> {
    return this.http.get<LearningPath>(`${this.baseUrl}/students/${studentId}/learning-path`);
  }

  getCurrentProgress(studentId: number): Observable<CurrentProgress> {
    return this.http.get<CurrentProgress>(`${this.baseUrl}/students/${studentId}/current-progress`);
  }

  completeLesson(studentId: number, lessonId: number, timeSpentMinutes?: number): Observable<any> {
    const params = timeSpentMinutes ? `?timeSpentMinutes=${timeSpentMinutes}` : '';
    return this.http.post(`${this.baseUrl}/students/${studentId}/lessons/${lessonId}/complete${params}`, {});
  }
} 