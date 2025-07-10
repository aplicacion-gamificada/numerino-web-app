import { Injectable } from '@angular/core';
import { environment } from '../../environment/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ClassRoomData } from '../models/classroom-data.model';
import { Classmates } from '../models/classmates.model';

@Injectable({
  providedIn: 'root'
})
export class ClassroomService {
  private baseUrl = `${environment.apiUrl}/students/classrooms`;
  constructor(private http: HttpClient) { }

  getClassroomDataByUser(userId: number): Observable<ClassRoomData> {
    return this.http.get<ClassRoomData>(`${this.baseUrl}/class-data/${userId}`);
  }

  getClassmatesByUser(userId: number): Observable<Classmates[]> {
    return this.http.get<Classmates[]>(`${this.baseUrl}/classmates/${userId}`);
  }
}
