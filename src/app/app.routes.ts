import { Routes } from '@angular/router';
import { LandingComponent } from './auth/landing/landing.component';
import { LoginComponent } from './auth/login/login.component';
import { RoleSelectionComponent } from './auth/register/role-selection/role-selection.component';
import { StudentRegisterComponent } from './auth/register/student-register/student-register.component';
import { TeacherRegisterComponent } from './auth/register/teacher-register/teacher-register.component';
import { HomeComponent } from './learning/components/home/home.component';
import { AchievementComponent } from './achievement/components/achievement/achievement.component';
import { StudentProgressComponent } from './progress/components/student-progress/student-progress.component';
import { StudentClassroomComponent } from './classroom/components/student-classroom/student-classroom.component';


export const routes: Routes = [
    {
        path: '',
        redirectTo: 'welcome',
        pathMatch: 'full',
    },
    {
        path: 'welcome',
        component: LandingComponent,
    },
    {
        path: 'login',
        component: LoginComponent,
    },
    {
        path: 'role-selection',
        component: RoleSelectionComponent,
    },
    {
        path: 'student-register',
        component: StudentRegisterComponent,
    },
    {
        path: 'teacher-register',
        component: TeacherRegisterComponent,
    },
    {
        path: 'home',
        component: HomeComponent
    },
    {
        path: 'achievements',
        component: AchievementComponent
    },
    {
        path: 'progress',
        component: StudentProgressComponent
    },
    {
        path: 'classroom',
        component: StudentClassroomComponent
    }

];
