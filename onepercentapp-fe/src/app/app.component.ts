import { Component, inject, NgZone, OnInit } from '@angular/core';
import { App, URLOpenListenerEvent } from '@capacitor/app';
import { IonApp, IonRouterOutlet, Platform } from '@ionic/angular/standalone';
import { lastValueFrom } from 'rxjs';
import { StorageKey } from './core/interfaces/storage';
import { FirebaseAnalyticsService } from './services/firebase-analytics.service';
import { StorageService } from './services/storage.service';
import { TranslationService } from './services/translation.service';
import { Router } from '@angular/router';
import { PushNotificationService } from './services/push-notification.service';
import { register } from 'swiper/element/bundle';
import { FirebaseAuthenticationService } from './services/auth/firebase-authentication.service';
import { Capacitor } from '@capacitor/core';
import { Keyboard } from '@capacitor/keyboard';
import { EdgeToEdge } from '@capawesome/capacitor-android-edge-to-edge-support';
import { StatusBar, Style } from '@capacitor/status-bar';

register();
@Component({
  selector: 'app-root',
  standalone: true,
  styleUrls: ['app.component.scss'],
  templateUrl: 'app.component.html',
  imports: [IonApp, IonRouterOutlet],
})
export class AppComponent implements OnInit {
  translationService = inject(TranslationService);
  analyticsService = inject(FirebaseAnalyticsService);
  storageService = inject(StorageService);
  platform = inject(Platform);
  zone = inject(NgZone);
  router = inject(Router);
  pushNotificationService = inject(PushNotificationService);
  private readonly firebaseAuthService = inject(FirebaseAuthenticationService);

  constructor() {
    if (Capacitor.getPlatform() === 'ios') {
      document.documentElement.classList.add('font-large');
    }
  }

  async ngOnInit() {
    await this.initializeApp();
    // getDeepLink se moverá dentro de initializeApp para evitar duplicar
  }

  async initializeApp(): Promise<void> {
    try {
      await this.platform.ready();
      console.log('Platform ready.');

      // Inicializa el almacenamiento
      await this.initializeStorage();
      console.log('Almacenamiento inicializado correctamente.');

      // Inicializaciones críticas
      this.setupLanguage();

      // Inicializar el servicio de autenticación, pero no bloquear con await
      this.firebaseAuthService
        .init()
        .catch((err) =>
          console.error('Error en firebase auth init (no bloqueante):', err)
        );

      // Inicializaciones secundarias
      this.initializeAnalytics().catch((err) =>
        console.error('Analytics init failed:', err)
      );
      this.pushNotificationService.initPush();
      this.getDeepLink();

      // Configurar el resize del teclado
      if (this.platform.is('capacitor')) {
        Keyboard.addListener('keyboardWillShow', (info) => {
          console.log('keyboard listener show:', info.keyboardHeight);
          document.documentElement.classList.add('keyboard-open');
        });
        Keyboard.addListener('keyboardDidHide', () => {
          console.log('keyboard listener hide');
          document.documentElement.classList.remove('keyboard-open');
        });
      }

      console.log('Aplicación inicializada correctamente.');
    } catch (error) {
      console.error('Error durante la inicialización de la aplicación:', error);
    }

    // Configuración EdgeToEdge para Android
    if (this.platform.is('android')) {
      await EdgeToEdge.enable();
      await StatusBar.setOverlaysWebView({ overlay: true });
      await StatusBar.show();
    }
  }

  setupLanguage(): void {
    this.translationService.init();
  }

  async initializeStorage(): Promise<void> {
    try {
      await lastValueFrom(this.storageService.initStorageSettings());
      console.log('Configuración de almacenamiento inicializada.');
    } catch (error) {
      console.error('Error al inicializar el almacenamiento:', error);
      throw error;
    }
  }

  async initializeAnalytics(): Promise<void> {
    try {
      const consentGiven = await lastValueFrom(
        this.storageService.get<boolean>(StorageKey.analyticsConsent)
      );

      if (consentGiven === true) {
        await this.analyticsService.enable();
        console.log('Firebase Analytics habilitado automáticamente.');
      } else if (consentGiven === false) {
        await this.analyticsService.disable();
        console.log('Firebase Analytics deshabilitado automáticamente.');
      } else {
        if (this.platform.is('ios')) {
          await this.analyticsService.requestTrackingPermissionIos();
        } else if (this.platform.is('android')) {
          const consent =
            await this.analyticsService.requestTrackingPermissionAndroid();
          await lastValueFrom(
            this.storageService.set(StorageKey.analyticsConsent, consent)
          );
        }
      }

      console.log('Firebase Analytics inicializado/configurado.');
    } catch (error) {
      console.error('Error al inicializar Firebase Analytics:', error);
      // No relanzamos el error para que no bloquee la inicialización
    }
  }

  getDeepLink() {
    App.addListener('appUrlOpen', (event: URLOpenListenerEvent) => {
      this.zone.run(() => {
        try {
          console.log('Evento de deep link recibido:', event);
          const urlString = event.url;

          console.log('Deep link recibido:', urlString);

          // Simplificación para el caso específico de reset-password
          // onepercentapp://reset-password?token=TOKEN
          if (urlString.startsWith('onepercentapp://reset-password')) {
            console.log('Detectado enlace de reset-password');

            // Extraer token directamente con regex
            const tokenMatch = urlString.match(/[?&]token=([^&]+)/);

            if (tokenMatch && tokenMatch[1]) {
              const token = tokenMatch[1];
              console.log('Token extraído exitosamente:', token);

              // Navegar a la página de reset con el token como query param
              this.router.navigate(['/public/reset-password'], {
                queryParams: { token },
              });
              return;
            } else {
              console.warn(
                'No se pudo extraer el token con regex de:',
                urlString
              );
            }
          }

          // Para URLs de web (mantener por compatibilidad)
          if (urlString.includes('/reset-password/')) {
            console.log('Detectado enlace web de reset-password');

            // Extraer token del path para el formato: https://domain.com/reset-password/TOKEN
            const segments = urlString.split('/reset-password/');
            if (segments.length > 1 && segments[1]) {
              const token = segments[1].split(/[?#]/)[0]; // Eliminar cualquier query o fragment
              console.log('Token extraído de URL web:', token);

              this.router.navigate(['/public/reset-password'], {
                queryParams: { token },
              });
              return;
            }
          }

          console.warn('No se pudo procesar la URL de deep link:', urlString);
        } catch (error) {
          console.error('Error procesando deep link:', error);
        }
      });
    });
  }
}
