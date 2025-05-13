import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  showCompanyForm = false;
  companyForm: FormGroup;
  companies: any[] = [];
  searchTerm = '';
  selectedCompany: any = null;

  constructor(
    private authService: AuthService,
    private fb: FormBuilder,
    private router: Router
  ) {
    this.companyForm = this.fb.group({
      name: ['', []],
      code: ['', []]
    });
  }

  ngOnInit() {
    this.companies = this.authService.getCompanies();
  }

  get isSuperAdmin() {
    return this.authService.isSuperAdmin();
  }

  toggleCompanyForm() {
    this.showCompanyForm = !this.showCompanyForm;
  }

  createCompany() {
    if (this.companyForm.valid) {
      const newCompany = this.companyForm.value;
      // En una app real, aquí harías una llamada HTTP
      this.companies.push(newCompany);
      this.companyForm.reset();
      this.showCompanyForm = false;
    }
  }

  selectCompany(company: any) {
    this.selectedCompany = company;
  }

  navigateToLogin() {
    if (this.selectedCompany) {
      this.router.navigate(['login'], { 
        queryParams: { company: this.selectedCompany.code } 
      });
    } else {
      this.router.navigate(['login']);
    }
  }

  get filteredCompanies() {
    return this.companies.filter(company => 
      company.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      company.code.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }
}

