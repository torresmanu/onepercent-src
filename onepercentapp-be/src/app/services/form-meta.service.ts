import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { HttpParams } from '@capacitor/core';
import { catchError, Observable, throwError } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { ApiCallService } from './api-call.service';

@Injectable({
  providedIn: 'root',
})
export class FormMetaService {
  private readonly basePath = environment.apiBaseUrl;

  http = inject(HttpClient);
  apiCallService = inject(ApiCallService);
  getFormMeta(formName: string): Observable<any> {
    const url = `/plan/getFormMeta`;
    return this.apiCallService.get<any>(url).pipe(
      map((response: any) => {
        return response.data[formName] || response.data;
      }),
      catchError((error) => {
        console.error('Error fetching form meta:', error);
        return throwError(() => new Error('Error fetching form meta'));
      })
    );
  }

  getProvinces(): Observable<any> {
    const url = `/province/findAll`;
    return this.apiCallService.get<any>(url).pipe(
      map((response: any) => {
        return response.data;
      }),
      catchError((error) => {
        console.error('Error fetching provinces:', error);
        return throwError(() => new Error('Error fetching provinces'));
      })
    );
  }
}
