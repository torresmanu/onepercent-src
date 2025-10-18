import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import {
  IonButton,
  IonContent,
  NavController,
} from '@ionic/angular/standalone';
import { AuthService } from 'src/app/services/auth/auth.service';
import { ToastService } from 'src/app/services/toast.service';
import { UtilsService } from 'src/app/services/utils.service';
import { LogoComponent } from 'src/app/shared/components/logo/logo.component';
import { HeaderComponent } from 'src/app/shared/components/header/header.component';
import { CustomInputComponent } from '../../../../../shared/components/custom-input/custom-input.component';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { StorageKey } from 'src/app/core/interfaces/storage';
import { StorageService } from 'src/app/services/storage.service';



export function passwordComplexity(control: AbstractControl): ValidationErrors | null {
  const v = (control.value || '') as string;
  if (!v) return null;
  const errors: any = {};
  if (!/[A-Z]/.test(v)) errors.noUppercase = true;
  if (!/[a-z]/.test(v)) errors.noLowercase = true;
  if (!/\d/.test(v))    errors.noDigit = true;
  return Object.keys(errors).length ? errors : null;
}

@Component({
  selector: 'app-login-with-email',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    IonContent,
    IonButton,
    LogoComponent,
    HeaderComponent,
    CustomInputComponent,
    TranslateModule,
  ],
  templateUrl: './login-with-email.component.html',
  styleUrls: ['./login-with-email.component.scss'],
})


export class LoginWithEmailComponent implements OnInit {
  // Inyección de servicios necesarios
  private readonly formBuilder = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly navCtrl = inject(NavController);
  private readonly toastService = inject(ToastService);
  private readonly storageService = inject(StorageService);

  readonly utilsService = inject(UtilsService);

  translate = inject(TranslateService);
  // Formulario de login
  loginForm!: FormGroup;

  ngOnInit(): void {
    this.initializeForm();
  }

  /**
   * Inicializa el formulario con sus validaciones
   */
  initializeForm() {
    this.loginForm = this.formBuilder.group({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [
        Validators.required,
        Validators.minLength(8),
        passwordComplexity,
      ]),
    });
  }

  /**
   * Maneja el proceso de inicio de sesión
   */
  async login() {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    await this.utilsService.presentLoading();

    try {
      const dataUser = this.loginForm.value as Credential;

      this.authService.login(dataUser).subscribe({
        next: (response) => {
          this.utilsService.hiddenLoading();
          this.storageService
            .get(StorageKey.termsAccepted)
            .subscribe((termsAccepted) => {
              if (termsAccepted) {
                this.navCtrl.navigateRoot('/private/home');
              } else {
                this.navCtrl.navigateForward('/private/confirmation-of-terms');
              }
            });
        },
        error: (error) => {
          this.utilsService.hiddenLoading();
          console.error('Error de inicio de sesión:', error);
          this.toastService.presentToastDanger(
            error.error?.message ||
              'Error en el inicio de sesión, por favor intente nuevamente.'
          );
          // Manejo de errores específicos
          if (error.status === 401) {
          } else {
          }
        },
      });
    } catch (error) {
      this.utilsService.hiddenLoading();
      console.error('Error en login:', error);
    }
  }

  /**
   * Navega a la pantalla de recuperación de contraseña
   */
  forgotPassword() {
    this.navCtrl.navigateForward('/public/forgot-password');
  }
}
