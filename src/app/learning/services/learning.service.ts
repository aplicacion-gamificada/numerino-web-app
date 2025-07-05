import { Injectable } from '@angular/core';
import { environment } from '../../environment/environment';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
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
  private isDevelopment = !environment.production;

  constructor(private http: HttpClient) { }

  // Endpoints existentes
  getStemAreas(): Observable<StemArea[]> {
    if (this.isDevelopment) {
      return of(this.getMockStemAreas());
    }
    return this.http.get<StemArea[]>(`${this.baseUrl}/stem-areas`);
  }

  getSpecializationsByStemArea(stemAreaId: number): Observable<Specialization[]> {
    if (this.isDevelopment) {
      return of(this.getMockSpecializations());
    }
    return this.http.get<Specialization[]>(`${this.baseUrl}/stem-areas/${stemAreaId}/specializations`);
  }

  getModulesBySpecializationId(specializationId: number): Observable<LearningModule[]> {
    if (this.isDevelopment) {
      return of(this.getMockModules());
    }
    return this.http.get<LearningModule[]>(`${this.baseUrl}/specializations/${specializationId}/modules`);
  }

  getUnitsByModule(moduleId: number): Observable<Unit[]> {
    if (this.isDevelopment) {
      return of(this.getMockUnits());
    }
    return this.http.get<Unit[]>(`${this.baseUrl}/modules/${moduleId}/units`);
  }

  getLearningPointsByUnit(unitId: number): Observable<LearningPoint[]> {
    if (this.isDevelopment) {
      return of(this.getMockLearningPoints());
    }
    return this.http.get<LearningPoint[]>(`${this.baseUrl}/units/${unitId}/learning-points`);
  }

  // Datos mock para desarrollo
  private getMockStemAreas(): StemArea[] {
    return [
      {
        id: 1,
        title: 'Matemáticas',
        description: 'Área de matemáticas para estudiantes',
        status: 1,
        specializationsCount: 3
      }
    ];
  }

  private getMockSpecializations(): Specialization[] {
    return [
      {
        id: 1,
        stemAreaId: 1,
        stemAreaTitle: 'Matemáticas',
        title: 'Matemáticas Básica',
        description: 'Conceptos fundamentales de matemáticas',
        status: 1,
        modulesCount: 4
      }
    ];
  }

  private getMockModules(): LearningModule[] {
    return [
      {
        id: 1,
        specializationId: 1,
        specializationTitle: 'Matemáticas Básica',
        title: 'Números y Operaciones',
        description: 'Aprende sobre números y operaciones básicas',
        sequence: 1,
        status: 2, // En progreso
        unitsCount: 8
      },
      {
        id: 2,
        specializationId: 1,
        specializationTitle: 'Matemáticas Básica',
        title: 'Geometría Básica',
        description: 'Conceptos fundamentales de geometría',
        sequence: 2,
        status: 1, // Disponible
        unitsCount: 6
      },
      {
        id: 3,
        specializationId: 1,
        specializationTitle: 'Matemáticas Básica',
        title: 'Fracciones y Decimales',
        description: 'Trabajando con fracciones y números decimales',
        sequence: 3,
        status: 4, // Bloqueado
        unitsCount: 7
      },
      {
        id: 4,
        specializationId: 1,
        specializationTitle: 'Matemáticas Básica',
        title: 'Medidas y Proporciones',
        description: 'Unidades de medida y proporciones',
        sequence: 4,
        status: 4, // Bloqueado
        unitsCount: 5
      }
    ];
  }

  private getMockUnits(): Unit[] {
    return [
      {
        id: 1,
        moduleId: 1,
        moduleTitle: 'Números y Operaciones',
        title: 'Números Naturales',
        description: 'Introducción a los números naturales',
        sequence: 1,
        status: 1,
        learningPointsCount: 3,
        createdAt: new Date().toISOString()
      }
    ];
  }

  private getMockLearningPoints(): LearningPoint[] {
    return [
      {
        id: 1,
        learningPathId: 1,
        unitTitle: 'Números Naturales',
        title: 'Contar del 1 al 10',
        description: 'Aprende a contar números del 1 al 10',
        sequenceOrder: 1,
        estimatedDuration: 30,
        difficultyWeight: 1.0,
        masteryThreshold: 0.8,
        isPrerequisite: true,
        unlockCriteria: 'Ninguno',
        status: 1,
        lessonsCount: 3,
        exercisesCount: 5,
        createdAt: new Date().toISOString()
      }
    ];
  }
}
