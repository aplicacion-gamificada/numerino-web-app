import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { forkJoin, of } from 'rxjs';
import { catchError, finalize, map, switchMap } from 'rxjs/operators';

import { FriendsComponent } from "../../../layout/components/friends/friends.component";
import { ProgressBarComponent } from "../../../layout/components/progress-bar/progress-bar.component";
import { SidebarMenuComponent } from "../../../layout/components/sidebar-menu/sidebar-menu.component";
import { LearningBlock, BloqueCardComponent } from '../../components/bloque-card/bloque-card.component';
import { AuthService } from '../../../auth/services/auth-services.service';
import { UserService } from '../../../auth/services/user.service';
import { StudentDetail } from '../../../auth/models/studentDetail.model';
import { LearningService, AssignedSpecializationDto, SpecializationProgressDto, ModuleProgressDto } from '../../services/learning.service';
import { ProgressService } from '../../../progress/services/progress.service';
import { NextAchievementComponent } from '../../../layout/components/next-achievement/next-achievement.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    FriendsComponent,
    ProgressBarComponent,
    SidebarMenuComponent,
    BloqueCardComponent,
    NextAchievementComponent
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit, OnDestroy {
  studentDetail: StudentDetail | null = null;
  studentName: string = '';
  learningBlocks: LearningBlock[] = [];
  currentProgress: number = 0;
  totalBlocks: number = 0;
  isLoading = false;
  hasError = false;
  errorMessage = '';

  // Nuevas propiedades para los datos específicos del estudiante
  assignedSpecialization: AssignedSpecializationDto | null = null;
  specializationProgress: SpecializationProgressDto | null = null;

  constructor(
    private authService: AuthService,
    private userService: UserService,
    private learningService: LearningService,
    private progressService: ProgressService
  ) { }

  ngOnInit(): void {
    this.loadStudentData();
  }

  ngOnDestroy(): void {
    // Cleanup si es necesario
  }

  public loadStudentData() {
    this.isLoading = true;
    this.hasError = false;
    
    // Primero obtener el perfil del estudiante
    this.userService.getProfile().pipe(
      switchMap((student: StudentDetail) => {
        this.studentDetail = student;
        this.studentName = student.fullName;
        
        // Ahora usar el studentProfileId real para obtener datos
        return forkJoin({
          assignedSpecialization: this.learningService.getAssignedSpecialization(),
          currentProgress: this.progressService.getCurrentProgress(student.studentProfileId).pipe(
            catchError((error) => {
              console.warn('No se pudo obtener el progreso actual:', error);
              return of(null);
            })
          )
        });
      }),
      catchError((error) => {
        console.error('Error loading student data:', error);
        this.hasError = true;
        this.errorMessage = 'Error al cargar los datos del estudiante';
        return of(null);
      }),
      finalize(() => this.isLoading = false)
    ).subscribe({
      next: (data) => {
        if (data && data.assignedSpecialization) {
          this.assignedSpecialization = data.assignedSpecialization;
          
          // Obtener el progreso detallado de la especialización
          this.loadSpecializationProgress(data.assignedSpecialization.specializationId);
          
          // Si hay progreso actual, también procesarlo
          if (data.currentProgress) {
            console.log('Progreso actual del estudiante:', data.currentProgress);
          }
        } else {
          this.hasError = true;
          this.errorMessage = 'No se pudo cargar la información del estudiante o no tiene una especialización asignada';
        }
      },
      error: (error) => {
        console.error('Error loading student data:', error);
        this.hasError = true;
        this.errorMessage = 'Error al cargar los datos del estudiante';
      }
    });
  }

  private loadSpecializationProgress(specializationId: number) {
    this.learningService.getSpecializationProgress(specializationId).pipe(
      catchError((error) => {
        console.error('Error loading specialization progress:', error);
        this.hasError = true;
        this.errorMessage = 'Error al cargar el progreso de la especialización';
        return of(null);
      })
    ).subscribe({
      next: (progress) => {
        if (progress) {
          this.specializationProgress = progress;
          this.processSpecializationProgress(progress);
        }
      },
      error: (error) => {
        console.error('Error loading specialization progress:', error);
        this.hasError = true;
        this.errorMessage = 'Error al cargar el progreso de la especialización';
      }
    });
  }

  private processSpecializationProgress(progress: SpecializationProgressDto) {
    // Actualizar estadísticas generales
    this.currentProgress = progress.overallProgress;
    this.totalBlocks = progress.totalModules;

    // Procesar módulos para crear bloques de aprendizaje
    this.learningBlocks = progress.modules.map((module, index) => {
      const status = this.getModuleStatus(module);
      const color = this.getColorByStatus(status, index, progress.modules.length, module.moduleTitle);
      
      return {
        id: module.moduleId,
        sequence: module.sequence,
        title: module.moduleTitle,
        subtitle: this.getSubtitleFromStatus(status),
        completedLessons: module.completedUnits,
        totalLessons: module.totalUnits,
        points: Math.round(module.progressPercentage),
        status: this.mapStatusToBlockStatus(status),
        color
      };
    });

    console.log('Processed learning blocks:', this.learningBlocks);
  }

  private getModuleStatus(module: ModuleProgressDto): 'active' | 'completed' | 'locked' | 'recommended' {
    if (module.isCompleted) {
      return 'completed';
    } else if (module.isUnlocked) {
      // Si está desbloqueado pero no completado, determinar si es recomendado o activo
      const hasProgress = module.progressPercentage > 0;
      return hasProgress ? 'active' : 'recommended';
    } else {
      return 'locked';
    }
  }

  private getSubtitleFromStatus(status: 'active' | 'completed' | 'locked' | 'recommended'): string {
    switch (status) {
      case 'completed':
        return 'Completado';
      case 'active':
        return 'En progreso';
      case 'recommended':
        return 'Recomendado';
      case 'locked':
        return '¡Desbloquea este módulo!';
      default:
        return '';
    }
  }

  private mapStatusToBlockStatus(status: 'active' | 'completed' | 'locked' | 'recommended'): 'completed' | 'in-progress' | 'locked' | 'recommended' {
    switch (status) {
      case 'active':
        return 'in-progress';
      case 'completed':
        return 'completed';
      case 'locked':
        return 'locked';
      case 'recommended':
        return 'recommended';
      default:
        return 'locked';
    }
  }

  private getColorByStatus(status: string, index: number, totalModules: number, moduleName?: string): 'primary' | 'secondary' | 'tertiary' | 'blue' | 'green' | 'yellow' | 'red' | 'success' | 'locked' {
    // BRAND COLORS del design system (_colors.scss)
    const brandColors: ('blue' | 'yellow' | 'red' | 'green')[] = [
      'blue',    // #2CBAE6 - Azul
      'yellow',  // #FFD33A - Amarillo  
      'red',     // #FF817C - Rojo
      'green'    // #74DEDD - Verde
    ];

    // Si el bloque está completado, siempre usar success (verde)
    if (status === 'completed') {
      return 'success';
    }

    // Si el bloque está bloqueado, usar locked (gris)
    if (status === 'locked') {
      return 'locked';
    }

    // Para bloques activos o recomendados, usar asignación basada en el nombre del módulo
    // Esto evita que siempre se repita el mismo patrón de colores
    const colorIndex = this.getColorIndexFromModuleName(moduleName || `module-${index}`, brandColors.length);
    
    return brandColors[colorIndex] as 'primary' | 'secondary' | 'tertiary' | 'blue' | 'green' | 'yellow' | 'red' | 'success' | 'locked';
  }

  /**
   * Genera un índice de color basado en el nombre del módulo
   * Usa un hash simple para asegurar consistencia pero variedad
   */
  private getColorIndexFromModuleName(moduleName: string, totalColors: number): number {
    // Crear un hash simple del nombre del módulo
    let hash = 0;
    for (let i = 0; i < moduleName.length; i++) {
      const char = moduleName.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convertir a entero de 32 bits
    }
    
    // Asegurar que el hash sea positivo y dentro del rango de colores
    return Math.abs(hash) % totalColors;
  }

  getBlockPosition(index: number): 'left' | 'right' {
    return index % 2 === 0 ? 'left' : 'right';
  }

  onBlockClick(block: LearningBlock) {
    console.log(`Clicked on block: ${block.title}`, block);
    
    // Solo permitir navegación si el bloque está desbloqueado
    if (block.status === 'locked') {
      console.log('Block is locked, cannot navigate');
      return;
    }

    // Navegar al módulo correspondiente
    // TODO: Implementar navegación a la vista de unidades del módulo
    console.log(`Navigating to module ${block.id}`);
  }

  getProgressText(): string {
    if (!this.specializationProgress) return 'Cargando...';
    
    const completedModules = this.specializationProgress.completedModules;
    const totalModules = this.specializationProgress.totalModules;
    
    return `${completedModules} de ${totalModules} módulos completados`;
  }

  getSpecializationTitle(): string {
    return this.assignedSpecialization?.specializationTitle || 'Cargando especialización...';
  }

  getNextRecommendation(): string {
    if (!this.specializationProgress?.nextLearningItem) return '';
    
    const nextItem = this.specializationProgress.nextLearningItem;
    return `Próximo: ${nextItem.itemTitle}`;
  }
}
