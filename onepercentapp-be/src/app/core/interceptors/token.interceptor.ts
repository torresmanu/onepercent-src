import { Injectable, inject } from '@angular/core';
import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable, throwError, from } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { AuthService } from 'src/app/services/auth/auth.service';
import { StorageService } from 'src/app/services/storage.service';
import { StorageKey } from 'src/app/core/interfaces/storage';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
  private readonly authService = inject(AuthService);
  private readonly storageService = inject(StorageService);

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    console.log('[TokenInterceptor] Intercepting request:', request.url);
    // Solo interceptar rutas privadas (que empiecen por /private o /api/private, ajusta según tu backend)
    const isPrivate = window.location.pathname.includes('/private/');


    if (!isPrivate) {
      console.log(
        '[TokenInterceptor] Ignorando ruta pública:',
        window.location.pathname
      );
      return next.handle(request);
    }
    

    return this.storageService.get<string>(StorageKey.accessToken).pipe(
      switchMap((token) => {
        let req = request;
        if (token) {
          console.log(
            '[TokenInterceptor] Token found, adding Authorization header'
          );
          req = request.clone({
            setHeaders: { Authorization: `Bearer ${token}` },
          });
        } else {
          console.log('[TokenInterceptor] No token found');
        }
        return next.handle(req).pipe(
          catchError((error: HttpErrorResponse) => {
            if (error.status === 401) {
              console.warn(
                '[TokenInterceptor] 401 error detected, attempting to refresh token'
              );
              // Intentar refrescar el token
              return this.authService.refreshToken().pipe(
                switchMap((newToken: string) => {
                  console.log('newToken', newToken);
                  // Guardar el nuevo access token en el storage
                  return this.storageService
                    .set(StorageKey.accessToken, newToken)
                    .pipe(
                      switchMap(() => {
                        console.log(
                          '[TokenInterceptor] Token refreshed, retrying request'
                        );
                        const retryReq = request.clone({
                          setHeaders: { Authorization: `Bearer ${newToken}` },
                        });
                        return next.handle(retryReq);
                      })
                    );
                }),
                catchError((err) => {
                  console.error('[TokenInterceptor] Token refresh failed', err);
                  // Si falla el refresh, propaga el error
                  return throwError(() => err);
                })
              );
            }
            console.error('[TokenInterceptor] Request failed', error);
            return throwError(() => error);
          })
        );
      })
    );
  }
}
