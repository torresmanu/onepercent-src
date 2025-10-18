import { inject, Injectable } from '@angular/core';
import { NavController } from '@ionic/angular/standalone';
import { SocialLoginPayload } from 'src/app/core/interfaces/social-login-payload.interface';
import { StorageKey } from 'src/app/core/interfaces/storage';

import {
  catchError,
  map,
  Observable,
  of,
  switchMap,
  tap,
  throwError,
  combineLatest,
} from 'rxjs';
import { StorageService } from './storage.service';
import { ApiCallService } from './api-call.service';
import { User } from '@capacitor-firebase/authentication';

/**
 * Auth Service
 */
@Injectable({
  providedIn: 'root',
})
export class ProfileService {
  private readonly basePath = '/profile';

  private readonly apiCallService = inject(ApiCallService);
  private readonly navCtrl = inject(NavController);
  private readonly storageService = inject(StorageService);

  constructor() {}
  updateUserData(updateUser: any): Observable<any> {
    return combineLatest([
      this.storageService.get<string>(StorageKey.accessToken),
      this.storageService.get<any>(StorageKey.userData),
    ]).pipe(
      switchMap(([token, userData]) => {
        return this.apiCallService
          .patch<any>(`/profile`, updateUser, token)
          .pipe(
            tap((response) => {
              console.log('Profile data updated:', response.data);
              this.storageService.set(StorageKey.userData, response.data); // <- actualiza el almacenamiento local
            })
          );
      }),
      catchError((error) => {
        console.error('Error updating profile data:', error);
        return throwError(() => error);
      })
    );
  }

  deleteUser(): Observable<any> {
    return this.storageService.get<string>(StorageKey.accessToken).pipe(
      switchMap((token) => {
        if (!token) {
          return throwError(() => new Error('Token is missing'));
        }

        return this.apiCallService
          .delete<any>(`${this.basePath}/delete`, token)
          .pipe(
            tap((response) => {
              console.log('Profile delete successfully:', response.data);
              this.storageService.set(StorageKey.userData, response.data);
            })
          );
      }),
      catchError((error) => {
        console.error('Error updating profile image:', error);
        return throwError(() => error);
      })
    );
  }

  updateimageProfile(formData: FormData): Observable<User> {
    return this.storageService.get<string>(StorageKey.accessToken).pipe(
      switchMap((token) => {
        if (!token) {
          return throwError(() => new Error('Token is missing'));
        }

        return this.apiCallService
          .post<any>(`${this.basePath}/updateProfileImage`, formData, token)
          .pipe(
            tap((response) => {
              console.log('Profile image updated successfully:', response.data);
              this.storageService.set(StorageKey.userData, response.data);
            })
          );
      }),
      catchError((error) => {
        console.error('Error updating profile image:', error);
        return throwError(() => error);
      })
    );
  }
}
