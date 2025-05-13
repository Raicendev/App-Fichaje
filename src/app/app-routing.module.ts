import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { RegistersComponent } from './registers/registers.component';
import { TimerComponent } from './timer/timer.component';
import { AuthGuard } from './auth/auth.guard';
import { VacationsComponent } from './vacations/vacations.component'; // ✅ AÑADIDO

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'registers', component: RegistersComponent },
  {
    path: 'timer',
    component: TimerComponent,
    canActivate: [AuthGuard]
  },
  { 
    path: 'vacations', 
    component: VacationsComponent, 
    canActivate: [AuthGuard] 
  }, // ✅ NUEVA RUTA
  { 
    path: 'users', 
    loadChildren: () => import('./features/users/users.module').then(m => m.UsersModule) 
  },
  { 
    path: 'auth', 
    loadChildren: () => import('./features/auth/auth.module').then(m => m.AuthModule) 
  },
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
