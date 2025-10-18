import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  IonButton,
  IonContent,
  NavController,
} from '@ionic/angular/standalone';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/services/auth/auth.service';
import { ToastService } from 'src/app/services/toast.service';
import { UtilsService } from 'src/app/services/utils.service';
import { CustomInputComponent } from '../../../../shared/components/custom-input/custom-input.component';
import { HeaderComponent } from 'src/app/shared/components/header/header.component';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-recover-password',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    IonContent,
    IonButton,
    HeaderComponent,
    CustomInputComponent,
    TranslateModule,
  ],
  templateUrl: './recover-password.component.html',
  styleUrls: ['./recover-password.component.scss'],
})
export class RecoverPasswordComponent implements OnInit {
  // Inyección de servicios necesarios
  private readonly formBuilder = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly navCtrl = inject(NavController);
  private readonly toastService = inject(ToastService);
  private readonly route = inject(ActivatedRoute);
  readonly utilsService = inject(UtilsService);

  // Formulario para recuperar contraseña
  forgotPasswordForm!: FormGroup;

  // Ruta de regreso dinámica
  backButtonRoute: string = '/public/login-with-email';

  ngOnInit(): void {
    this.initializeForm();
    this.setBackButtonRoute();
  }

  /**
   * Establece la ruta de regreso según el parámetro fromPage
   */
  setBackButtonRoute(): void {
    const fromPage = this.route.snapshot.queryParams['fromPage'];
    if (fromPage === 'changePassword') {
      this.backButtonRoute = '/private/profile/changePassword';
    } else {
      this.backButtonRoute = '/public/login-with-email';
    }
  }

  /**
   * Inicializa el formulario con validaciones
   */
  initializeForm() {
    this.forgotPasswordForm = this.formBuilder.group({
      email: new FormControl('', [Validators.required, Validators.email]),
    });
  }

  /**
   * Envía la solicitud para recuperar contraseña
   */
  async sendResetEmail() {
    if (this.forgotPasswordForm.invalid) {
      this.forgotPasswordForm.markAllAsTouched();
      return;
    }

    await this.utilsService.presentLoading();

    const { email } = this.forgotPasswordForm.value;

    this.authService.recoverPassword(email).subscribe({
      next: () => {
        this.utilsService.hiddenLoading();
        this.navCtrl.navigateForward('/public/email-sent');
      },
      error: (error) => {
        this.utilsService.hiddenLoading();
        console.error(
          'Error al enviar correo de recuperación:',
          JSON.stringify(error)
        );

        if (
          error.status === 401 &&
          error.error?.message === 'Usuario no encontrado'
        ) {
          this.toastService.presentToastDanger(
            'No existe ninguna cuenta con este correo electrónico'
          );
        } else {
          this.toastService.presentToastDanger(
            'Error al enviar el correo de recuperación'
          );
        }
      },
    });
  }
}
