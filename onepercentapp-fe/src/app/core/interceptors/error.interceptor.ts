import {
  HttpContextToken,
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, catchError, from, switchMap, throwError } from 'rxjs';
import { AuthService } from 'src/app/services/auth/auth.service';
import { UtilsService } from 'src/app/services/utils.service';
import { StorageService } from 'src/app/services/storage.service';
import { StorageKey } from 'src/app/core/interfaces/storage';
import { NavController } from '@ionic/angular/standalone';
import { ToastService } from 'src/app/services/toast.service';
import { NutritionService } from 'src/app/services/nutrition.service';

const URL_EXCEPTIONS = ["/quadrant/add-quadrant"];

export const SHOW_MSG = new HttpContextToken(() => true);

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  private readonly utilsService = inject(UtilsService);
  private readonly toastService = inject(ToastService);
  private readonly authService = inject(AuthService);
  private readonly storageService = inject(StorageService);
  private readonly navCtrl = inject(NavController);
  private readonly nutritionService = inject(NutritionService);

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    // Obtener el token desde StorageService
    return this.storageService.get<string>(StorageKey.accessToken).pipe(
      switchMap((token) => {
        if (token) {
          request = request.clone({
            setHeaders: {
              Authorization: `Bearer ${token}`,
            },
          });
        }

        return next.handle(request).pipe(
          catchError((error: HttpErrorResponse) => {
            if (error instanceof HttpErrorResponse) {
              const status = error.status;
              const url = new URL(request.url);

              // Manejo de errores 401
              if (status === 401 && request.url.includes('token')) {
                console.warn('Error 401: Unauthorized');
                return this.handle401Error();
              }

              // Excluir URLs específicas
              if (!URL_EXCEPTIONS.includes(url.pathname) && request.context.get(SHOW_MSG)) {
                const message = this.getMsg(status, error);
                this.toastService.presentToastDanger(message);
              }

              // Log detallado del error
              console.error('HTTP Error Interceptor:', {
                status: error.status,
                message: error.message,
                url: request.url,
                error: error.error,
              });

              return throwError(() => error);
            }

            return throwError(() => error);
          })
        );
      })
    );
  }

  /**
   * Manejar errores 401 (Unauthorized)
   */
  private handle401Error(): Observable<never> {
    // Clear user-specific data from NutritionService
    this.nutritionService.clearUserData();
    
    return this.storageService.clearUnlockedKeys().pipe(
      switchMap(() => {
        this.navCtrl.navigateRoot('/public/login'); // Redirigir al login
        return throwError(() => new Error('Unauthorized: Redirecting to login.'));
      })
    );
  }

  /**
   * Generar mensaje de error basado en el código de estado HTTP
   *
   * @param status - Código de estado HTTP
   * @param error - Respuesta de error HTTP
   * @returns Mensaje de error
   */
  private getMsg(status: number, error: HttpErrorResponse): string {
    const data: Record<number, string> = {
      500: 'Error interno en el servidor',
      400: error.error?.message || error.message,
      404: 'Recurso no encontrado.',
      403: 'No tiene los permisos necesarios para realizar esta acción.',
      409: error.error?.message || error.error?.detail,
      0: 'Servicio temporalmente no disponible, inténtelo más tarde',
    };
    return data[status] || error.message;
  }
}