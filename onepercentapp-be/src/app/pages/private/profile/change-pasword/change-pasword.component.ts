import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
  ValidatorFn,
  AbstractControl,
  ValidationErrors,
} from '@angular/forms';
import {
  IonButton,
  IonContent,
  NavController,
  IonText,
} from '@ionic/angular/standalone';
import { User } from 'src/app/core/interfaces/user';
import { AuthService } from 'src/app/services/auth/auth.service';
import { ToastService } from 'src/app/services/toast.service';
import { UtilsService } from 'src/app/services/utils.service';
import { HeaderComponent } from 'src/app/shared/components/header/header.component';
import { CustomInputComponent } from '../../../../shared/components/custom-input/custom-input.component';
import { TranslateModule } from '@ngx-translate/core';
import { FONT_SIZES } from 'src/app/core/constraints/contraints';


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
  standalone: true,
  imports: [
    IonText,
    IonButton,
    CommonModule,
    IonContent,
    HeaderComponent,
    CustomInputComponent,
    ReactiveFormsModule,
    TranslateModule,
  ],
  selector: 'app-change-pasword',
  templateUrl: './change-pasword.component.html',
  styleUrls: ['./change-pasword.component.scss'],
})
export class ChangePaswordComponent implements OnInit {
  public readonly utilsService = inject(UtilsService);
  private navController = inject(NavController);

  private readonly authService = inject(AuthService);
  private readonly toastService = inject(ToastService);
  private readonly fb = inject(FormBuilder);
  public FONT_SIZES = FONT_SIZES;
  public user: User | null = null;
  public form!: FormGroup;

  ngOnInit() {
    this.initializeForm();
  }

  // Validador personalizado para el control 'password'
  passwordMatchValidator: ValidatorFn = (group: AbstractControl) => {
    const newPassword = group.get('newPassword')?.value;
    const password = group.get('password')?.value;
    return newPassword === password ? null : { passwordMismatch: true };
  };

  initializeForm() {
    this.form = this.fb.group(
      {
        oldPassword: [
          '',
          [
            Validators.required,
            Validators.minLength(8),
            passwordComplexity,
          ],
        ],
        newPassword: [
          '',
          [
            Validators.required,
            Validators.minLength(8),
            passwordComplexity,
            this.passwordMatchValidator,
          ],
        ],
        password: [
          '',
          [
            Validators.required,
            Validators.minLength(8),
            passwordComplexity,
            this.passwordMatchValidator,
          ],
        ],
      },
      { validators: this.passwordMatchValidator }
    );
  }

  updatePassword() {
    console.log('form', this.form.value);

    this.authService.passwordUpdate(this.form.value).subscribe({
      next: (res) => {
        console.log('res', res);
        this.toastService.presentToastSuccess(
          'contraseña actualizada correctamente'
        );
        this.navController.navigateRoot('/public/login');
      },
      error: (error) => {
        console.error('Error updating password:', error);
        this.toastService.presentToastDanger(
          error.error?.message || 'Error al actualizar la contraseña'
        );
        if (error.status === 409) {
          this.form.get('oldPassword')?.setErrors({ invalidOldPassword: true });
          this.toastService.presentToastDanger(
            error.error?.message || 'La contraseña actual es incorrecta'
          );
        }
      },
    });
  }
  gotoResetPassPage() {
    console.log('Navigating to reset password page');
    this.navController.navigateRoot('/private/forgot-password', {
      queryParams: { fromPage: 'changePassword' },
    });
  }
}
