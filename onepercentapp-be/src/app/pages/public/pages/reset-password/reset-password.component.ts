import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import {
  IonButton,
  IonContent,
  NavController,
  IonIcon,
  IonText,
} from '@ionic/angular/standalone';
import { TranslateModule } from '@ngx-translate/core';
import { AuthService } from 'src/app/services/auth/auth.service';
import { ToastService } from 'src/app/services/toast.service';
import { UtilsService } from 'src/app/services/utils.service';
import { CustomInputComponent } from '../../../../shared/components/custom-input/custom-input.component';
import { HeaderComponent } from 'src/app/shared/components/header/header.component';
import { passwordMatchValidator } from 'src/app/shared/validators/password-match.validator';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [
    IonText,
    IonIcon,
    CommonModule,
    ReactiveFormsModule,
    IonContent,
    IonButton,
    HeaderComponent,
    CustomInputComponent,
    TranslateModule,
  ],
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss'],
})
export class ResetPasswordComponent implements OnInit {
  // Inyección de servicios necesarios
  private readonly formBuilder = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly navCtrl = inject(NavController);
  private readonly toastService = inject(ToastService);
  private readonly route = inject(ActivatedRoute);
  readonly utilsService = inject(UtilsService);

  // Variables para el formulario y la vista
  resetPasswordForm!: FormGroup;
  showPassword: boolean = false;
  showConfirmPassword: boolean = false;
  resetToken: string = '';

  ngOnInit(): void {
    this.initializeForm();
    this.getTokenFromUrl();
  }

  /**
   * Obtiene el token de reseteo de la URL
   */
  private getTokenFromUrl(): void {
    this.route.queryParams.subscribe((queryParams) => {
      if (queryParams['token']) {
        this.resetToken = queryParams['token'];
        console.log('Token de reseteo obtenido:', this.resetToken);
      } else {
        this.toastService.presentToastDanger('No se encontró un token válido');
        this.navCtrl.navigateRoot('/public/login-with-email');
      }
    });
  }

  /**
   * Inicializa el formulario con validaciones
   */
  initializeForm(): void {
    this.resetPasswordForm = this.formBuilder.group(
      {
        password: new FormControl('', [
          Validators.required,
          Validators.minLength(8),
          Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/),
        ]),
        confirmPassword: new FormControl('', [Validators.required]),
      },
      {
        validators: passwordMatchValidator,
      }
    );
  }

  /**
   * Envía la solicitud para cambiar la contraseña
   */
  async resetPassword(): Promise<void> {
    if (this.resetPasswordForm.invalid) {
      this.resetPasswordForm.markAllAsTouched();
      return;
    }

    await this.utilsService.presentLoading();

    try {
      const { password } = this.resetPasswordForm.value;

      this.authService
        .confirmPasswordReset(this.resetToken, password)
        .subscribe({
          next: () => {
            this.utilsService.hiddenLoading();
            this.toastService.presentToastSuccess(
              'Contraseña actualizada con éxito'
            );
            this.navCtrl.navigateRoot('/public/login-with-email');
          },
          error: (error) => {
            this.utilsService.hiddenLoading();
            console.error('Error al restablecer la contraseña:', error);

            if (error.status === 400) {
              this.toastService.presentToastDanger(
                'El enlace ha expirado o no es válido'
              );
            } else {
              this.toastService.presentToastDanger(
                'Error al restablecer la contraseña'
              );
            }
          },
        });
    } catch (error) {
      this.utilsService.hiddenLoading();
      this.toastService.presentToastDanger('Ha ocurrido un error inesperado');
      console.error('Error en restablecimiento:', error);
    }
  }
}
