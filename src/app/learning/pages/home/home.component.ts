import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
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
    private progressService: ProgressService,
    private router: Router
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
    
    // Iniciar la carga de datos en paralelo
    forkJoin({
      student: this.userService.getProfile(),
      assignedSpecialization: this.learningService.getAssignedSpecialization()
    }).pipe(
      switchMap(initialData => {
        this.studentDetail = initialData.student;
        this.studentName = initialData.student.fullName;
        this.assignedSpecialization = initialData.assignedSpecialization;

        if (!initialData.assignedSpecialization) {
          throw new Error('No se encontró una especialización asignada.');
        }

        // Ahora, con los IDs, obtenemos los datos de progreso en paralelo
        return forkJoin({
          specializationProgress: this.learningService.getSpecializationProgress(initialData.assignedSpecialization.specializationId),
          currentProgress: this.progressService.getCurrentProgress(initialData.student.studentProfileId).pipe(
            catchError(error => {
              console.warn('No se pudo obtener el progreso actual:', error);
              return of(null); // Continuar aunque falle
            })
          )
        });
      }),
      catchError(error => {
        console.error('Error al cargar los datos del estudiante:', error);
        this.hasError = true;
        this.errorMessage = error.message || 'Error al cargar los datos del estudiante.';
        return of(null);
      }),
      finalize(() => {
        this.isLoading = false;
      })
    ).subscribe(data => {
      if (data) {
        this.specializationProgress = data.specializationProgress;
        this.processSpecializationProgress(data.specializationProgress);
        
        if (data.currentProgress) {
          console.log('Progreso actual del estudiante:', data.currentProgress);
        }
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

    // Navegar a la vista de unidades del módulo
    this.router.navigate(['/learning/module', block.id]);
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

  trackByBlockId(index: number, block: LearningBlock): number {
    return block.id;
  }
}
