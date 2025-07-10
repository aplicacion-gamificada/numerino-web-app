import { Injectable } from '@angular/core';
import { environment } from '../../environment/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Achievement } from '../models/achievement.model';
import { AchievementStats } from '../models/achievement-stats.model';

@Injectable({
  providedIn: 'root'
})
export class AchievementService {
  private baseUrl = `${environment.apiUrl}/achievements`;

  constructor(private http: HttpClient) { }

  getAllAchievementsByUser(userId: number): Observable<Achievement[]> {
    return this.http.get<Achievement[]>(`${this.baseUrl}/all-achievements-by-user/${userId}`);
  }

  getAchievementStatsByUser(userId: number): Observable<AchievementStats> {
    return this.http.get<AchievementStats>(`${this.baseUrl}/achievement-stats/${userId}`);
  }

  getTotalPointsByUser(userId: number): Observable<{ points_amount: number }> {
    return this.http.get<{ points_amount: number }>(`${this.baseUrl}/total-points-by-user/${userId}`);
  }

  getUnlockedAchievementsByUser(userId: number): Observable<Achievement[]> {
    return this.http.get<Achievement[]>(`${this.baseUrl}/unlocked-achievements/${userId}`);
  }
}
