import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { HttpParams } from '@capacitor/core';
import { catchError, Observable, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ApiCallService {
  private readonly basePath = environment.apiBaseUrl;
  private readonly defaultHeaders = new HttpHeaders({
    'Content-Type': 'application/json',
  });

  http = inject(HttpClient);

  constructor() {}

  private handleError(error: any): Observable<never> {
    console.error('HTTP Error:', error);
    return throwError(() => error);
  }

  get<T>(path: string, params?: HttpParams, token?: string): Observable<T> {
    const headers = token 
      ? this.defaultHeaders.append('Authorization', `Bearer ${token}`)
      : this.defaultHeaders;
    
    return this.http
      .get<T>(`${this.basePath}${path}`, {
        headers,
        params,
      })
      .pipe(catchError(this.handleError));
  }

  post<T>(path: string, body: any, token?: string): Observable<T> {
    const isFormData = body instanceof FormData;

    let headers: HttpHeaders;
    if (token) {
      headers = isFormData
        ? new HttpHeaders({ Authorization: `Bearer ${token}` })
        : this.defaultHeaders.append('Authorization', `Bearer ${token}`);
    } else {
      headers = isFormData
        ? new HttpHeaders()
        : this.defaultHeaders;
    }

    return this.http
      .post<T>(`${this.basePath}${path}`, body, { headers })
      .pipe(catchError(this.handleError));
  }

  put<T>(path: string, body: any, token: string): Observable<T> {
    return this.http
      .put<T>(`${this.basePath}${path}`, body, {
        headers: this.defaultHeaders.append('Authorization', `Bearer ${token}`),
      })
      .pipe(catchError(this.handleError));
  }

  patch<T>(path: string, body: any, token: string): Observable<T> {
    return this.http
      .patch<T>(`${this.basePath}${path}`, body, {
        headers: this.defaultHeaders.append('Authorization', `Bearer ${token}`),
      })
      .pipe(catchError(this.handleError));
  }

  delete<T>(path: string, token: String): Observable<T> {
    return this.http
      .delete<T>(`${this.basePath}${path}`, {
        headers: this.defaultHeaders.append('Authorization', `Bearer ${token}`),
      })
      .pipe(catchError(this.handleError));
  }
}
