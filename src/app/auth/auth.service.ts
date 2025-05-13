import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../services/api.service';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<any>(null);
  public currentUser: Observable<any> = this.currentUserSubject.asObservable();

  private companies: any[] = [
    { id: 1, name: 'Empresa A', code: 'COMPA' },
    { id: 2, name: 'Empresa B', code: 'COMPB' }
  ];

  constructor(private api: ApiService, private router: Router) {
    this.loadCurrentUser();
  }

  private loadCurrentUser(): void {
    const user = localStorage.getItem('currentUser');
    if (user) {
      try {
        this.currentUserSubject.next(JSON.parse(user));
      } catch (e) {
        console.error('Error parsing currentUser from localStorage:', e);
        this.logout();
      }
    }
  }

  getCompanies(): any[] {
    return this.companies;
  }

  login(email: string, password: string): void {
    this.api.post('auth/login', { email, password }).subscribe({
      next: (response: any) => {
        if (response?.token && response?.user) {
          localStorage.setItem('access_token', response.token);
          localStorage.setItem('currentUser', JSON.stringify(response.user));
          this.currentUserSubject.next(response.user);
          this.router.navigate(['/time-tracking']);
        } else {
          console.error('Invalid login response:', response);
        }
      },
      error: (error) => {
        console.error('Login error:', error);
      }
    });
  }

  register(userData: any): void {
    this.api.post('auth/register', userData).subscribe({
      next: (response: any) => {
        if (response?.token && response?.user) {
          localStorage.setItem('access_token', response.token);
          localStorage.setItem('currentUser', JSON.stringify(response.user));
          this.currentUserSubject.next(response.user);
          this.router.navigate(['/time-tracking']);
        } else {
          console.error('Invalid registration response:', response);
        }
      },
      error: (error) => {
        console.error('Registration error:', error);
      }
    });
  }

  logout(): void {
    localStorage.removeItem('access_token');
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
    this.router.navigate(['/auth/login']);
  }

  getCurrentUser(): any {
    return this.currentUserSubject.value;
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem('access_token');
  }

  isSuperAdmin(): boolean {
    const user = this.getCurrentUser();
    return user?.role === 'superadmin';
  }
}