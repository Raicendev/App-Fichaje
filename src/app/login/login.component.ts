import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../auth/auth.service';
import { SocialAuthCustomService } from '../auth/social-auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  errorMessage: string = '';
  selectedCompany: string | null = null;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthService,
    private socialAuthService: SocialAuthCustomService
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      company: ['']
    });
  }

  ngOnInit() {
    this.socialAuthService.initializeAuthState();
    this.route.queryParams.subscribe(params => {
      this.selectedCompany = params['company'] || null;
      if (this.selectedCompany) {
        this.loginForm.patchValue({
          company: this.selectedCompany
        });
      }
    });
  }

  loginWithGoogle() {
    this.socialAuthService.signInWithGoogle();
  }
  loginWithOutlook() {
    this.socialAuthService.signInWithOutlook();
  }


  onSubmit() {
    if (this.loginForm.valid) {
      const { email, password } = this.loginForm.value;
      this.authService.login(email, password); // ya maneja redirección y almacenamiento
    } else {
      this.errorMessage = 'Por favor completa todos los campos correctamente';
    }
  }
  
}