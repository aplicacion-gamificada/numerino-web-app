import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { TeacherRegisterRequest } from '../models/teacher-register.model';
import { StudentRegisterRequest } from '../models/student-register.model';
import { GuardianRegisterRequest } from '../models/guardian-register.model';
import { environment } from '../../environment/environment';

@Injectable({
  providedIn: 'root'
})
export class RegisterService {

  private baseUrl = `${environment.apiUrl}/register`;

    constructor(private http: HttpClient) {}

  registerTeacher(data: TeacherRegisterRequest) {
    return this.http.post(`${this.baseUrl}/teachers`, data);
  }

  registerStudent(data: StudentRegisterRequest) {
    return this.http.post(`${this.baseUrl}/students`, data);
  }

  registerGuardian(data: GuardianRegisterRequest) {
    return this.http.post(`${this.baseUrl}/guardians`, data);
  }
}
