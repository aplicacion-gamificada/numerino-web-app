import { Component } from '@angular/core';
import { SidebarMenuComponent } from '../../../layout/components/sidebar-menu/sidebar-menu.component';
import { GeneralReviewComponent } from "../general-review/general-review.component";
import { StudyTimeComponent } from "../study-time/study-time.component";
import { ProgressBarComponent } from '../progress-bar/progress-bar.component';

@Component({
  selector: 'app-student-progress',
  imports: [SidebarMenuComponent, GeneralReviewComponent, StudyTimeComponent, ProgressBarComponent],
  templateUrl: './student-progress.component.html',
  styleUrl: './student-progress.component.scss'
})
export class StudentProgressComponent {

}
