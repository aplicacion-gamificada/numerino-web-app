import { Injectable } from '@angular/core';
import { environment } from '../../environment/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { LearningModule } from '../models/learning-module.model';

// Interfaces basadas en la API
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
  lessonsCount: number;
}

export interface LearningPoint {
  difficultyWeight: number;
  exercisesCount: number;
  id: number;
  unitId: number;
  unitTitle: string;
  title: string;
  description: string;
  sequenceOrder: number;
  status: number;
  type: string;
}

// Nuevas interfaces para los endpoints del estudiante
export interface AssignedSpecializationDto {
  specializationId: number;
  specializationTitle: string;
  specializationDescription: string;
  stemAreaId: number;
  stemAreaTitle: string;
  classroomId: number;
  classroomName: string;
  totalModules: number;
  completedModules: number;
  progressPercentage: number;
  enrolledAt: string;
}

export interface ModuleProgressDto {
  moduleId: number;
  moduleTitle: string;
  moduleDescription: string;
  sequence: number;
  totalUnits: number;
  completedUnits: number;
  progressPercentage: number;
  isCompleted: boolean;
  isUnlocked: boolean;
  completedAt?: string;
}

export interface NextLearningItemDto {
  itemType: string;
  itemId: number;
  itemTitle: string;
  itemDescription: string;
  navigationPath: string;
  isRecommended: boolean;
  recommendationReason: string;
}

export interface SpecializationProgressDto {
  specializationId: number;
  specializationTitle: string;
  totalModules: number;
  completedModules: number;
  totalUnits: number;
  completedUnits: number;
  totalLessons: number;
  completedLessons: number;
  overallProgress: number;
  modules: ModuleProgressDto[];
  nextLearningItem: NextLearningItemDto;
  lastActivity: string;
}

@Injectable({
  providedIn: 'root'
})
export class LearningService {
  private baseUrl = `${environment.apiUrl}/learning`;
  private userUrl = `${environment.apiUrl}/user`;

  constructor(private http: HttpClient) { }

  /**
   * Obtiene todas las áreas STEM disponibles
   */
  getStemAreas(): Observable<StemArea[]> {
    return this.http.get<StemArea[]>(`${this.baseUrl}/stem-areas`);
  }

  /**
   * Obtiene las especializaciones de un área STEM específica
   */
  getSpecializationsByStemArea(stemAreaId: number): Observable<Specialization[]> {
    return this.http.get<Specialization[]>(`${this.baseUrl}/stem-areas/${stemAreaId}/specializations`);
  }

  /**
   * Obtiene los módulos de una especialización específica
   */
  getModulesBySpecializationId(specializationId: number): Observable<LearningModule[]> {
    return this.http.get<LearningModule[]>(`${this.baseUrl}/specializations/${specializationId}/modules`);
  }

  /**
   * Obtiene las unidades de un módulo específico
   */
  getUnitsByModuleId(moduleId: number): Observable<Unit[]> {
    return this.http.get<Unit[]>(`${this.baseUrl}/modules/${moduleId}/units`);
  }

  /**
   * Obtiene los puntos de aprendizaje de una unidad específica
   */
  getLearningPointsByUnit(unitId: number): Observable<LearningPoint[]> {
    return this.http.get<LearningPoint[]>(`${this.baseUrl}/units/${unitId}/learning-points`);
  }

  // Nuevos endpoints específicos del estudiante
  getAssignedSpecialization(): Observable<AssignedSpecializationDto> {
    return this.http.get<AssignedSpecializationDto>(`${this.userUrl}/student/assigned-specialization`);
  }

  getSpecializationProgress(specializationId: number): Observable<SpecializationProgressDto> {
    return this.http.get<SpecializationProgressDto>(`${this.userUrl}/student/specialization/${specializationId}/progress`);
  }

  // Método para obtener progreso de aula específica (opcional)
  getClassroomProgress(classroomId: number): Observable<any> {
    return this.http.get<any>(`${this.userUrl}/student/classroom/${classroomId}/progress`);
  }
}
