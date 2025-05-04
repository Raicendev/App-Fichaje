import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, FormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  public usuario: string = '';
  public contrasena: string = '';
  public errorMessage: string = '';
  public showAlertError: boolean = false;
  public showAlertSuccess: boolean = false;

  constructor(private router: Router, private http: HttpClient) { } // Inyecta HttpClient

  // Método para iniciar sesión
  iniciarSesion(usuario: string, contrasena: string) {
    if (!usuario || !contrasena) {
      this.errorMessage = 'Todos los campos son obligatorios.';
      this.showAlertError = true;
      this.showAlertSuccess = false;
      return;
    }

    const credentials = {
      email: usuario,
      password: contrasena
    };

    const apiUrl = 'http://localhost:8000/api/login';

    this.http.post<any>(apiUrl, credentials).subscribe({
      next: (response) => {
        console.log('Inicio de sesión exitoso:', response);
        localStorage.setItem('access_token', response.access_token);
        localStorage.setItem('user_data', JSON.stringify(response.user_data));
        this.showAlertSuccess = true;
        this.showAlertError = false;
        // Redirigir después de un breve tiempo para mostrar el mensaje de éxito
        setTimeout(() => {
          this.router.navigate(['/busqueda']);
        }, 1500);
      },
      error: (error) => {
        console.error('Error en el inicio de sesión:', error);
        this.showAlertSuccess = false;
        if (error.error && error.error.message === 'Deactivated account') {
          this.errorMessage = 'Cuenta desactivada. Por favor, contacte con el administrador.';
        } else if (error.error && error.error.errors) {
          this.errorMessage = Object.values(error.error.errors).flat().join(' ');
        } else if (error.error && error.error === 'Incorrect credentials') {
          this.errorMessage = 'Credenciales incorrectas.';
        } else {
          this.errorMessage = 'Error al iniciar sesión. Por favor, inténtelo de nuevo.';
        }
        this.showAlertError = true;
      }
    });
  }
  irRegistro() {
    this.router.navigate(['/registro']);
  }
}

