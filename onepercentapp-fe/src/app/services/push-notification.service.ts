import { Injectable, NgZone, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Capacitor } from '@capacitor/core';
import { PushNotifications, Token, PushNotificationSchema, ActionPerformed } from '@capacitor/push-notifications';
import { FirebaseMessaging, GetTokenOptions } from '@capacitor-firebase/messaging';
import { ToastService } from './toast.service';
import { StorageKey } from '../core/interfaces/storage';
import { StorageService } from './storage.service';
import { ApiCallService } from './api-call.service';
import { catchError, from, lastValueFrom, of } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PushNotificationService {
  private apiCallService = inject(ApiCallService);

  constructor(
    private router: Router,
    private zone: NgZone,
    private toastService: ToastService,
    private storageService: StorageService
  ) {}

  initPush() {
    if (Capacitor.getPlatform() !== 'web') {
      this.registerPush();
    }
  }

  // Método para activar notificaciones push
  async enablePushNotifications(): Promise<boolean> {
    try {
      // Guardar la preferencia de notificaciones activadas
      await lastValueFrom(this.storageService.set(StorageKey.pushEnabled, true));
      
      // Iniciar el registro de notificaciones
      if (Capacitor.getPlatform() !== 'web') {
        await this.registerPush();
      }
      
      return true;
    } catch (error) {
      console.error('Error al activar notificaciones push:', error);
      return false;
    }
  }

  // Método para desactivar notificaciones push
  async disablePushNotifications(): Promise<boolean> {
    try {
      // Eliminar el token del backend
      await this.removeFcmToken();
      
      // Guardar la preferencia de notificaciones desactivadas
      await lastValueFrom(this.storageService.set(StorageKey.pushEnabled, false));
      
      return true;
    } catch (error) {
      console.error('Error al desactivar notificaciones push:', error);
      return false;
    }
  }

  // Método para verificar el estado actual de las notificaciones
  async isPushEnabled(): Promise<boolean> {
    try {
      const status = await lastValueFrom(this.storageService.get<boolean>(StorageKey.pushEnabled));
      return status === true;
    } catch (error) {
      console.error('Error al verificar estado de notificaciones:', error);
      return false;
    }
  }

  private async registerPush() {
    try {
      console.log("Iniciando registro de notificaciones push...");
      
      // Verificar permisos
      let permStatus = await PushNotifications.checkPermissions();
      console.log("Estado de permiso inicial:", permStatus);
      
      if (permStatus.receive === 'prompt') {
        console.log("Solicitando permisos de notificaciones...");
        permStatus = await PushNotifications.requestPermissions();
        console.log("Resultado de solicitud de permisos:", permStatus);
      }
      
      if (permStatus.receive !== 'granted') {
        console.log('Push notification permission not granted');
        return;
      }
      
      console.log("Configurando listeners para eventos de notificaciones...");
      
      // Listeners para eventos de notificaciones
      PushNotifications.addListener('registration', (token: Token) => {
        console.log('Push registration success, token:', token.value);
        
        // Aquí puedes llamar a un método para intentar obtener el FCM token
        this.getFcmTokenAfterAPNS(token.value);
      });
      
      PushNotifications.addListener('registrationError', (error) => {
        console.error('Push registration error:', error);
      });
      
      PushNotifications.addListener('pushNotificationReceived', (notification: PushNotificationSchema) => {
        console.log('Push notification received:', notification);
        this.showToast(notification);
      });
      
      PushNotifications.addListener('pushNotificationActionPerformed', (action: ActionPerformed) => {
        console.log('Push notification action performed:', action);
        this.handleNotificationAction(action);
      });
      
      // Listener para mensajes en primer plano
      FirebaseMessaging.addListener('notificationReceived', (notification) => {
        console.log('FCM notification received:', notification);
        this.showToast({
          title: notification.notification.title,
          body: notification.notification.body,
          id: '',
          data: notification.notification.data
        });
      });
      
      FirebaseMessaging.addListener('notificationActionPerformed', (action) => {
        console.log('FCM notification action performed:', action);
        this.handleFirebaseNotificationAction(action);
      });
      
      // DESPUÉS de configurar los listeners, registramos las notificaciones
      try {
        console.log("Llamando a PushNotifications.register()...");
        await PushNotifications.register();
        console.log("Registro completado con éxito");
        
        // Si llegamos aquí sin errores, intentamos obtener el token directamente
        this.requestFCMToken();
        
      } catch (regError) {
        console.error("Error en registro de notificaciones:", regError);
        // En iOS, podemos continuar intentando obtener el token
        // ya que a veces el error puede ser no crítico
        
        // Intentar obtener el token a pesar del error
        setTimeout(() => {
          this.requestFCMToken();
        }, 2000);
      }
      
    } catch (error) {
      console.error('Error initializing push notifications:', error);
    }
  }

  // Método para solicitar directamente el token FCM
  async requestFCMToken() {
    try {
      console.log("Solicitando token FCM directamente...");
      
      const tokenOptions: GetTokenOptions = {
        vapidKey: environment.firebaseMessagingVapidKey
      };
      
      const fcmToken = await FirebaseMessaging.getToken(tokenOptions);
      console.log('===== TOKEN FCM PARA NOTIFICACIONES =====');
      console.log(fcmToken.token);
      console.log('==========================================');
      
      // Guardar token en storage
      await lastValueFrom(this.storageService.set(StorageKey.fcmToken, fcmToken.token));
      
      return fcmToken.token;
    } catch (error) {
      console.error("Error solicitando token FCM:", error);
      return null;
    }
  }

  // Método para intentar obtener FCM token después de APNS
  private async getFcmTokenAfterAPNS(apnsToken: string) {
    try {
      console.log("Obteniendo FCM token después de recibir APNS token...");
      
      // Esperar un momento para que APNS se registre completamente
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const tokenOptions: GetTokenOptions = {
        vapidKey: environment.firebaseMessagingVapidKey
      };
      
      const fcmToken = await FirebaseMessaging.getToken(tokenOptions);
      console.log('FCM Token obtenido web:', fcmToken.token);
      
      // Guardar token en storage
      await lastValueFrom(this.storageService.set(StorageKey.fcmToken, fcmToken.token));
      
      // Si tenemos información de usuario, actualizar en backend
      try {
        const userData: any = await lastValueFrom(this.storageService.get(StorageKey.userData));
        if (userData && userData.id) {
          this.updateTokenInBackend(userData.id);
        }
      } catch (userError) {
        console.log("No hay usuario activo para actualizar token");
      }
      
    } catch (error) {
      console.error("Error obteniendo FCM token:", error);
    }
  }
  
  private showToast(notification: PushNotificationSchema) {
    this.toastService.presentToastInfo(
      notification.title || 'Nueva notificación',
      notification.body || '',
      4000,
      'top'
    );
  }
  
  private handleNotificationAction(action: ActionPerformed) {
    const data = action.notification.data;
    if (data && data.url) {
      this.zone.run(() => {
        this.router.navigateByUrl(data.url);
      });
    }
  }
  
  private handleFirebaseNotificationAction(action: any) {
    const data = action.notification.data;
    if (data && data.url) {
      this.zone.run(() => {
        this.router.navigateByUrl(data.url);
      });
    }
  }
  
  /**
   * Actualiza el token FCM en el backend para el usuario especificado
   * 
   * @param userId - ID del usuario para asociar con el token FCM
   * @returns Una promesa que se resuelve cuando el token se ha actualizado
   */
  async updateTokenInBackend(userId: string): Promise<any> {
    try {
      // Convertir el observable a promesa con lastValueFrom
      const fcmToken = await lastValueFrom(this.storageService.get<string>(StorageKey.fcmToken));
      
      if (fcmToken) {
        console.log(`Actualizando token FCM: ${fcmToken.substring(0, 10)}... para usuario: ${userId}`);
        
        // Llamada al API utilizando ApiCallService (que devuelve observable)
        return lastValueFrom(
          this.apiCallService.post('/users/update-fcm-token', {
            userId,
            fcmToken,
            platform: Capacitor.getPlatform()
          }).pipe(
            catchError((error) => {
              console.error('Error al actualizar token FCM en el backend:', error);
              return of(null);
            })
          )
        );
      } else {
        console.warn('No se encontró token FCM para actualizar');
        return null;
      }
    } catch (error) {
      console.error('Error en updateTokenInBackend:', error);
      return null;
    }
  }
  
  /**
   * Elimina el token FCM del usuario en el backend
   * Util para procesos de logout
   */
  async removeFcmToken(): Promise<void> {
    try {
      const fcmToken = await lastValueFrom(this.storageService.get<string>(StorageKey.fcmToken));
      
      if (fcmToken) {
        // Llamada al endpoint para eliminar el token
        await lastValueFrom(
          this.apiCallService.post('/users/remove-fcm-token', {
            fcmToken,
            platform: Capacitor.getPlatform()
          }).pipe(
            catchError((error) => {
              console.error('Error al eliminar token FCM:', error);
              return of(null);
            })
          )
        );
      }
      
      // Eliminar el token del storage local
      await lastValueFrom(this.storageService.set(StorageKey.fcmToken, null));
      
    } catch (error) {
      console.error('Error al eliminar el token FCM:', error);
    }
  }
}