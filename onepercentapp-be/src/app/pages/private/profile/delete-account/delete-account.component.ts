import { Component, inject, OnInit } from "@angular/core";
import { IonButton, IonContent, IonIcon, IonText,NavController } from "@ionic/angular/standalone";
import { AuthService } from "src/app/services/auth/auth.service";
import { ModalService } from "src/app/services/modal.service";
import { ConfirmDeleteModalComponent } from "src/app/shared/components/confirm-delete-user-modal/confirm-delete-user-modal.component";
import { HeaderComponent } from "../../../../shared/components/header/header.component";
import { NgIf } from "@angular/common";
import { TranslateModule } from "@ngx-translate/core";
import { deleteUser } from "firebase/auth";
import { ProfileService } from "src/app/services/profile.service";
import { ModalController } from '@ionic/angular/standalone';
import { FirebaseAuthenticationService } from "@src/app/services/auth/firebase-authentication.service";
import { StorageService } from "@src/app/services/storage.service";
import { StorageKey } from "@src/app/core/interfaces/storage";

@Component({

  imports: [IonIcon,
    NgIf, 
    IonText, 
    IonButton, 
    IonContent, 
    HeaderComponent, 
    TranslateModule],
standalone: true,
  selector: 'app-delete-account',
  templateUrl: './delete-account.component.html',
  styleUrls: ['./delete-account.component.scss'],
})
export class DeleteAccountComponent  implements OnInit {

  modalService = inject(ModalService);
  modalController = inject(ModalController);
  authService = inject(AuthService);
  navCtrl = inject(NavController);
  profileService = inject(ProfileService) // Asegúrate de que 'NavController' esté correctamente inyectado
  firebaseService = inject(FirebaseAuthenticationService);
  storageService = inject(StorageService);
  deleted= false;
  ngOnInit() {}



  
async deleteAccount() {
  try {
    // 1) Backend
    await this.authService.deleteAccount().toPromise();
    
    const token = await this.storageService.get(StorageKey.googleAccessToken).toPromise();
    const token2 = await this.storageService.get(StorageKey.metaAccessToken).toPromise();

    console.log('Google Token:', token);
    console.log('Meta Token:', token2);

    if (!token && !token2) {
      console.log('No social tokens found, skipping revocation.');
      return;
    }

    if (token){
      console.log('Google Token:', token);
      await this.firebaseService.revokeGoogleAccess(token as string | null | undefined);

    }
    if (token2){
    console.log('Meta Token:', token2);

      await this.firebaseService.revokeMetaAccess(token2 as string | null | undefined);
    }
    // 3) Firebase Auth
    await this.firebaseService.deleteFirebaseUserCompletely();

    // 4) Storage local
    this.navCtrl.navigateRoot('/public/login');
    await this.storageService.clearAll();

    // 5) Navegación
  } catch (e) {
    console.error(e);
  }
}


  goBack() {
    // Aquí puedes implementar la lógica para volver a la página anterior
    console.log('Volviendo a la página anterior...');
    // Redirigir a la página anterior o realizar otras acciones necesarias
  }
  
  
  async openModalDelete() {
  this.modalService.presentMediumModal(
    ConfirmDeleteModalComponent,
    {
      title: 'Vas a eliminar tu cuenta',
      message: '¿Deseas continuar? No podrás recuperar ninguno de tus datos una vez que se eliminen.',
      confirmButtonText: 'Eliminar cuenta',
      cancelButtonText: 'Cancelar',
    }
  ).then((result) => {
    if (result.role === 'confirm') {
      this.deleteAccount();
    }
  });



}
  goRoot() { 
    // Aquí puedes implementar la lógica para confirmar el cierre de sesión
     this.authService.logout();
    this.navCtrl.navigateRoot('/public/login');
  }
}
