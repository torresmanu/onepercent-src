import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
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
  IonIcon,
  IonText,
} from '@ionic/angular/standalone';
import { UtilsService } from 'src/app/services/utils.service';
import { CustomInputComponent } from '../../../../../shared/components/custom-input/custom-input.component';
import { HeaderComponent } from 'src/app/shared/components/header/header.component';
import { LogoComponent } from 'src/app/shared/components/logo/logo.component';
import { TranslateModule } from '@ngx-translate/core';

export function passwordComplexity(control: AbstractControl): ValidationErrors | null {
  const v = (control.value || '') as string;
  if (!v) return null; // required lo maneja otro validador
  const errors: any = {};
  if (!/[A-Z]/.test(v)) errors.noUppercase = true;
  if (!/[a-z]/.test(v)) errors.noLowercase = true;
  if (!/\d/.test(v))    errors.noDigit = true;
  return Object.keys(errors).length ? errors : null;
}

@Component({
  selector: 'app-password-form',
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
    LogoComponent,
    TranslateModule,
  ],
  templateUrl: './password-form.component.html',
  styleUrls: ['./password-form.component.scss'],
})

export class PasswordFormComponent implements OnInit {
  // Inyección de servicios necesarios
  private readonly formBuilder = inject(FormBuilder);
  private readonly navCtrl = inject(NavController);
  readonly utilsService = inject(UtilsService);

  // Variables para mostrar/ocultar contraseña
  isPasswordVisible = false;

  // Formulario para recuperar contraseña
  registerForm!: FormGroup;

  ngOnInit(): void {
    this.initializeForm();
  }

  /**
   * Inicializa el formulario con validaciones
   */
  initializeForm() {
    this.registerForm = this.formBuilder.group({
      password: new FormControl('', [
    Validators.required,
    Validators.minLength(8),
    passwordComplexity, 
      ]),
    });
  }
  togglePasswordVisibility() {
    this.isPasswordVisible = !this.isPasswordVisible;
  }

  /**
   * Envía la solicitud para recuperar contraseña
   */
  async next() {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    const passwordValue = this.registerForm.value.password?.trim() || '';

    // Leer el objeto actual de localStorage
    const formRaw = localStorage.getItem('registerform');
    const form = formRaw ? JSON.parse(formRaw) : {};

    // Actualizar el campo password
    form.password = passwordValue;

    // Guardar el objeto actualizado
    localStorage.setItem('registerform', JSON.stringify(form));
    console.log('registerform actualizado:', form);

    this.navCtrl.navigateForward('/public/verify-email');
  }
}
