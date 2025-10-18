import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Capacitor } from '@capacitor/core';
import { NavController } from '@ionic/angular/standalone';
import {
  catchError,
  combineLatest,
  map,
  Observable,
  of,
  switchMap,
  tap,
  throwError,
} from 'rxjs';
import { SocialLoginPayload } from 'src/app/core/interfaces/social-login-payload.interface';
import { StorageKey } from 'src/app/core/interfaces/storage';
import { ApiCallService } from '../api-call.service';
import { PushNotificationService } from '../push-notification.service';
import { StorageService } from '../storage.service';
import { FirebaseAuthenticationService } from './firebase-authentication.service';
/**
 * Auth Service
 */
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly basePath = '/auth';

  private readonly apiCallService = inject(ApiCallService);
  private readonly navCtrl = inject(NavController);
  private readonly storageService = inject(StorageService);
  private readonly firebaseAuthService = inject(FirebaseAuthenticationService);
  private readonly pushNotificationService = inject(PushNotificationService);
  private readonly http = inject(HttpClient);

  constructor() {}
  private platform = String(Capacitor.getPlatform());
  /**
   * Check if the access token exists
   */
  hasAccessToken(): Observable<boolean> {
    return this.storageService.get<string>(StorageKey.accessToken).pipe(
      map((token) => token !== null),
      catchError(() => of(false))
    );
  }

  /**
   * Login
   *
   * @param dataLogin - User credentials
   */

  login(dataLogin: Credential): Observable<boolean> {
    return this.apiCallService.post(`${this.basePath}/login`, dataLogin).pipe(
      switchMap((response: any) => {
        console.log('Respuesta de login:', response);
        const token = response.data.token;
        const user = response.data.user;
        const refreshToken = user.refreshToken;
        return this.storageService.set(StorageKey.accessToken, token).pipe(
          switchMap(() => this.storageService.set(StorageKey.userData, user)),
          switchMap(() =>
            this.storageService.set(StorageKey.refreshToken, refreshToken)
          ),
          // Después de guardar los datos del usuario, actualiza el token FCM
          tap(() => {
            if (user && user.id) {
              // Actualizar el token FCM en el backend
              this.pushNotificationService.updateTokenInBackend(user.id);
            }
          }),
          map(() => true)
        );
      }),
      catchError((error) => {
        console.error('Error en login:', JSON.stringify(error.message));
        return throwError(() => error);
      })
    );
  }

  /**
   * Recover password
   *
   * @param email - User email
   */
  recoverPassword(email: string): Observable<any> {
    return this.apiCallService
      .post(`${this.basePath}/resetPasswordEmail`, {
        email,
        platform: this.platform,
        appScheme: 'onepercentapp',
      })
      .pipe(
        catchError((error) => {
          console.error('Error en AuthService.recoverPassword:', error);
          return throwError(() => error);
        })
      );
  }

  /**
   * Logout
   */
  logout(): Observable<void> {
    this.storageService.set(StorageKey.accessToken, null).subscribe({
      next: async () => {
        await this.firebaseAuthService.signOut();
        await this.storageService.clearUnlockedKeys();
      },
      error: (err) => console.error('Error al establecer token:', err),
    });

    return of(undefined);
  }

  /**
   * Check token validity
   *
   * @returns an observable determining if the token is still valid
   */
  checkTokenValidity(): Observable<boolean> {
    return this.storageService.get<string>(StorageKey.accessToken).pipe(
      map((accessToken) => {
        if (!accessToken) {
          return false;
        }
        const accessTokenExpiration = this.decodeToken(accessToken).exp * 1000;
        const nowTimeStamp = Date.now();
        return nowTimeStamp < accessTokenExpiration;
      }),
      catchError(() => of(false))
    );
  }

  private decodeToken(token: any) {
    const decodedToken = (tokenToParse: any) => {
      try {
        return JSON.parse(atob(tokenToParse));
      } catch {
        return;
      }
    };
    return token
      .split('.')
      .map((mappedToken: any) => decodedToken(mappedToken))
      .reduce((acc: any, curr: any) => {
        if (!!curr) acc = { ...acc, ...curr };
        return acc;
      }, Object.create(null));
  }

  /**
   * Google Login
   *
   * @param data - Social login payload
   */
  googleLogin(data: SocialLoginPayload): Observable<boolean> {
    return this.apiCallService.post(`${this.basePath}/googleLogin`, data).pipe(
      switchMap((response: any) => {
        console.log('Resultado de googleLogin:', response, { response });
        const token = response.data.token;
        const user = response.data.user;
        const refreshToken = user.refreshToken;
        return this.storageService.set(StorageKey.accessToken, token).pipe(
          switchMap(() => this.storageService.set(StorageKey.userData, user)),
          switchMap(() =>
            this.storageService.set(StorageKey.refreshToken, refreshToken)
          ),
          // Después de guardar los datos del usuario, actualiza el token FCM
          tap(() => {
            if (user && user.id) {
              // Actualizar el token FCM en el backend
              this.pushNotificationService.updateTokenInBackend(user.id);
            }
          }),
          map(() => true)
        );
      }),
      catchError((error) => {
        console.error('Error en login:', JSON.stringify(error.message));
        return throwError(() => error);
      })
    );
  }

  /**
   * Apple Login
   *
   * @param data - Social login payload
   */
  appleLogin(data: SocialLoginPayload): Observable<boolean> {
    return this.apiCallService.post(`${this.basePath}/appleLogin`, data).pipe(
      switchMap((response: any) => {
        console.log('Respuesta de login:', response);
        const token = response.data.token;
        const user = response.data.user;
        const refreshToken = user.refreshToken;
        return this.storageService.set(StorageKey.accessToken, token).pipe(
          switchMap(() => this.storageService.set(StorageKey.userData, user)),
          switchMap(() =>
            this.storageService.set(StorageKey.refreshToken, refreshToken)
          ),
          // Después de guardar los datos del usuario, actualiza el token FCM
          tap(() => {
            if (user && user.id) {
              // Actualizar el token FCM en el backend
              this.pushNotificationService.updateTokenInBackend(user.id);
            }
          }),
          map(() => true)
        );
      }),
      catchError((error) => {
        console.error('Error en login:', JSON.stringify(error.message));
        return throwError(() => error);
      })
    );
  }

  /**
   * Facebook Login
   *
   * @param data - Social login payload
   */
  metaLogin(data: SocialLoginPayload): Observable<boolean> {
    return this.apiCallService.post(`${this.basePath}/metaLogin`, data).pipe(
      switchMap((response: any) => {
        console.log('Resultado de metaLogin:', response.toString());
        const token = response.data.token;
        const user = response.data.user;
        const refreshToken = user.refreshToken;
        return this.storageService.set(StorageKey.accessToken, token).pipe(
          switchMap(() => this.storageService.set(StorageKey.userData, user)),
          switchMap(() =>
            this.storageService.set(StorageKey.refreshToken, refreshToken)
          ),
          // Después de guardar los datos del usuario, actualiza el token FCM
          tap(() => {
            if (user && user.id) {
              // Actualizar el token FCM en el backend
              this.pushNotificationService.updateTokenInBackend(user.id);
            }
          }),
          map(() => true)
        );
      }),
      catchError((error) => {
        console.error('Error en login:', JSON.stringify(error.message));
        return throwError(() => error);
      })
    );
  }

  /**
   * Register
   *
   * @param formData - Registration data
   */
  register(): Observable<any> {
    const formDataRaw = localStorage.getItem('registerform');
    const formData = formDataRaw ? JSON.parse(formDataRaw) : {};

    return this.apiCallService.post(`${this.basePath}/register`, formData).pipe(
      map((result: any) => {
        localStorage.removeItem('registerform'); 
        // Limpiar el localStorage después del registro exitoso
        // Aquí podrías mostrar un mensaje o manejar la respuesta si es necesario
        return result;
      }),
      catchError((error) => {
        console.error('Error en registro:', error);
        return throwError(() => error);
      })
    );
  }

  /**
   * Confirma el restablecimiento de contraseña con el token recibido
   * @param token Token de restablecimiento
   * @param newPassword Nueva contraseña
   * @returns Observable con la respuesta del servidor
   */
  confirmPasswordReset(token: string, newPassword: string): Observable<any> {
    return this.apiCallService
      .post(`${this.basePath}/setNewPassword`, {
        token,
        password: newPassword,
      })
      .pipe(
        map((result: any) => {
          return result;
        }),
        catchError((error) => {
          console.error(
            'Error al confirmar restablecimiento de contraseña:',
            error
          );
          return throwError(() => error);
        })
      );
  }

  passwordUpdate(formData: FormData): Observable<any> {
    return this.storageService.get<string>(StorageKey.accessToken).pipe(
      switchMap((token) => {
        if (!token) {
          return throwError(
            () => new Error('Faltan datos del usuario o token')
          );
        }

        return this.apiCallService
          .post(`${this.basePath}/setNewOldPassword`, formData, token)
          .pipe(
            map((result: any) => {
              return result;
            }),
            catchError((error) => {
              console.error(
                'Error al confirmar restablecimiento de contraseña:',
                error
              );
              return throwError(() => error);
            })
          );
      })
    );
  }

  deleteAccount(): Observable<any> {
    return combineLatest([
      this.storageService.get<string>(StorageKey.accessToken),
      this.storageService.get<any>(StorageKey.userData),
    ]).pipe(
      switchMap(([token, userData]) => {
        if (!token || !userData?.id) {
          return throwError(
            () => new Error('Faltan datos del usuario o token')
          );
        }
        return this.apiCallService.delete(`/user/${userData.id}`, token);
      }),
      catchError((error) => {
        console.error('Error al eliminar cuenta:', error);
        return throwError(() => error);
      })
    );
  }

  /**
   * Check if the email is already taken
   *
   * @param email - Email to check
   */
  isEmailTaken(email: string): Observable<boolean> {
    console.log('Enviando a backend:', { email });

    return this.apiCallService
      .post(`${this.basePath}/emailExists`, { email })
      .pipe(
        map((response: any) => {
          console.log('Respuesta del backend:', response);
          return response.data;
        }),
        catchError((err) => {
          console.error('Error al verificar email:', err);
          return of(false);
        })
      );
  }

  refreshToken(): Observable<string> {
    console.log('Refreshing token...');
    return this.storageService.get<string>(StorageKey.refreshToken).pipe(
      switchMap((refreshToken) => {
        if (!refreshToken) {
          this.navCtrl.navigateRoot('/login');
          return throwError(() => new Error('No refresh token available'));
        }
        return this.apiCallService
          .post(`${this.basePath}/refreshToken`, { refreshToken })
          .pipe(
            map((response: any) => response.data.access_token),
            catchError((err) => {
              this.logout();
              this.navCtrl.navigateRoot('/login');
              return throwError(() => err);
            })
          );
      })
    );
  }
}
