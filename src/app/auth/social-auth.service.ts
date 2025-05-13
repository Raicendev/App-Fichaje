import { Injectable } from '@angular/core';
import { GoogleLoginProvider, MicrosoftLoginProvider, SocialAuthService, SocialUser } from '@abacritt/angularx-social-login';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class SocialAuthCustomService {
  constructor(
    private socialAuthService: SocialAuthService,
    private router: Router
  ) {}

  initializeAuthState() {
    this.socialAuthService.authState.subscribe((user: SocialUser) => {
      if (user) {
        console.log('Usuario social logueado:', user);
        // Aquí puedes manejar el login con tu backend
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('currentUser', JSON.stringify(user));
        this.router.navigate(['/time-tracking']);
      }
    });
  }

  signInWithGoogle(): void {
    this.socialAuthService.signIn(GoogleLoginProvider.PROVIDER_ID);
  }

  signInWithOutlook(): void {
    this.socialAuthService.signIn(MicrosoftLoginProvider.PROVIDER_ID);
  }

  signOut(): void {
    this.socialAuthService.signOut();
  }
}