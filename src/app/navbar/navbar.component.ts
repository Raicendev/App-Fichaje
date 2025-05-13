import { Component, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {
  @Output() toggleSidebar = new EventEmitter<void>();
  isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';

  onLogout() {
    localStorage.removeItem('isLoggedIn');
    window.location.href = '/';
  }
}
