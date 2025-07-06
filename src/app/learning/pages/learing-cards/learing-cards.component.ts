import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FriendsComponent } from "../../../layout/components/friends/friends.component";
import { ProgressBarComponent } from "../../../layout/components/progress-bar/progress-bar.component";
import { SidebarMenuComponent } from "../../../layout/components/sidebar-menu/sidebar-menu.component";
import { LearningCard, LearningCardComponent } from "../../components/learning-card/learning-card.component";
import { LearningService } from '../../services/learning.service';
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

  constructor(
    private learningService: LearningService,
    private progressService: ProgressService,
    private userService: UserService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.loadLearningData();
  }

  private async loadLearningData() {
    try {
      this.isLoading = true;
      this.error = null;

      // Obtener el ID del usuario actual
      const userId = this.authService.getUserId();
      if (!userId) {
        throw new Error('Usuario no autenticado');
      }

      // Obtener los datos del estudiante
      const studentData = await this.userService.getStudentById(parseInt(userId)).toPromise();
      if (!studentData?.studentProfileId) {
        throw new Error('No se pudo obtener el perfil del estudiante');
      }

      // Obtener el progreso actual del estudiante
      const currentProgress = await this.progressService.getCurrentProgress(studentData.studentProfileId).toPromise();
      
      if (currentProgress?.learningPath) {
        await this.loadLearningPointsFromProgress(currentProgress);
      } else {
        // Si no hay progreso, mostrar contenido por defecto o crear learning path
        this.sections = [];
      }

    } catch (error: any) {
      console.error('Error cargando datos de aprendizaje:', error);
      this.error = 'Error al cargar el contenido de aprendizaje. Por favor, intenta nuevamente.';
    } finally {
      this.isLoading = false;
    }
  }

  private async loadLearningPointsFromProgress(progress: CurrentProgress) {
    try {
      // Obtener los learning points de la unidad actual
      const learningPoints = await this.learningService.getLearningPointsByUnit(progress.learningPath.unitsId).toPromise();
      
      if (learningPoints && learningPoints.length > 0) {
        // Agrupar por unidad (por ahora solo tenemos una unidad)
        const cards: LearningCard[] = learningPoints.map(point => {
          const isCompleted = progress.completedLearningPoints >= point.sequenceOrder;
          const isInProgress = progress.learningPath.currentLearningPointId === point.id;
          const isBlocked = point.sequenceOrder > progress.completedLearningPoints + 1;

          let status: 'COMPLETADO' | 'EN PROCESO' | 'BLOQUEADO';
          if (isCompleted) {
            status = 'COMPLETADO';
          } else if (isInProgress) {
            status = 'EN PROCESO';
          } else {
            status = 'BLOQUEADO';
          }

          return {
            id: point.id,
            title: point.title,
            subtitle: point.description,
            exerciseCount: point.exercisesCount || 0,
            status: status,
            points: isCompleted ? Math.round(point.difficultyWeight * 10) : 0,
            isBlocked: isBlocked
          };
        });

        this.sections = [
          {
            title: progress.learningPath.unitTitle || 'Contenido de Aprendizaje',
            cards: cards
          }
        ];
      }
    } catch (error) {
      console.error('Error cargando learning points:', error);
      // Fallback: mantener la estructura vacía
      this.sections = [];
    }
  }

  onCardClick(card: LearningCard) {
    if (!card.isBlocked) {
      console.log('Navegando a la ficha:', card.title);
      // Aquí iría la lógica de navegación a los ejercicios del learning point
      // Por ejemplo: this.router.navigate(['/exercises', card.id]);
    }
  }

  trackBySection(index: number, section: Section): string {
    return section.title;
  }

  trackByCard(index: number, card: LearningCard): number {
    return card.id;
  }
}
