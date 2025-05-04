import { Routes } from '@angular/router';
import { BusquedaComponent } from './page/busqueda/busqueda.component';
import { LoginComponent } from './page/login/login.component';
import { RegisterComponent } from './page/register/register.component';
import { AddCompanyComponent } from './page/add-company/add-company.component';

export const routes: Routes = [
    {path: 'login', component: LoginComponent},
    {path: 'register', component: RegisterComponent},
    {path: 'addCompany', component: AddCompanyComponent},
    {path: 'busqueda', component: BusquedaComponent},
    {path: '', redirectTo: 'login', pathMatch: 'full'},
    {path: '**', component: LoginComponent, pathMatch: 'full'}
];
