import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-sidebar-menu',
  imports: [RouterModule],
  templateUrl: './sidebar-menu.component.html',
  styleUrl: './sidebar-menu.component.scss'
})
export class SidebarMenuComponent {
menuItems = [
    { label: 'Inicio', icon: 'pi pi-home', route: '/inicio' },
    { label: 'Fichas', icon: 'pi pi-book', route: '/fichas' },
    { label: 'Logros', icon: 'pi pi-star', route: '/logros' },
    { label: 'Progreso', icon: 'pi pi-chart-line', route: '/progreso' },
    { label: 'Aula', icon: 'pi pi-users', route: '/aula' }
  ];

  user = {
    name: 'Diego Merino',
    avatar: '🧒' 
  };
}
