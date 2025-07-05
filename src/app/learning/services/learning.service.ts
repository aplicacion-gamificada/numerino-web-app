import { Injectable } from '@angular/core';
import { environment } from '../../environment/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { LearningModule } from '../models/learning-module.model';

// Nuevos interfaces basados en la API
export interface StemArea {
  id: number;
  title: string;
  description: string;
  status: number;
  specializationsCount: number;
}

export interface Specialization {
  id: number;
  stemAreaId: number;
  stemAreaTitle: string;
  title: string;
  description: string;
  status: number;
  modulesCount: number;
}

export interface Unit {
  id: number;
  moduleId: number;
  moduleTitle: string;
  title: string;
  description: string;
  sequence: number;
  status: number;
  learningPointsCount: number;
  createdAt: string;
}

export interface LearningPoint {
  id: number;
  learningPathId: number;
  unitTitle: string;
  title: string;
  description: string;
  sequenceOrder: number;
  estimatedDuration: number;
  difficultyWeight: number;
  masteryThreshold: number;
  isPrerequisite: boolean;
  unlockCriteria: string;
  status: number;
  lessonsCount: number;
  exercisesCount: number;
  createdAt: string;
}

@Injectable({
  providedIn: 'root'
})
export class LearningService {
  private baseUrl = `${environment.apiUrl}/learning`;

  constructor(private http: HttpClient) { }

  // Endpoints existentes
  getStemAreas(): Observable<StemArea[]> {
    return this.http.get<StemArea[]>(`${this.baseUrl}/stem-areas`);
  }

  getSpecializationsByStemArea(stemAreaId: number): Observable<Specialization[]> {
    return this.http.get<Specialization[]>(`${this.baseUrl}/stem-areas/${stemAreaId}/specializations`);
  }

  getModulesBySpecializationId(specializationId: number): Observable<LearningModule[]> {
    return this.http.get<LearningModule[]>(`${this.baseUrl}/specializations/${specializationId}/modules`);
  }

  getUnitsByModule(moduleId: number): Observable<Unit[]> {
    return this.http.get<Unit[]>(`${this.baseUrl}/modules/${moduleId}/units`);
  }

  getLearningPointsByUnit(unitId: number): Observable<LearningPoint[]> {
    return this.http.get<LearningPoint[]>(`${this.baseUrl}/units/${unitId}/learning-points`);
  }
}
