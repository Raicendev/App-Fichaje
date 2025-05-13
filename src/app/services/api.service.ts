import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiURL = 'http://localhost:8000/api';
  constructor(
    private http: HttpClient
  ) { }

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('access_token');
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': token ? `Bearer ${token}` : ''
    });
  }

  private handleError(error: HttpErrorResponse){
    console.error('Error en la llamada API:', error);
    return throwError(() => new Error('Algo salió mal; por favor intentalo de nuevo más tarde.'));
  }

  get (endpoint: string): Observable<any> {
    return this.http.get(`${this.apiURL}/${endpoint}`, { headers: this.getHeaders() })
      .pipe(catchError(this.handleError));
  }

  put (endpoint: string, data: any): Observable<any> {
    return this.http.put(`${this.apiURL}/${endpoint}`, data, { headers: this.getHeaders() })
      .pipe(catchError(this.handleError));
  }

  post(endpoint: string, data: any): Observable<any> {
    return this.http.post(`${this.apiURL}/${endpoint}`, data, { headers: this.getHeaders() })
      .pipe(catchError(this.handleError));
  }
  
  delete(endpoint: string): Observable<any> {
    return this.http.delete(`${this.apiURL}/${endpoint}`, { headers: this.getHeaders() })
      .pipe(catchError(this.handleError));
  }
}
