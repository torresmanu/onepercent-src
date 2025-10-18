/**
 * Libraries
 */
import { Observable, defer, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import axios from 'axios';


export class RestService {
    
  headers = {};
  apiUrl = ''

  constructor(headers: any, apiUrl: string) {
    this.headers = headers;
    this.apiUrl = apiUrl;
  }

  public setHeaders(headers: any) {
    this.headers = headers;
  }
  public setApiUrl(apiUrl: string) {
    this.apiUrl = apiUrl;
  }
  
  private handleError = (error: any): any => { 
    return throwError(() => error);
  }  

  get = (endpoint: string, options: any): Observable<any> => defer( () => axios.get(this.apiUrl + endpoint, { params: options, headers: this.headers }))
  .pipe(
    map(result => result.data),
    catchError(this.handleError)
  );

  patch = (endpoint: string, data: any, options: any): Observable<any> => defer( () => axios.patch(this.apiUrl + endpoint, data, { params: options, headers: this.headers }))
  .pipe(
    map(result => result.data),
    catchError(this.handleError)
  );

  post = (endpoint: string, data: any, options: any): Observable<any> => defer( () => axios.post(this.apiUrl + endpoint, data, { params: options, headers: this.headers }))
  .pipe(
    map(result => result.data),
    catchError(this.handleError)
  );

  put = (endpoint: string, data: any, options: any): Observable<any> => defer( () => axios.put(this.apiUrl + endpoint, data, { params: options, headers: this.headers }))
  .pipe(
    map(result => result.data),
    catchError(this.handleError)
  );

  delete = (endpoint: string, data: any): Observable<any> => defer( () => axios.delete(this.apiUrl + endpoint, { headers: this.headers }))
  .pipe(
    map(result => result.data),
    catchError(this.handleError)
  );

  // eslint-disable-next-line max-len
  postFile = (endpoint: string, data: any, options: any): Observable<any> => defer( () => axios.post(this.apiUrl + endpoint, data, { params: options, headers: this.headers }))
    .pipe(
      map(result => result.data),
      catchError(this.handleError)
    );
  
  patchWithFile = (endpoint: string, data: any, options: any): Observable<any> => defer( () => axios.patch(this.apiUrl + endpoint, data, { params: options, headers: this.headers }))
    .pipe(
      map(result => result.data),
      catchError(this.handleError)
    );
  

}