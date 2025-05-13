import { Component } from '@angular/core';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent {
  isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
  menuItems = [
    { icon: 'clock', label: 'Fichar', route: '/time-tracking' },
    { icon: 'calendar', label: 'Historial', route: '/history' },
    { icon: 'user', label: 'Perfil', route: '/profile' }
  ];
}
