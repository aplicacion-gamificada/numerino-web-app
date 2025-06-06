import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SidebarMenuComponent } from '../../../layout/components/sidebar-menu/sidebar-menu.component';
import { FriendsComponent } from '../../../layout/components/friends/friends.component';
import { ProgressBarComponent } from '../../../layout/components/progress-bar/progress-bar.component';

@Component({
  selector: 'app-home',
  imports: [
    SidebarMenuComponent,
    FriendsComponent,
    ProgressBarComponent
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {

}
