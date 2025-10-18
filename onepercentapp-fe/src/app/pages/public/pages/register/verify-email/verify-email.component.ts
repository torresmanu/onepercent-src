import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import {
  IonButton,
  IonContent,
  NavController,
  IonText,
} from '@ionic/angular/standalone';
import { TranslateModule } from '@ngx-translate/core';
import { AuthService } from 'src/app/services/auth/auth.service';
import { ToastService } from 'src/app/services/toast.service';
import { UtilsService } from 'src/app/services/utils.service';
import { HeaderComponent } from 'src/app/shared/components/header/header.component';
import { LogoComponent } from 'src/app/shared/components/logo/logo.component';

@Component({
  selector: 'app-verify-email',
  standalone: true,
  imports: [
    IonText,
    CommonModule,
    ReactiveFormsModule,
    IonContent,
    IonButton,
    HeaderComponent,
    LogoComponent,
    TranslateModule,
  ],
  templateUrl: './verify-email.component.html',
  styleUrls: ['./verify-email.component.scss'],
})
export class VerifyEmailComponent {
  // Inyección de servicios necesarios
  private readonly authService = inject(AuthService);
  readonly utilsService = inject(UtilsService);
  private readonly toastService = inject(ToastService);
  private readonly navCtrl = inject(NavController);



  public registerForm: any;
 public email: string = '';

ngOnInit() {
  const stored = localStorage.getItem('registerform');
  if (stored) {
    try {
      const parsed = JSON.parse(stored);
      this.email = parsed.email || '';
    } catch (e) {
      console.error('Error al parsear registerform:', e);
    }
  }
  this.register();
}

  /**
   * Envía la solicitud para recuperar contraseña
   */
  async register() {
    this.authService.register().subscribe({
      next: async (response) => {
        console.log('Registro exitoso:', response);
      },
      error: (error) => {

      },
      complete: () => {

      },
    });
  }
  next(){
         this.navCtrl.navigateRoot("/public/login");
  }
}
