import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { StorageService } from 'src/app/services/storage.service';
import { StorageKey } from '../interfaces/storage';
import { AuthService } from 'src/app/services/auth/auth.service';
import { catchError, map, of, switchMap } from 'rxjs';
import { NavController } from '@ionic/angular/standalone';

export const authGuard: CanActivateFn = (route, state) => {
  const navCtrl = inject(NavController);
  const storageService = inject(StorageService);
  const authService = inject(AuthService);

  return storageService.get<string>(StorageKey.accessToken).pipe(
    switchMap((accessToken) => {
      if (accessToken) {
        // Verifica si el token es válido
        return authService.checkTokenValidity().pipe(
          map((isValidToken) => {
            if (isValidToken) {
              // Si el token es válido y está intentando acceder a una ruta pública, redirige a las rutas privadas
              if (state.url.includes('public')) {
                navCtrl.navigateForward('/private');
                return false;
              }
              return true; // Permite el acceso a rutas privadas
            }

            // Si el token no es válido, redirige al login
            navCtrl.navigateForward('/public/login');
            return false;
          }),
          catchError((error) => {
            console.error('Error al verificar el token:', error);
            navCtrl.navigateForward('/public/login');
            return of(false);
          })
        );
      }

      // Si no hay token, redirige al login si intenta acceder a rutas privadas
      if (state.url.includes('private')) {
        navCtrl.navigateForward('/public/login');
        return of(false);
      }

      // Permite el acceso a rutas públicas si no hay token
      return of(true);
    }),
    catchError((error) => {
      console.error('Error al obtener el token del almacenamiento:', error);
      navCtrl.navigateForward('/public/login');
      return of(false);
    })
  );
};