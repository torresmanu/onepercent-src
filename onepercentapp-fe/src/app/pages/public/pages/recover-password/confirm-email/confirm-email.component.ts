import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonButton, IonContent, NavController } from '@ionic/angular/standalone';
import { LogoComponent } from 'src/app/shared/components/logo/logo.component';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-confirm-email',
  standalone: true,
  imports: [
    CommonModule,
    IonContent,
    IonButton,
    LogoComponent,
    TranslateModule,
  ],
  templateUrl: './confirm-email.component.html',
  styleUrls: ['./confirm-email.component.scss'],
})
export class ConfirmEmailComponent {
 // Inyección de servicios necesarios
  private readonly navCtrl = inject(NavController);

  backToLogin() {
    this.navCtrl.navigateRoot('/public/login');
  }
}
