import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { forkJoin, of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';

import { FriendsComponent } from "../../../layout/components/friends/friends.component";
import { ProgressBarComponent } from "../../../layout/components/progress-bar/progress-bar.component";
import { SidebarMenuComponent } from "../../../layout/components/sidebar-menu/sidebar-menu.component";
import { LearningBlock, BloqueCardComponent } from '../../components/bloque-card/bloque-card.component';
import { AuthService } from '../../../auth/services/auth-services.service';
import { UserService } from '../../../auth/services/user.service';
import { StudentDetail } from '../../../auth/models/studentDetail.model';
import { LearningService } from '../../services/learning.service';
import { ProgressService } from '../../../progress/services/progress.service';

@Component({
  selector: 'app-home',
  imports: [CommonModule, FriendsComponent, ProgressBarComponent, SidebarMenuComponent, BloqueCardComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {
  blocks: LearningBlock[] = [];
  studentName: string = '';
  studentDetail?: StudentDetail;
  isLoading = true;
  error: string | null = null;

  constructor(
    private authService: AuthService,
    private userService: UserService,
    private learningService: LearningService,
    private progressService: ProgressService
  ) { }

  ngOnInit() {
    this.loadStudentData();
  }

  public loadStudentData() {
    this.isLoading = true;
    
    // Obtener perfil del estudiante
    this.userService.getProfile().pipe(
      switchMap((student: StudentDetail) => {
        this.studentDetail = student;
        this.studentName = student.fullName;
        
        // Obtener progreso actual y módulos en paralelo
        return forkJoin({
          currentProgress: this.progressService.getCurrentProgress(student.studentProfileId).pipe(
            catchError(err => {
              console.warn('No se pudo obtener el progreso:', err);
              return of(null);
            })
          ),
          modules: this.learningService.getModulesBySpecializationId(1).pipe( // Cambiar por especialización real
            catchError(err => {
              console.error('Error al cargar módulos:', err);
              return of([]);
            })
          )
        });
      }),
      catchError(err => {
        console.error('Error al cargar datos del estudiante:', err);
        this.error = 'No se pudieron cargar los datos del estudiante';
        return of(null);
      })
    ).subscribe({
      next: (data) => {
        if (data) {
          this.processLearningData(data.modules, data.currentProgress);
        }
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error general:', err);
        this.error = 'Error al cargar los datos';
        this.isLoading = false;
      }
    });
  }

  private processLearningData(modules: any[], currentProgress: any) {
    this.blocks = modules.map((module, index) => {
      // Determinar progreso del módulo
      let completedLessons = 0;
      let totalLessons = module.unitsCount || 0;
      let status: 'completed' | 'in-progress' | 'locked' | 'recommended' = 'locked';

      if (currentProgress) {
        // Lógica para determinar progreso basado en el learningPath
        const moduleProgress = this.calculateModuleProgress(module, currentProgress);
        completedLessons = moduleProgress.completed;
        totalLessons = moduleProgress.total;
        status = moduleProgress.status;
      }

      return {
        id: module.id,
        title: module.title,
        subtitle: this.getSubtitleFromStatus(status, module.status),
        completedLessons,
        totalLessons,
        points: this.calculatePoints(completedLessons, totalLessons),
        status,
        color: this.getColorByStatus(status, index),
        isSpecial: false
      } as LearningBlock;
    });
  }

  private calculateModuleProgress(module: any, currentProgress: any) {
    // Lógica para calcular el progreso real del módulo
    // Basado en el learningPath y currentProgress
    
    if (!currentProgress.learningPath) {
      return { completed: 0, total: module.unitsCount || 0, status: 'locked' as const };
    }

    const isCurrentModule = currentProgress.learningPath.unitTitle === module.title;
    const completionPercentage = currentProgress.overallCompletionPercentage || 0;
    
    if (isCurrentModule) {
      return {
        completed: currentProgress.completedLessons || 0,
        total: currentProgress.totalLessons || module.unitsCount || 0,
        status: 'in-progress' as const
      };
    }

    // Lógica para determinar si está completado o bloqueado
    return {
      completed: completionPercentage >= 100 ? module.unitsCount || 0 : 0,
      total: module.unitsCount || 0,
      status: completionPercentage >= 100 ? 'completed' as const : 'locked' as const
    };
  }

  private calculatePoints(completed: number, total: number): number {
    return Math.floor((completed / total) * 100);
  }

  private getSubtitleFromStatus(status: string, moduleStatus: number): string | undefined {
    switch (status) {
      case 'completed':
        return 'Completado';
      case 'in-progress':
        return 'En progreso';
      case 'recommended':
        return 'Recomendado';
      case 'locked':
        return '¡Desbloquea este módulo!';
      default:
        return undefined;
    }
  }

  private getStatusFromCode(code: number): 'completed' | 'in-progress' | 'locked' | 'recommended' {
    switch (code) {
      case 1: return 'completed';
      case 2: return 'in-progress';
      case 3: return 'recommended';
      case 4: return 'locked';
      default: return 'locked';
    }
  }

  private getColorByStatus(status: string, index: number): 'blue' | 'green' | 'coral' | 'gray' {
    switch (status) {
      case 'completed':
        return 'green';
      case 'in-progress':
        return 'blue';
      case 'recommended':
        return 'coral';
      case 'locked':
        return 'gray';
      default:
        return index % 2 === 0 ? 'blue' : 'green';
    }
  }

  getBlockPosition(index: number): 'left' | 'right' {
    return index % 2 === 0 ? 'left' : 'right';
  }

  onBlockClick(block: LearningBlock) {
    if (block.status !== 'locked') {
      console.log('Navegando al bloque:', block.title);
      // Implementar navegación a las fichas (units) del módulo
      // this.router.navigate(['/learning/module', block.id]);
    }
  }

  trackByBlock(index: number, block: LearningBlock): number {
    return block.id;
  }
}
