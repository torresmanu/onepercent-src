import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
  ValidationErrors,
} from '@angular/forms';
import {
  IonButton,
  IonContent,
  NavController,
} from '@ionic/angular/standalone';
import { firstValueFrom } from 'rxjs';
import { AuthService } from 'src/app/services/auth/auth.service';
import { ToastService } from 'src/app/services/toast.service';
import { UtilsService } from 'src/app/services/utils.service';
import { CustomInputComponent } from '../../../../../shared/components/custom-input/custom-input.component';
import { HeaderComponent } from 'src/app/shared/components/header/header.component';
import { LogoComponent } from 'src/app/shared/components/logo/logo.component';
import { TranslateModule } from '@ngx-translate/core';

// === Validador estricto de email ===
export function strictEmailValidator(control: AbstractControl): ValidationErrors | null {
  const value: string = (control.value || '').trim();
  if (!value) return null; // lo maneja Validators.required

  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  return regex.test(value) ? null : { strictEmail: true };
}

@Component({
  selector: 'app-email-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    IonContent,
    IonButton,
    HeaderComponent,
    CustomInputComponent,
    LogoComponent,
    TranslateModule,
  ],
  templateUrl: './email-form.component.html',
  styleUrls: ['./email-form.component.scss'],
})
export class EmailFormComponent implements OnInit {
  private readonly formBuilder = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly navCtrl = inject(NavController);
  private readonly toastService = inject(ToastService);
  readonly utilsService = inject(UtilsService);

  public isTaken: boolean = false;
  registerForm!: FormGroup;

  ngOnInit(): void {
    this.initializeForm();
  }

  /**
   * Inicializa el formulario con validaciones
   */
  initializeForm() {
    this.registerForm = this.formBuilder.group({
      // Reemplazamos Validators.email por strictEmailValidator
      email: new FormControl('', [Validators.required, strictEmailValidator]),
    });
  }

  /**
   * Envía la solicitud para recuperar contraseña
   */
  async next() {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    const { email } = this.registerForm.value;

    try {
      this.isTaken = await firstValueFrom(this.authService.isEmailTaken(email));

      if (this.isTaken === true) {
        this.registerForm.get('email')?.setErrors({ emailTaken: true });
        this.registerForm.get('email')?.markAsTouched();
        return;
      }

      // Leer y actualizar el objeto existente en localStorage
      const formRaw = localStorage.getItem('registerform');
      const form = formRaw ? JSON.parse(formRaw) : {};
      form.email = email;

      localStorage.setItem('registerform', JSON.stringify(form));
      console.log('registerform actualizado:', form);

      this.navCtrl.navigateForward('/public/password-form');
    } catch (error) {
      this.registerForm.get('email')?.setErrors({ serverError: true });
      this.registerForm.get('email')?.markAsTouched();
    }
  }
}