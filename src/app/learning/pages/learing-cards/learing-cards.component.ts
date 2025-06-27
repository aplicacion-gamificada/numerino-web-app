import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FriendsComponent } from "../../../layout/components/friends/friends.component";
import { ProgressBarComponent } from "../../../layout/components/progress-bar/progress-bar.component";
import { SidebarMenuComponent } from "../../../layout/components/sidebar-menu/sidebar-menu.component";
import { LearningCard, LearningCardComponent } from "../../components/learning-card/learning-card.component";

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
export class LearingCardsComponent {
 sections: Section[] = [];

  ngOnInit() {
    this.loadSections();
  }

  private loadSections() {
    // Simulando datos que luego vendrán de un servicio
    this.sections = [
      {
        title: 'Resuelve problemas de gestión de datos e incertidumbre',
        cards: [
          {
            id: 1,
            title: 'Diferenciamos datos',
            subtitle: 'Aprende a distinguir entre diferentes tipos de datos estadísticos',
            exerciseCount: 10,
            status: 'COMPLETADO',
            points: 50
          },
          {
            id: 2,
            title: 'Organizamos datos en tablas y gráficos',
            subtitle: 'Domina la organización y presentación visual de información',
            exerciseCount: 8,
            status: 'COMPLETADO',
            points: 40
          }
        ]
      },
      {
        title: 'Resuelve problemas de regularidad, equivalencia y cambio',
        cards: [
          {
            id: 3,
            title: 'Descubrimos patrones',
            subtitle: 'Identifica y analiza patrones matemáticos en secuencias',
            exerciseCount: 6,
            status: 'COMPLETADO',
            points: 30
          }
        ]
      },
      {
        title: 'Resuelve problemas de cantidad',
        cards: [
          {
            id: 4,
            title: 'Comparamos cantidades usando esquemas',
            subtitle: 'Utiliza representaciones gráficas para comparar magnitudes',
            exerciseCount: 7,
            status: 'COMPLETADO',
            points: 35
          },
          {
            id: 5,
            title: 'Jugamos con los números',
            subtitle: 'Explora propiedades y operaciones numéricas de forma lúdica',
            exerciseCount: 9,
            status: 'COMPLETADO',
            points: 45
          },
          {
            id: 6,
            title: 'Calculamos para decidir',
            subtitle: 'Aplica cálculos matemáticos en situaciones de toma de decisiones',
            exerciseCount: 5,
            status: 'EN PROCESO',
            points: 25
          }
        ]
      },
      {
        title: 'Resuelve problemas de forma, movimiento y localización',
        cards: [
          {
            id: 7,
            title: 'Identificamos la suma de los ángulos',
            subtitle: 'Comprende las propiedades angulares en figuras geométricas',
            exerciseCount: 0,
            status: 'BLOQUEADO',
            points: 0,
            isBlocked: true
          },
          {
            id: 8,
            title: 'Conocemos los prisma rectos',
            subtitle: 'Estudia las características y propiedades de los prismas',
            exerciseCount: 0,
            status: 'BLOQUEADO',
            points: 0,
            isBlocked: true
          }
        ]
      }
    ];
  }

  onCardClick(card: LearningCard) {
    if (!card.isBlocked) {
      console.log('Navegando a la ficha:', card.title);
      // Aquí iría la lógica de navegación
    }
  }

  trackBySection(index: number, section: Section): string {
    return section.title;
  }

  trackByCard(index: number, card: LearningCard): number {
    return card.id;
  }
}
