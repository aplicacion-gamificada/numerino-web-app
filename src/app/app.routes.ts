import { Routes } from '@angular/router';
import { LandingComponent } from './auth/landing/landing.component';
import { LoginComponent } from './auth/login/login.component';
import { RoleSelectionComponent } from './auth/register/role-selection/role-selection.component';
import { StudentRegisterComponent } from './auth/register/student-register/student-register.component';
import { TeacherRegisterComponent } from './auth/register/teacher-register/teacher-register.component';
import { HomeComponent } from './learning/pages/home/home.component';
import { AchievementComponent } from './achievement/components/achievement/achievement.component';
import { StudentProgressComponent } from './progress/components/student-progress/student-progress.component';
import { StudentClassroomComponent } from './classroom/components/student-classroom/student-classroom.component';
import { LearingCardsComponent } from './learning/pages/learing-cards/learing-cards.component';
import { UnitLearningPointsComponent } from './learning/pages/unit-learning-points/unit-learning-points.component';
import { InteractiveChartExerciseComponent } from './learning/components/exercises/interactive-chart-exercise/interactive-chart-exercise.component';
import { SequenceAnalysisExerciseComponent } from './learning/components/exercises/sequence-analysis-exercise/sequence-analysis-exercise.component';
import { ProbabilitySimulatorExerciseComponent } from './learning/components/exercises/probability-simulator-exercise/probability-simulator-exercise.component';
import { ExerciseDemoComponent } from './learning/components/exercises/exercise-demo/exercise-demo.component';


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
        path: 'learning/home',
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
    },
    {
        path: 'learning',
        component: LearingCardsComponent
    },
    {
        path: 'learning/module/:moduleId',
        component: LearingCardsComponent
    },
    {
        path: 'learning/unit/:unitId',
        component: UnitLearningPointsComponent
    },
    {
        path: 'exercise/interactive-chart',
        component: InteractiveChartExerciseComponent
    },
    {
        path: 'exercise/interactive-chart/:exerciseId',
        component: InteractiveChartExerciseComponent
    },
    {
        path: 'exercise/sequence-analysis',
        component: SequenceAnalysisExerciseComponent
    },
    {
        path: 'exercise/sequence-analysis/:exerciseId',
        component: SequenceAnalysisExerciseComponent
    },
    {
        path: 'exercise/probability-simulator',
        component: ProbabilitySimulatorExerciseComponent
    },
    {
        path: 'exercise/probability-simulator/:exerciseId',
        component: ProbabilitySimulatorExerciseComponent
    },
    {
        path: 'learning/exercises/demo',
        component: ExerciseDemoComponent
    },
    {
        path: 'exercise-demo',
        component: ExerciseDemoComponent
    }

];
