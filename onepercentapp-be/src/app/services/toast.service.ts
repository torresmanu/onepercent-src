import { inject, Injectable } from '@angular/core';
import { ToastButton, ToastOptions, ToastController } from '@ionic/angular/standalone';

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  toastController = inject(ToastController);

  constructor() { }

  //----- TOAST -----//
  async presentToast(options: ToastOptions) {
  const mergedOptions: any = { ...options };
  // Si ya hay cssClass, añade la clase personalizada
  if (mergedOptions.cssClass) {
    mergedOptions.cssClass += ' multiline-toast';
  } else {
    mergedOptions.cssClass = 'multiline-toast';
  }
  
  const toast = await this.toastController.create(mergedOptions);
  await toast.present();
  }

  async presentToastWithButtons(
    message: string,
    position: 'top' | 'middle' | 'bottom' = 'bottom',
    color: 'primary' | 'secondary' | 'tertiary' | 'success' | 'warning' | 'danger' | 'light' = 'light',
    duration = 1500,
    buttons: ToastButton[] | undefined = undefined
  ) {
    const toast = await this.toastController.create({
      message: message,
      duration,
      position: position,
      color,
      buttons,
        cssClass: 'multiline-toast'
    });

    await toast.present();
  }

  /**
   * Muestra un toast de tipo "danger" (error)
   * 
   * @param message Mensaje a mostrar (o título si se proporciona el segundo parámetro)
   * @param subMessage Mensaje secundario opcional
   * @param duration Duración en milisegundos
   * @param position Posición del toast
   */
  presentToastDanger(
    message: string,
    subMessage?: string,
    duration: number = 3000,
    position: 'top' | 'middle' | 'bottom' = 'bottom'
  ) {
    const options: ToastOptions = { 
      message: subMessage ? `${message}\n${subMessage}` : message,
      duration, 
      position, 
      color: 'danger' 
    };
    this.presentToast(options);
  }

  /**
   * Muestra un toast de tipo "warning" (advertencia)
   * 
   * @param message Mensaje a mostrar (o título si se proporciona el segundo parámetro)
   * @param subMessage Mensaje secundario opcional
   * @param duration Duración en milisegundos
   * @param position Posición del toast
   */
  presentToastWarning(
    message: string,
    subMessage?: string,
    duration: number = 1500,
    position: 'top' | 'middle' | 'bottom' = 'bottom'
  ) {
    const options: ToastOptions = { 
      message: subMessage ? `${message}\n${subMessage}` : message,
      duration, 
      position, 
      color: 'warning' 
    };
    this.presentToast(options);
  }

  /**
   * Muestra un toast de tipo "info" (información)
   * 
   * @param message Mensaje a mostrar (o título si se proporciona el segundo parámetro)
   * @param subMessage Mensaje secundario opcional
   * @param duration Duración en milisegundos
   * @param position Posición del toast
   */
  presentToastInfo(
    message: string,
    subMessage?: string,
    duration: number = 1500,
    position: 'top' | 'middle' | 'bottom' = 'bottom'
  ) {
    const options: ToastOptions = { 
      message: subMessage ? `${message}\n${subMessage}` : message,
      duration, 
      position, 
      color: 'tertiary',
      cssClass: 'custom-toast-info',
    };
    this.presentToast(options);
  }

  /**
   * Muestra un toast de tipo "success" (éxito)
   * 
   * @param message Mensaje a mostrar (o título si se proporciona el segundo parámetro)
   * @param subMessage Mensaje secundario opcional
   * @param duration Duración en milisegundos
   * @param position Posición del toast
   */
  presentToastSuccess(
    message: string,
    subMessage?: string,
    duration: number = 1500,
    position: 'top' | 'middle' | 'bottom' = 'bottom'
  ) {
    const options: ToastOptions = { 
      message: subMessage ? `${message}\n${subMessage}` : message,
      duration, 
      position, 
      color: 'success' 
    };
    this.presentToast(options);
  }
}
