import { Injectable, NgZone } from '@angular/core';
import {
    FirebaseAuthentication,
    GetIdTokenOptions,
    SignInResult,
    User
} from '@capacitor-firebase/authentication';
import { Capacitor } from '@capacitor/core';
import { Platform } from '@ionic/angular/standalone';
import { Observable, ReplaySubject, lastValueFrom, take } from 'rxjs';
import { environment } from 'src/environments/environment';
import { initializeApp } from 'firebase/app';
import { deleteUser, FacebookAuthProvider, getAuth, GoogleAuthProvider, OAuthProvider, signInWithPopup, UserCredential } from 'firebase/auth';
import { StorageService } from '../storage.service';
import { StorageKey } from '@src/app/core/interfaces/storage';

@Injectable({
  providedIn: 'root',
})
export class FirebaseAuthenticationService {
  private currentUserSubject = new ReplaySubject<User | null>(1);
  private initialized = false;
  
  constructor(
    private readonly platform: Platform,
    private readonly ngZone: NgZone,
    private readonly storageService: StorageService
  ) {
    // No hagas nada más aquí en el constructor
  }
  
  // Método para inicializar explícitamente este servicio
  public async init(): Promise<void> {
    if (this.initialized) return;
    
    try {
      // Primero espera a que el almacenamiento esté listo
      // Esto no es necesario si initializeStorage ya se ha completado en AppComponent
      // pero es una capa extra de seguridad
      
      await FirebaseAuthentication.removeAllListeners();
      FirebaseAuthentication.addListener('authStateChange', (change) => {
        this.ngZone.run(() => {
          console.log('Auth state changed:', change.user ? 'User logged in' : 'No user');
          this.currentUserSubject.next(change.user);
        });
      });
      
      try {
        const result = await FirebaseAuthentication.getCurrentUser();
        console.log('Current user retrieved:', result.user ? 'User exists' : 'No user');
        this.currentUserSubject.next(result.user);
      } catch (err) {
        console.error('Error getting current user:', err);
        this.currentUserSubject.next(null);
      }
      
      await this.initialize();
      this.initialized = true;
    } catch (error) {
      console.error('Error initializing FirebaseAuthenticationService:', error);
      // No relanzar el error para evitar bloquear la inicialización
    }
  }

  public get currentUser$(): Observable<User | null> {
    return this.currentUserSubject.asObservable();
  }


  private async initialize(): Promise<void> {
    if (this.platform.is('capacitor')) {
      return;
    }
    /**
     * Only needed if the Firebase JavaScript SDK is used.
     *
     * Read more: https://github.com/robingenz/capacitor-firebase/blob/main/packages/authentication/docs/firebase-js-sdk.md
     */
    initializeApp(environment.firebase);
  }

  public async getRedirectResult(): Promise<SignInResult | undefined> {
    if (Capacitor.isNativePlatform()) {
      return undefined;
    }
    return FirebaseAuthentication.getRedirectResult();
  }

  

  public getCurrentUser(): Promise<User | null> {
    return lastValueFrom(this.currentUser$.pipe(take(1)));
  }

  public async getIdToken(options?: GetIdTokenOptions): Promise<string> {
    const result = await FirebaseAuthentication.getIdToken(options);
    return result.token;
  }

  public async setLanguageCode(languageCode: string): Promise<void> {
    await FirebaseAuthentication.setLanguageCode({ languageCode });
  }

  public async signInWithApple(): Promise<UserCredential | SignInResult> {
    try {
      if (Capacitor.isNativePlatform()) {
        const result = await FirebaseAuthentication.signInWithApple();
        return result;
      } else {
        // Web implementation
        const auth = getAuth();
        const provider = new OAuthProvider('apple.com');
        const result = await signInWithPopup(auth, provider);
        return result;
      }
    } catch (error) {
      console.error('FirebaseAuthenticationService: Error en signInWithApple:', error);
      throw error;
    }
  }

  public async signInWithFacebook(): Promise<UserCredential | SignInResult> {
    try {
      if (Capacitor.isNativePlatform()) {
        const result = await FirebaseAuthentication.signInWithFacebook();
        try {
          const token = result?.credential?.accessToken;
          console.log('Facebook access token:', token);
          if (token) {
            await this.storageService.set(StorageKey.metaAccessToken, token);
          }
        } catch {}
        return result;
      } else {
        // Web implementation
        const auth = getAuth();
        const provider = new FacebookAuthProvider();
        const result = await signInWithPopup(auth, provider);
        return result;
      }
    } catch (error) {
      console.error('FirebaseAuthenticationService: Error en signInWithFacebook:', error);
      throw error;
    }
  }

 public async signInWithGoogle(): Promise<UserCredential | SignInResult> {
  try {
    if (Capacitor.isNativePlatform()) {
      const result = await FirebaseAuthentication.signInWithGoogle();
      try {
        const token = result?.credential?.accessToken;
        if (token) {
          await this.storageService.set(StorageKey.googleAccessToken, token);
        }
      } catch {}
      return result;
    } else {
      // Web implementation
      const auth = getAuth();
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      return result;
    }
  } catch (error) {
    console.error('FirebaseAuthenticationService: Error en signInWithGoogle:', error);
    throw error;
  }
}

  public async signInWithTwitter(): Promise<SignInResult> {
    return await FirebaseAuthentication.signInWithTwitter();
  }

  public async signInWithEmailAndPassword(email: string, password: string): Promise<SignInResult> {
    return await FirebaseAuthentication.signInWithEmailAndPassword({ email, password });
  }

  public async CreateWithEmailAndPassword(email: string, password: string): Promise<SignInResult> {
    return await FirebaseAuthentication.createUserWithEmailAndPassword({ email, password });
  }

  public async resetPassword(email: string): Promise<void> {
    await FirebaseAuthentication.sendPasswordResetEmail({ email });
  }

  public async signOut(): Promise<void> {
    await FirebaseAuthentication.signOut();
  }

  public async useAppLanguage(): Promise<void> {
    await FirebaseAuthentication.useAppLanguage();
  }


async  deleteFirebaseUserCompletely() {
  try {

    await FirebaseAuthentication.deleteUser();
  } catch (e) {
    console.warn('deleteUser falló (puede requerir reauth):', e);
  } finally {
    await FirebaseAuthentication.signOut();
  }
}
async revokeGoogleAccess(token?: string | null) {
  if (!token) return;
  console.log('Revocando acceso de Google con token:', token);
  try {
  console.log('Revocando token de Google');

    const res = await fetch('https://oauth2.googleapis.com/revoke?token=' + token, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    });
    if (res) {
      console.warn('No se pudo revocar el token, status:', res.status);
    }
  } catch (e) {
    console.error('Error revocando token:', e);
  }
}

async revokeMetaAccess(token?: string | null) {
  if (!token) return;
  try {
    const res = await fetch(`https://graph.facebook.com/me/permissions?access_token=${token}`, {
      method: 'DELETE'
    });
    const data = await res.json();
    console.log('Facebook revoke result:', data);
  } catch (e) {
    console.error('Error revoking Facebook access:', e);
  }
}
}