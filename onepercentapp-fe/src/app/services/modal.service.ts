import { inject, Injectable } from '@angular/core';
import { ModalController } from '@ionic/angular/standalone';

@Injectable({
  providedIn: 'root'
})
export class ModalService {


  modalController = inject(ModalController);

  constructor() { }

  async presentModal(component: any, componentProps: any = {}, breakpoints: number[] = [0, 0.5, 0.8, 1], initialBreakpoint: number = 0.5, cssClass: string = 'custom-modal') {
    const modal = await this.modalController.create({
      component,
      componentProps,
      breakpoints,
      initialBreakpoint,
      cssClass
    });

    await modal.present();
    return modal.onDidDismiss();
  }

  async presentSmallModal(component: any, componentProps: any = {}) {
    return this.presentModal(component, componentProps, [0, 0.3, 0.5], 0.3);
  }

  async presentMediumModal(component: any, componentProps: any = {}) {
    return this.presentModal(component, componentProps, [0, 0.5, 0.7], 0.5);
  }

  async presentFullScreenModal(component: any, componentProps: any = {}) {
    const modal = await this.modalController.create({
      component,
      componentProps,
      cssClass: 'fullscreen-modal',
      showBackdrop: true,
      backdropDismiss: true,
    });
    await modal.present();
    return modal.onDidDismiss();
  }

  async dismissModal(data: any = null) {
    await this.modalController.dismiss(data);
  }
async presentAutoHeightModal(component: any, componentProps: any = {}) {
  const modal = await this.modalController.create({
    component,
    componentProps,
    cssClass: 'auto-height-modal'

  });
  await modal.present();
  return modal.onDidDismiss();
}
}
