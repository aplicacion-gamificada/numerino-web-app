import { Injectable } from '@angular/core';
import { environment } from '../../environment/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { LearningModule } from '../models/learning-module.model';

@Injectable({
  providedIn: 'root'
})
export class LearningService {
  private baseUrl = `${environment.apiUrl}/learning`;

  constructor(private http: HttpClient) { }

  getModulesBySpecializationId(specializationId: number): Observable<LearningModule[]> {
    return this.http.get<LearningModule[]>(`${this.baseUrl}/specializations/${specializationId}/modules`);
  }
}
