import { Component} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

// Función de validación personalizada para verificar si las contraseñas coinciden
function passwordMatchValidator(group: FormGroup) {
  const password = group.get('password')?.value;
  const confirmPassword = group.get('password2')?.value;

  return password === confirmPassword ? null : { notSame: true };
}

@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule, RouterLink, FormsModule, CommonModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  registerForm: FormGroup;

  constructor(private fb: FormBuilder, private router: Router) {
    this.registerForm = this.fb.group({
      userName: ['', Validators.required],
      firstname: ['', Validators.required],
      surname: ['', Validators.required],
      dni: ['', Validators.required],
      userEmail: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      password2: ['', Validators.required]
    }, { validators: passwordMatchValidator }); // Añadimos el validador al FormGroup
  }

  get userName() { return this.registerForm.get('userName'); }
  get firstname() { return this.registerForm.get('firstname'); }
  get surname() { return this.registerForm.get('surname'); }
  get dni() { return this.registerForm.get('dni'); }
  get userEmail() { return this.registerForm.get('userEmail'); }
  get password() { return this.registerForm.get('password'); }
  get password2() { return this.registerForm.get('password2'); }

  registrarse() {
    if (this.registerForm.valid) {
      // Aquí puedes enviar los datos del formulario
      console.log('Formulario válido:', this.registerForm.value);
      // this.router.navigate(['/ruta-de-exito']);
    } else {
      // Marcar todos los controles como "touched" para que se muestren los errores
      this.markAllAsTouched();
    }
  }

  markAllAsTouched() {
    Object.keys(this.registerForm.controls).forEach(key => {
      this.registerForm.controls[key].markAsTouched();
    });
  }
}