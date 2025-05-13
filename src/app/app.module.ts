import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { RegistersComponent } from './registers/registers.component';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { NavbarComponent } from './navbar/navbar.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { TimerComponent } from './timer/timer.component';

import { AuthGuard } from './auth/auth.guard';
import { AuthService } from './auth/auth.service';
import { HttpClientModule } from '@angular/common/http';

import {
  SocialLoginModule,
  SocialAuthServiceConfig,
  GoogleLoginProvider,
  MicrosoftLoginProvider
} from '@abacritt/angularx-social-login';
import { VacationsComponent } from './vacations/vacations.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegistersComponent,
    HomeComponent,
    NavbarComponent,
    SidebarComponent,
    TimerComponent,
    VacationsComponent,
   
    
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    SocialLoginModule,
    HttpClientModule
  ],
  providers: [
    AuthGuard,
    AuthService,
    {
      provide: 'SocialAuthServiceConfig',
      useValue: {
        autoLogin: false,
        providers: [
          {
            id: GoogleLoginProvider.PROVIDER_ID,
            provider: new GoogleLoginProvider(
              'TU_GOOGLE_CLIENT_ID' // 🔁 Reemplaza con tu ID real
            )
          },
          {
            id: MicrosoftLoginProvider.PROVIDER_ID,
            provider: new MicrosoftLoginProvider(
              'TU_OUTLOOK_CLIENT_ID', // 🔁 Reemplaza con tu ID real
              {
                authority: 'https://login.microsoftonline.com/common/',
                redirect_uri: window.location.origin,
                logout_redirect_uri: window.location.origin
              }
            )
          }
        ],
        onError: (err) => {
          console.error(err);
        }
      } as SocialAuthServiceConfig,
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
