import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidebarMenuComponent } from '../../../layout/components/sidebar-menu/sidebar-menu.component';
import { AchievementCardComponent } from '../achievement-card/achievement-card.component';
import { AchievementSummaryComponent } from '../achievement-summary/achievement-summary.component';
import { AchievementCardExpandedComponent } from "../achievement-card-expanded/achievement-card-expanded.component";
@Component({
  selector: 'app-achievement',
  imports: [SidebarMenuComponent, AchievementCardComponent, AchievementSummaryComponent, AchievementCardExpandedComponent, CommonModule],
  templateUrl: './achievement.component.html',
  styleUrl: './achievement.component.scss'
})
export class AchievementComponent {
  logros = [
    {
      imageUrl: 'images/icon-achievement-1.png',
      title: 'Maestro de las operaciones',
      titleColor: '#1C4772',
      subtitle: 'Completa el Bloque 1',
      description: '¡Felicidades! Has dominado todas las operaciones básicas del Bloque 1 como un verdadero samurái matemático. Las calculadoras tiemblan ante tu presencia... ¡ya no te necesitan!',
      description_points: 'Ganaste +100 puntos',
      points: '+100 puntos',
      pointsColor: '#0CB976'
    },
    {
      imageUrl: 'images/icon-racha.png',
      title: 'Racha de fuego',
      titleColor: '#1C4772',
      subtitle: '5 días consecutivos',
      description: '¡Felicidades! Has dominado todas las operaciones básicas del Bloque 1 como un verdadero samurái matemático. Las calculadoras tiemblan ante tu presencia... ¡ya no te necesitan!',
      description_points: 'Ganaste +100 puntos',
      points: '+50 puntos',
      pointsColor: '#FF6C4E'
    },
    {
      imageUrl: 'images/icon-achievement-2.png',
      title: 'Matemático Veloz',
      titleColor: '#1C4772',
      subtitle: 'Resuelve 5 ejercicios en menos de 5 minutos',
      description: '¡Felicidades! Has dominado todas las operaciones básicas del Bloque 1 como un verdadero samurái matemático. Las calculadoras tiemblan ante tu presencia... ¡ya no te necesitan!',
      description_points: 'Ganaste +100 puntos',
      points: '+75 puntos',
      pointsColor: '#F67905'
    },
    {
      imageUrl: 'images/icon-achievement-1.png',
      title: 'Perfeccionista',
      titleColor: '#1C4772',
      subtitle: 'Resuelve 5 ejercicios seguidos sin errores',
      description: '¡Felicidades! Has dominado todas las operaciones básicas del Bloque 1 como un verdadero samurái matemático. Las calculadoras tiemblan ante tu presencia... ¡ya no te necesitan!',
      description_points: 'Ganaste +100 puntos',
      points: '+110 puntos',
      pointsColor: '#0CB976'
    },
    {
      imageUrl: 'images/icon-achievement-1.png',
      title: 'Perfeccionista',
      titleColor: '#1C4772',
      subtitle: 'Resuelve 5 ejercicios seguidos sin errores',
      description: '¡Felicidades! Has dominado todas las operaciones básicas del Bloque 1 como un verdadero samurái matemático. Las calculadoras tiemblan ante tu presencia... ¡ya no te necesitan!',
      description_points: 'Ganaste +100 puntos',
      points: '+110 puntos',
      pointsColor: '#0CB976'
    }
  ];

  proximos_logros = [
    {
      imageUrl: 'images/icon-achievement-locked.png',
      title: 'Explorador Matemático',
      titleColor: '#989898',
      subtitle: 'Completa el Bloque 2',
      points: '+150 puntos',
      pointsColor: '#989898'
    },
    {
      imageUrl: 'images/icon-achievement-locked.png',
      title: 'Conquistador Numérico',
      titleColor: '#989898',
      subtitle: 'Completa el Bloque 3',
      points: '+200 puntos',
      pointsColor: '#989898'
    },
    {
      imageUrl: 'images/icon-achievement-locked.png',
      title: 'Maestro Supremo',
      titleColor: '#989898',
      subtitle: 'Completa el Bloque 4',
      points: '+300 puntos',
      pointsColor: '#989898'
    },
    {
      imageUrl: 'images/icon-achievement-locked.png',
      title: 'Gladiador',
      titleColor: '#989898',
      subtitle: 'Resuelve 20 ejercicios en total',
      points: '+250 puntos',
      pointsColor: '#989898'
    },
    {
      imageUrl: 'images/icon-achievement-locked.png',
      title: 'Gladiador',
      titleColor: '#989898',
      subtitle: 'Resuelve 20 ejercicios en total',
      points: '+250 puntos',
      pointsColor: '#989898'
    }
  ];

  mostrarTodosDesbloqueados = false;
  mostrarTodosBloqueados = false;

  selectedLogro: any = null;

  abrirPopUp(logro: any) {
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
    return this.mostrarTodosDesbloqueados ? this.logros : this.logros.slice(0, 4);
  }

  get logrosBloqueadosMostrados(){
    return this.mostrarTodosBloqueados ? this.proximos_logros : this.proximos_logros.slice(0, 4);
  }
}
