import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FriendsComponent } from "../../../layout/components/friends/friends.component";
import { ProgressBarComponent } from "../../../layout/components/progress-bar/progress-bar.component";
import { SidebarMenuComponent } from "../../../layout/components/sidebar-menu/sidebar-menu.component";
import { LearningBlock, BloqueCardComponent } from '../../components/bloque-card/bloque-card.component';
import { AuthService } from '../../../auth/services/auth-services.service';
import { UserService } from '../../../auth/services/user.service';
import { StudentDetail } from '../../../auth/models/studentDetail.model';
import { LearningService } from '../../services/learning.service';
import { LearningModule } from '../../models/learning-module.model';

@Component({
  selector: 'app-home',
  imports: [CommonModule, FriendsComponent, ProgressBarComponent, SidebarMenuComponent, BloqueCardComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  blocks: LearningBlock[] = [];
  studentName: string = '';

  constructor(private authService: AuthService, private userService: UserService, private learningService: LearningService) { }

  ngOnInit() {
    this.loadBlocks();
    this.loadStudentInfo();
  }

  private loadStudentInfo() {
    this.userService.getProfile().subscribe({
      next: (student: StudentDetail) => {
        this.studentName = student.fullName || student.firstName || '';
      }
    });
  }

  private loadBlocks() {
    const specializationId = 1; // o el que corresponda
    this.learningService.getModulesBySpecializationId(specializationId).subscribe({
      next: (modules: LearningModule[]) => {
        this.blocks = modules.map((module, index) => {
          return {
            id: module.sequence,
            title: module.title,
            subtitle: this.getSubtitleFromStatus(module.status),
            completedLessons: 0, // puedes llenar esto cuando tengas progreso real
            totalLessons: module.unitsCount,
            points: 0, // opcional, si llega desde otro endpoint
            status: this.getStatusFromCode(module.status),
            color: this.getColorByIndex(index)
          };
        });
      },
      error: (err) => {
        console.error('Error al cargar módulos:', err);
      }
    });
  }

  getStatusFromCode(code: number): 'completed' | 'in-progress' | 'locked' | 'recommended' {
    switch (code) {
      case 1: return 'completed';
      case 2: return 'in-progress';
      case 3: return 'recommended';
      case 4: return 'locked';
      default: return 'locked';
    }
  }

  getSubtitleFromStatus(code: number): string | undefined {
    if (code === 3) return 'Recomendado';
    if (code === 4) return '¡Desbloquea este módulo!';
    return undefined;
  }

  getColorByIndex(index: number): 'blue' | 'green' | 'coral' | 'gray' {
    const colors: ('blue' | 'green' | 'coral' | 'gray')[] = ['blue', 'green', 'coral', 'gray'];
    return colors[index % colors.length];
  }


  getBlockPosition(index: number): 'left' | 'right' {
    return index % 2 === 0 ? 'left' : 'right';
  }

  onBlockClick(block: LearningBlock) {
    if (block.status !== 'locked') {
      console.log('Navegando al bloque:', block.title);
      // Aquí iría la lógica de navegación
    }
  }

  trackByBlock(index: number, block: LearningBlock): number {
    return block.id;
  }
}
