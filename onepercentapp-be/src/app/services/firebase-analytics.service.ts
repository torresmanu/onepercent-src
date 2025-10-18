import { inject, Injectable } from "@angular/core";
import { FirebaseAnalytics } from "@capacitor-firebase/analytics";
import { Platform } from "@ionic/angular";
import { AppTrackingStatusResponse, AppTrackingTransparency } from "capacitor-plugin-app-tracking-transparency";
import { UtilsService } from "./utils.service";
import { lastValueFrom } from "rxjs";
import { StorageService } from "./storage.service";
import { StorageKey } from "../core/interfaces/storage";

@Injectable({
    providedIn: 'root',
})
export class FirebaseAnalyticsService {

    platform = inject(Platform);
    utilsService = inject(UtilsService);
    storageService = inject(StorageService);

    async logEvent(eventName: string, params?: any) {
        try {
            await FirebaseAnalytics.logEvent({
                name: eventName,
                params: params || {},
            });
            console.log(`📊 Evento registrado: ${eventName}`, {params});
        } catch (error) {
            console.error(`⚠️ Error al registrar evento ${eventName}`, error);
        }
    }

    async setUserId(userId: string) {
        try {
            await FirebaseAnalytics.setUserId({ userId });
            console.log(`👤 ID de usuario establecido: ${userId}`);
        } catch (error) {
            console.error('⚠️ Error al establecer ID de usuario', error);
        }
    }

    public async enable(): Promise<void> {
        await FirebaseAnalytics.setEnabled({ enabled: true });
    }

    public async disable(): Promise<void> {
        await FirebaseAnalytics.setEnabled({ enabled: true });
    }

    async requestTrackingPermissionIos(): Promise<void> {
        const response = await AppTrackingTransparency.requestPermission();
        if (response.status === 'authorized') {
          await this.enable();
          await lastValueFrom(this.storageService.set(StorageKey.analyticsConsent, true));
          console.log('Firebase Analytics habilitado por el usuario en iOS.');
        } else {
          await this.disable();
          await lastValueFrom(this.storageService.set(StorageKey.analyticsConsent, false));
          console.log('Firebase Analytics deshabilitado por el usuario en iOS.');
        }
      }

    async requestTrackingPermissionAndroid(): Promise<boolean> {
        return new Promise(async (resolve) => {
            this.utilsService.presentAlert({
                header: 'Consentimiento de Datos',
                message: 'Esta app usa datos de uso para mejorar la experiencia del usuario.',
                buttons: [
                    {
                        text: 'Cancelar',
                        role: 'cancel',
                        handler: async () => {
                            await this.disable();
                            await lastValueFrom(this.storageService.set(StorageKey.analyticsConsent, false));
                            console.log('Firebase Analytics deshabilitado por el usuario.');
                            resolve(false);
                        },
                    },
                    {
                        text: 'Continuar',
                        handler: async () => {
                            await this.enable();
                            await lastValueFrom(this.storageService.set(StorageKey.analyticsConsent, true)); 
                            console.log('Firebase Analytics habilitado por el usuario.');
                            resolve(true);
                        },
                    },
                ],
            });
        });
    }

    async getStatus(): Promise<AppTrackingStatusResponse> {
        const response = await AppTrackingTransparency.getStatus();
        console.log(response);

        return response;
    }

}