import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidebarMenuComponent } from '../../../layout/components/sidebar-menu/sidebar-menu.component';
import { AchievementCardComponent } from '../achievement-card/achievement-card.component';
import { AchievementSummaryComponent } from '../achievement-summary/achievement-summary.component';
import { AchievementCardExpandedComponent } from "../achievement-card-expanded/achievement-card-expanded.component";
import { AchievementService } from '../../services/achievement.service';
import { AuthService } from '../../../auth/services/auth-services.service';
import { Achievement } from '../../models/achievement.model';
import { AchievementStats } from '../../models/achievement-stats.model';

@Component({
  selector: 'app-achievement',
  imports: [SidebarMenuComponent, AchievementCardComponent, AchievementSummaryComponent, AchievementCardExpandedComponent, CommonModule],
  templateUrl: './achievement.component.html',
  styleUrl: './achievement.component.scss'
})
export class AchievementComponent implements OnInit {
  unlockedAchievements: Achievement[] = [];
  lockedAchievements: Achievement[] = [];
  achievementStats: AchievementStats | null = null;
  totalPoints: number = 0;
  mostrarTodosDesbloqueados = false;
  mostrarTodosBloqueados = false;
  selectedLogro: Achievement | null = null;
  isLoading = true;
  hasError = false;

  constructor(
    private achievementService: AchievementService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    const userId = Number(this.authService.getUserId());
    if (!userId) {
      this.hasError = true;
      this.isLoading = false;
      return;
    }

    this.isLoading = true;
    this.hasError = false;

    // Cargar logros desbloqueados
    this.achievementService.getUnlockedAchievementsByUser(userId).subscribe({
      next: (achievements) => {
        this.unlockedAchievements = achievements;
        this.isLoading = false;
      },
      error: () => {
        this.hasError = true;
        this.isLoading = false;
      }
    });

    // Cargar stats
    this.achievementService.getAchievementStatsByUser(userId).subscribe({
      next: (stats) => {
        this.achievementStats = stats;
      }
    });

    // Cargar puntos totales
    this.achievementService.getTotalPointsByUser(userId).subscribe({
      next: (response) => {
        this.totalPoints = response.points_amount;
      }
    });

    // Cargar todos los logros para mostrar los bloqueados
    this.achievementService.getAllAchievementsByUser(userId).subscribe({
      next: (allAchievements) => {
        console.log('Todos los logros:', allAchievements); // <-- revisa aquí
        this.lockedAchievements = allAchievements.filter(a => a.is_unlocked === 0);
        console.log('Logros bloqueados:', this.lockedAchievements); // <-- revisa aquí
      }
    });
  }

  abrirPopUp(logro: Achievement) {
    this.selectedLogro = logro;
  }

  cerrarPopUp() {
    this.selectedLogro = null;
  }

  toggleMostrarTodosBloqueados() {
    this.mostrarTodosBloqueados = !this.mostrarTodosBloqueados;
  }

  toggleMostrarTodosDesbloqueados() {
    this.mostrarTodosDesbloqueados = !this.mostrarTodosDesbloqueados;
  }

  get logrosMostrados() {
    return this.mostrarTodosDesbloqueados ? this.unlockedAchievements : this.unlockedAchievements.slice(0, 4);
  }

  get logrosBloqueadosMostrados() {
    return this.mostrarTodosBloqueados ? this.lockedAchievements : this.lockedAchievements.slice(0, 4);
  }
}
