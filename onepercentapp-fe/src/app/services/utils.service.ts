import { inject, Injectable } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ValidationErrors } from '@angular/forms';
import {
  ActionSheetController,
  ActionSheetOptions,
  AlertController,
  AlertOptions,
  LoadingController,
  NavController,
  ToastController,
} from '@ionic/angular/standalone';
import { TranslateService } from '@ngx-translate/core';




@Injectable({
  providedIn: 'root',
})



export class UtilsService {
  loading!: HTMLIonLoadingElement;

  toastController = inject(ToastController);
  loadingController = inject(LoadingController);
  private readonly navCtrl = inject(NavController);
  actionSheetController = inject(ActionSheetController);
  alertController = inject(AlertController);
  private readonly translate = inject(TranslateService);

  constructor() {}

  //----- LOADING -----//
  async presentLoading() {
    this.loading = await this.loadingController.create({
      spinner: 'bubbles',
    });
    await this.loading.present();
  }

  hiddenLoading() {
    if (this.loading) {
      try {
        this.loading.dismiss();
      } catch (error) {
        console.error('Error al ocultar el loading:', error);
      }
    } else {
      console.warn('No hay un loading activo para ocultar.');
    }
  }

  //----- ACTION SHEET -----//

  async actionsheet(options: ActionSheetOptions) {
    const actionSheet = await this.actionSheetController.create(options);
    actionSheet.present();
  }

  //----- ALERTS -----//

  async presentAlert(options: AlertOptions) {
    const alert = await this.alertController.create(options);
    await alert.present();
  }

  getFormControl(formControl: FormGroup, name: string): FormControl {
    return formControl.get(name) as FormControl;
  }

  /**
   * Determina si un campo del formulario tiene error
   */
  getFormError(
    formControl: FormGroup | AbstractControl,
    controlName?: string
  ): boolean {
    let control: AbstractControl | null;

    if (formControl instanceof FormGroup && controlName) {
      control = formControl.get(controlName);
    } else if (!(formControl instanceof FormGroup)) {
      // Si se proporciona directamente un control
      control = formControl;
    } else {
      // Si es FormGroup pero no hay controlName
      return false;
    }
    return !!(control && control.invalid && (control.dirty || control.touched));
  }

  /**
   * Obtiene el mensaje de error para un campo específico
   */
  
  getErrorMessage(
  formControl: FormGroup | AbstractControl,
  controlName?: string,
  controlType?: string
): string {
  let control: AbstractControl | null;

  if (formControl instanceof FormGroup && controlName) {
    control = formControl.get(controlName);
  } else if (!(formControl instanceof FormGroup)) {
    control = formControl;
  } else {
    return '';
  }
  if (!control || !control.errors) return '';

  const name = (controlName || '').toLowerCase();
  const isPasswordCtrl =
    controlType === 'password' || name.includes('password');
  const isConfirmCtrl = name.includes('confirm');

  // --- Comunes ---
  if (control.errors['required']) {
    return this.translate.instant('ERRORS.REQUIRED');
  }

  // Email (básico + estricto si lo usas)
  if (control.errors['email']) {
    return this.translate.instant('ERRORS.EMAIL');
  }
  if (control.errors['strictEmail']) {
    return this.translate.instant('ERRORS.STRICT_EMAIL');
  }
  if (control.errors['emailTaken']) {
    return this.translate.instant('ERRORS.EMAIL_TAKEN');
  }

  // --- Longitud ---
  if (control.errors['minlength']) {
    const requiredLength = control.errors['minlength'].requiredLength;
    if (isPasswordCtrl) {
      return this.translate.instant('ERRORS.MINLENGTH_PASSWORD', { requiredLength });
    }
    return this.translate.instant('ERRORS.MINLENGTH', { requiredLength });
  }
  if (control.errors['maxlength']) {
    const requiredLength = control.errors['maxlength'].requiredLength;
    return this.translate.instant('ERRORS.MAXLENGTH', { requiredLength });
  }

  // --- Reglas de contraseña (prioridad antes que mismatch) ---
  if (isPasswordCtrl) {
    if (control.errors['noUppercase']) {
      return this.translate.instant('ERRORS.PASSWORD_UPPERCASE');
    }
    if (control.errors['noLowercase']) {
      return this.translate.instant('ERRORS.PASSWORD_LOWERCASE');
    }
    if (control.errors['noDigit']) {
      return this.translate.instant('ERRORS.PASSWORD_DIGIT');
    }
  }

  // --- Pattern (genérico / password / teléfono) ---
  if (control.errors['pattern']) {
    if (
      controlType === 'phone' ||
      name.includes('phone') ||
      name.includes('telefono')
    ) {
      return this.translate.instant('ERRORS.PATTERN_PHONE');
    }
    if (isPasswordCtrl) {
      return this.translate.instant('ERRORS.PASSWORD_PATTERN');
    }
    return this.translate.instant('ERRORS.PATTERN');
  }

  // --- Rango numérico / fechas ---
  if (control.errors['min']) {
    return this.translate.instant('ERRORS.MIN');
  }
  if (control.errors['max']) {
    return this.translate.instant('ERRORS.MAX');
  }

  // --- Custom genérico ---
  if (control.errors['custom']) {
    return this.translate.instant('ERRORS.CUSTOM', {
      custom: control.errors['custom'],
    });
  }

  // --- Igualdad / mismatch ---
  // Importante: mostrar mismatch SOLO en el campo de confirmación
  if (isConfirmCtrl && control.errors['passwordMismatch']) {
    return this.translate.instant('ERRORS.PASSWORDS_NOT_MATCH');
  }
  if (control.errors['mustMatch']) {
    return this.translate.instant('ERRORS.MUST_MATCH');
  }

  // Fallback
  return this.translate.instant('ERRORS.INVALID');
}
}
