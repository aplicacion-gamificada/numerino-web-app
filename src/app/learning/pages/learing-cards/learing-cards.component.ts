import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { FriendsComponent } from "../../../layout/components/friends/friends.component";
import { ProgressBarComponent } from "../../../layout/components/progress-bar/progress-bar.component";
import { SidebarMenuComponent } from "../../../layout/components/sidebar-menu/sidebar-menu.component";
import { LearningCard, LearningCardComponent } from "../../components/learning-card/learning-card.component";
import { LearningService, Unit, SpecializationProgressDto, ModuleProgressDto } from '../../services/learning.service';
import { ProgressService, CurrentProgress } from '../../../progress/services/progress.service';
import { UserService } from '../../../auth/services/user.service';
import { AuthService } from '../../../auth/services/auth-services.service';

interface Section {
  title: string;
  cards: LearningCard[];
}

@Component({
  selector: 'app-learing-cards',
  imports: [FriendsComponent, ProgressBarComponent, SidebarMenuComponent, LearningCardComponent, CommonModule],
  templateUrl: './learing-cards.component.html',
  styleUrl: './learing-cards.component.scss'
})
export class LearingCardsComponent implements OnInit {
  sections: Section[] = [];
  isLoading = true;
  error: string | null = null;
  moduleId: number | null = null;
  moduleTitle: string = '';

  constructor(
    private learningService: LearningService,
    private progressService: ProgressService,
    private userService: UserService,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    // Obtener el moduleId de la ruta
    this.route.paramMap.subscribe(params => {
      const moduleIdParam = params.get('moduleId');
      if (moduleIdParam) {
        this.moduleId = parseInt(moduleIdParam, 10);
        this.loadModuleUnits();
      } else {
        // Si no hay moduleId, redirigir al home
        this.router.navigate(['/home']);
      }
    });
  }

  private async loadModuleUnits() {
    try {
      this.isLoading = true;
      this.error = null;

      if (!this.moduleId) {
        throw new Error('ID del módulo no válido');
      }

      // Obtener las unidades del módulo
      const units = await this.learningService.getUnitsByModuleId(this.moduleId).toPromise();
      
      if (units && units.length > 0) {
        // Obtener el progreso del estudiante para determinar el estado de cada unidad
        const studentData = await this.userService.getProfile().toPromise();
        let specializationProgress: SpecializationProgressDto | null = null;
        
        if (studentData?.studentProfileId) {
          try {
                         const assignedSpecialization = await this.learningService.getAssignedSpecialization().toPromise();
             if (assignedSpecialization) {
               specializationProgress = await this.learningService.getSpecializationProgress(assignedSpecialization.specializationId).toPromise() || null;
             }
          } catch (error) {
            console.warn('No se pudo obtener el progreso de la especialización:', error);
          }
        }

        // Obtener información del módulo actual
        const currentModule = specializationProgress?.modules.find(m => m.moduleId === this.moduleId) || null;
        this.moduleTitle = currentModule?.moduleTitle || `Módulo ${this.moduleId}`;

        // Convertir unidades a cards
        const cards: LearningCard[] = units.map(unit => {
          // Determinar el estado de la unidad basado en el progreso
          let status: 'COMPLETADO' | 'EN PROCESO' | 'BLOQUEADO' = 'BLOQUEADO';
          let isBlocked = true;
          let points = 0;

          if (currentModule) {
            // Lógica simple: si el módulo está desbloqueado, las unidades también
            if (currentModule.isUnlocked) {
              status = currentModule.isCompleted ? 'COMPLETADO' : 'EN PROCESO';
              isBlocked = false;
              points = currentModule.isCompleted ? Math.round(currentModule.progressPercentage) : 0;
            }
          }

          return {
            id: unit.id,
            title: unit.title,
            subtitle: unit.description,
            exerciseCount: unit.lessonsCount || 0,
            status: status,
            points: points,
            isBlocked: isBlocked
          };
        });

        this.sections = [
          {
            title: this.moduleTitle,
            cards: cards
          }
        ];
      } else {
        this.sections = [];
        this.error = 'No se encontraron unidades para este módulo';
      }

    } catch (error: any) {
      console.error('Error cargando unidades del módulo:', error);
      this.error = 'Error al cargar las unidades del módulo. Por favor, intenta nuevamente.';
    } finally {
      this.isLoading = false;
    }
  }



  onCardClick(card: LearningCard) {
    if (!card.isBlocked) {
      console.log('Navegando a la unidad:', card.title);
      // Navegar a los learning points de la unidad
      this.router.navigate(['/learning/unit', card.id]);
    }
  }

  trackBySection(index: number, section: Section): string {
    return section.title;
  }

  trackByCard(index: number, card: LearningCard): number {
    return card.id;
  }
}
