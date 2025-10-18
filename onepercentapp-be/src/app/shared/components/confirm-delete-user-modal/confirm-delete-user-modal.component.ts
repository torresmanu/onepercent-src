import { Component, inject, Input, OnInit } from '@angular/core';
import { IonContent, IonButton, IonSkeletonText, IonText, IonIcon } from "@ionic/angular/standalone";
import { ModalController } from '@ionic/angular/standalone';

@Component({
  standalone: true,
  imports: [IonContent,IonButton],
  selector: 'app-confirm-delete-user-modal',
  templateUrl: './confirm-delete-user-modal.component.html',
  styleUrls: ['./confirm-delete-user-modal.component.scss'],
})
export class ConfirmDeleteModalComponent  implements OnInit {
  
 modalController = inject( ModalController);

  @Input() title!: string;
  @Input() message!: string;
  @Input() confirmButtonText!: string;
  @Input() cancelButtonText !: string;

  ngOnInit() {

  }
  confirmDeletion() {
    this.modalController.dismiss({ confirmed: true }, 'confirm');
  }
  
  cancelDeletion() {
    this.modalController.dismiss({ confirmed: false }, 'cancel');
  }
}
