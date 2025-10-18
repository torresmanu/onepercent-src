import { Component, inject, Input } from '@angular/core';
import { IonicStorageModule } from '@ionic/storage-angular';
import { TranslateModule } from '@ngx-translate/core';
import { ModalService } from 'src/app/services/modal.service';
import { IonHeader, IonToolbar, IonButtons, IonBackButton, IonButton, IonIcon, IonTitle } from "@ionic/angular/standalone";
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-header',
  standalone: true,
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
  imports: [IonTitle, IonIcon, IonButton, IonBackButton, IonButtons, IonToolbar, IonHeader, IonicStorageModule, TranslateModule, CommonModule]
})
export class HeaderComponent { 
  @Input() title!: string;
  @Input() backButton!: string;
  @Input() backButtonBackwards!: string;

  @Input() isModal!: string;

  modalService= inject(ModalService);

  closeModal(){
    this.modalService.dismissModal();
  }

goBack(){
  window.history.back();
}
}
