import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { FriendsComponent } from "../../../layout/components/friends/friends.component";
import { ProgressBarComponent } from "../../../layout/components/progress-bar/progress-bar.component";
import { SidebarMenuComponent } from "../../../layout/components/sidebar-menu/sidebar-menu.component";
import { LearningCard, LearningCardComponent } from "../../components/learning-card/learning-card.component";
import { LearningService, LearningPoint } from '../../services/learning.service';
import { ProgressService, CurrentProgress } from '../../../progress/services/progress.service';
import { UserService } from '../../../auth/services/user.service';

interface Section {
  title: string;
  cards: LearningCard[];
}

@Component({
  selector: 'app-unit-learning-points',
  standalone: true,
  imports: [FriendsComponent, ProgressBarComponent, SidebarMenuComponent, LearningCardComponent, CommonModule],
  templateUrl: './unit-learning-points.component.html',
  styleUrl: './unit-learning-points.component.scss'
})
export class UnitLearningPointsComponent implements OnInit {
  sections: Section[] = [];
  isLoading = true;
  error: string | null = null;
  unitId: number | null = null;
  unitTitle: string = '';

  constructor(
    private learningService: LearningService,
    private progressService: ProgressService,
    private userService: UserService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    // Obtener el unitId de la ruta
    this.route.paramMap.subscribe(params => {
      const unitIdParam = params.get('unitId');
      if (unitIdParam) {
        this.unitId = parseInt(unitIdParam, 10);
        this.loadUnitLearningPoints();
      } else {
        this.error = 'No se especificó una unidad válida';
        this.isLoading = false;
      }
    });
  }

  private async loadUnitLearningPoints() {
    try {
      this.isLoading = true;
      this.error = null;

      if (!this.unitId) {
        throw new Error('ID de la unidad no válido');
      }

      // Obtener los learning points de la unidad
      const learningPoints = await this.learningService.getLearningPointsByUnit(this.unitId).toPromise();
      
      if (learningPoints && learningPoints.length > 0) {
        // Obtener el progreso del estudiante para determinar el estado de cada learning point
        const studentData = await this.userService.getProfile().toPromise();
        let currentProgress: CurrentProgress | null = null;
        
        if (studentData?.studentProfileId) {
          try {
            currentProgress = await this.progressService.getCurrentProgress(studentData.studentProfileId).toPromise() || null;
          } catch (error) {
            console.warn('No se pudo obtener el progreso actual:', error);
          }
        }

        // Obtener el título de la unidad del primer learning point
        this.unitTitle = learningPoints[0].unitTitle || `Unidad ${this.unitId}`;

        // Convertir learning points a cards
        const cards: LearningCard[] = learningPoints.map(point => {
          // Determinar el estado del learning point basado en el progreso
          let status: 'COMPLETADO' | 'EN PROCESO' | 'BLOQUEADO' = 'BLOQUEADO';
          let isBlocked = true;
          let points = 0;

          if (currentProgress?.learningPath) {
            const isCompleted = currentProgress.completedLearningPoints >= point.sequenceOrder;
            const isInProgress = currentProgress.learningPath.currentLearningPointId === point.id;
            const isAccessible = point.sequenceOrder <= currentProgress.completedLearningPoints + 1;

            if (isCompleted) {
              status = 'COMPLETADO';
              isBlocked = false;
              points = Math.round(point.difficultyWeight * 10);
            } else if (isInProgress) {
              status = 'EN PROCESO';
              isBlocked = false;
            } else if (isAccessible) {
              status = 'EN PROCESO';
              isBlocked = false;
            }
          }

          return {
            id: point.id,
            title: point.title,
            subtitle: point.description,
            exerciseCount: point.exercisesCount || 0,
            status: status,
            points: points,
            isBlocked: isBlocked
          };
        });

        this.sections = [
          {
            title: this.unitTitle,
            cards: cards
          }
        ];
      } else {
        this.sections = [];
        this.error = 'No se encontraron puntos de aprendizaje para esta unidad';
      }

    } catch (error: any) {
      console.error('Error cargando puntos de aprendizaje de la unidad:', error);
      this.error = 'Error al cargar los puntos de aprendizaje. Por favor, intenta nuevamente.';
    } finally {
      this.isLoading = false;
    }
  }

  onCardClick(card: LearningCard) {
    if (!card.isBlocked) {
      console.log('Navegando al punto de aprendizaje:', card.title);
      // Aquí iría la navegación a los ejercicios del learning point
      // Por ejemplo: this.router.navigate(['/exercises', card.id]);
      // Por ahora solo mostramos un mensaje
      alert(`Navegando a: ${card.title}\n\nAquí se implementarían los ejercicios del punto de aprendizaje.`);
    }
  }

  trackBySection(index: number, section: Section): string {
    return section.title;
  }

  trackByCard(index: number, card: LearningCard): number {
    return card.id;
  }
} 