import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  IonButton,
  IonContent,
  IonItem,
  IonLabel,
  IonList,
  IonToggle,
  NavController
} from '@ionic/angular/standalone';
import { TranslateModule } from '@ngx-translate/core';
import { PushNotificationService } from 'src/app/services/push-notification.service';
import { StorageService } from 'src/app/services/storage.service';
import { ToastService } from 'src/app/services/toast.service';
import { HeaderComponent } from 'src/app/shared/components/header/header.component';

@Component({
  selector: 'app-notifications',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonContent,
    IonList,
    IonItem,
    IonLabel,
    IonToggle,
    IonButton,
    HeaderComponent,
    TranslateModule,
  ],
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.scss']
})
export class NotificationsComponent implements OnInit {
  private pushNotificationService = inject(PushNotificationService);
  private toastService = inject(ToastService);
  private navCtrl = inject(NavController);
  
  // Estado actual guardado en el sistema
  currentPushEnabled = false;
  // Estado temporal modificado por el toggle
  pushEnabled = false;
  // Para saber si hay cambios pendientes
  hasChanges = false;

  ngOnInit() {
    this.loadNotificationSettings();
  }

  async loadNotificationSettings() {
    try {
      this.currentPushEnabled = await this.pushNotificationService.isPushEnabled();
      this.pushEnabled = this.currentPushEnabled;
    } catch (error) {
      console.error('Error al cargar configuración de notificaciones:', error);
      this.currentPushEnabled = false;
      this.pushEnabled = false;
    }
  }

  // Este método solo actualiza el estado temporal, no hace cambios reales
  togglePushNotifications(event: any) {
    this.pushEnabled = event.detail.checked;
    // Marcamos que hay cambios pendientes si el valor es diferente al actual
    this.hasChanges = this.pushEnabled !== this.currentPushEnabled;
  }

  // Método para guardar los cambios cuando se presiona el botón
  async saveChanges() {
    // Solo realizamos acciones si hay cambios pendientes
    if (!this.hasChanges) {
      this.toastService.presentToastInfo('No hay cambios para guardar');
      this.navCtrl.navigateBack('/private/profile');
      return;
    }

    try {
      let success = false;
      
      if (this.pushEnabled) {
        success = await this.pushNotificationService.enablePushNotifications();
      } else {
        success = await this.pushNotificationService.disablePushNotifications();
      }
      
      if (success) {
        // Actualizamos el estado actual
        this.currentPushEnabled = this.pushEnabled;
        this.hasChanges = false;
        
        this.toastService.presentToastSuccess('Configuración guardada correctamente');
      } else {
        throw new Error('No se pudo guardar la configuración');
      }
      this.navCtrl.navigateBack('/private/profile');
    } catch (error) {
      console.error('Error al guardar configuración de notificaciones:', error);
      // Revertimos el cambio en la UI
      this.pushEnabled = this.currentPushEnabled;
      this.hasChanges = false;
      this.toastService.presentToastDanger('Error al guardar la configuración');
      this.navCtrl.navigateBack('/private/profile');
    }
  }
} 
