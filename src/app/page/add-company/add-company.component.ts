import { Component} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-add-company',
  imports: [RouterLink, FormsModule, CommonModule, ReactiveFormsModule],
  templateUrl: './add-company.component.html',
  styleUrl: './add-company.component.css'
})
export class AddCompanyComponent {
  registerForm: FormGroup;
  
    constructor(private fb: FormBuilder, private router: Router) {
      this.registerForm = this.fb.group({
        centerName: ['', Validators.required],
        firstname: ['', Validators.required],
        surname: ['', Validators.required],
        dni: ['', Validators.required],
        userEmail: ['', [Validators.required, Validators.email]],
        password: ['', Validators.required],
        password2: ['', Validators.required]
      }); // Añadimos el validador al FormGroup
    }
  
    get centerName() { return this.registerForm.get('centerName'); }
    get firstname() { return this.registerForm.get('firstname'); }
    get surname() { return this.registerForm.get('surname'); }
    get dni() { return this.registerForm.get('dni'); }
    get userEmail() { return this.registerForm.get('userEmail'); }
    
    
  
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
