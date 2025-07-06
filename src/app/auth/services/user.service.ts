import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environment/environment';
import { StudentDetail } from '../models/studentDetail.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private baseUrl = `${environment.apiUrl}/users`;

  constructor(private http: HttpClient) { }

  getProfile(): Observable<StudentDetail> {
    return this.http.get<StudentDetail>(`${this.baseUrl}/profile`);
  }
}
