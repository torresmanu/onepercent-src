import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import {
  IonAvatar,
  IonButton,
  IonContent,
  IonIcon,
  NavController,
} from '@ionic/angular/standalone';
import { StorageKey } from 'src/app/core/interfaces/storage';
import { User } from 'src/app/core/interfaces/user';
import { AuthService } from 'src/app/services/auth/auth.service';
import { ProfileService } from 'src/app/services/profile.service';
import { StorageService } from 'src/app/services/storage.service';
import { ToastService } from 'src/app/services/toast.service';
import { UtilsService } from 'src/app/services/utils.service';
import { HeaderComponent } from 'src/app/shared/components/header/header.component';
import { environment } from 'src/environments/environment';
import { CustomInputComponent } from '../../../../shared/components/custom-input/custom-input.component';
import { first } from 'rxjs';

@Component({
  selector: 'app-edit-profile',
  standalone: true,
  imports: [
    IonIcon,
    IonAvatar,
    IonButton,
    CommonModule,
    IonContent,
    HeaderComponent,
    CustomInputComponent,
    ReactiveFormsModule,
  ],
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.scss'],
})
export class EditProfileComponent implements OnInit {
  private navCtrl = inject(NavController);
  private storageService = inject(StorageService);
  private authService = inject(AuthService);
  private navController = inject(NavController);
  readonly utilsService = inject(UtilsService);
  private readonly toastService = inject(ToastService);
  private profileService = inject(ProfileService);
  private fb = inject(FormBuilder);
  public environment = environment;

  user: User | null = null;

  form!: FormGroup;

  ngOnInit() {
    this.loadUserData();

    this.initializeForm();
    console.log('environment', this.environment);
  }

  initializeForm() {
    this.form = this.fb.group({
      firstname: ['', Validators.required],
      email: [
        { value: '', disabled: true },
        [Validators.required, Validators.email],
      ],
    });
  }

  loadUserData() {
    this.storageService.get<User>(StorageKey.userData).subscribe({
      next: (userData) => {
        this.user = userData;
        console.log('userData', userData);
        if (userData) {
          this.form.patchValue({
            firstname: userData.firstname || '',
            email: userData.email || '',
          });
        }
      },
      error: (error) => {
        console.error('Error al cargar datos del usuario:', error);
      },
    });
  }
  getUserFullName(): string {
    if (!this.user) return 'Jon Doe';

    if (this.user.firstname && this.user.lastname) {
      return `${this.user.firstname} ${this.user.lastname}`;
    } else if (this.user.firstname) {
      return this.user.firstname;
    } else {
      return 'Jon Doe';
    }
  }

  hasProLicense(): boolean {
    if (!this.user?.userLicenses) return false;

    return this.user.userLicenses.some(
      (license) =>
        license.active && license.license.title.toLowerCase().includes('pro')
    );
  }

  async updateUser() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    await this.utilsService.presentLoading();

    try {
      const dataUser = this.form.getRawValue(); // <-- Cambiado aquí

      console.log('Form Value:', dataUser);

      this.profileService.updateUserData(dataUser).subscribe({
        next: async (response) => {
          this.utilsService.hiddenLoading();
          await this.toastService.presentToastSuccess(
            'Datos actualizados correctamente'
          );
          this.loadUserData(); // Recargar datos del usuario
        },
        error: (error) => {
          this.utilsService.hiddenLoading();
          console.error('Error de updateUser:', error);

          if (error.status === 401) {
            this.toastService.presentToastDanger(
              'Correo o contraseña incorrectos'
            );
          } else {
            this.toastService.presentToastDanger(
              'Error al iniciar sesión. Inténtalo de nuevo.'
            );
          }
        },
      });
    } catch (error) {
      this.utilsService.hiddenLoading();
      this.toastService.presentToastDanger('Ha ocurrido un error inesperado');
      console.error('Error en login:', error);
    }
  }
  async changeimageProfile() {
    try {
      const image = await Camera.getPhoto({
        quality: 90,
        allowEditing: true,
        resultType: CameraResultType.Base64,
        source: CameraSource.Prompt,
        webUseInput: true,
      });

      if (!image.base64String || !image.format) {
        this.toastService.presentToastDanger('No se pudo obtener la imagen.');
        return;
      }

      const contentType = `image/${image.format}`;
      const byteCharacters = atob(image.base64String);
      const byteArrays = [];

      for (let offset = 0; offset < byteCharacters.length; offset += 512) {
        const slice = byteCharacters.slice(offset, offset + 512);
        const byteNumbers = new Array(slice.length);
        for (let i = 0; i < slice.length; i++) {
          byteNumbers[i] = slice.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        byteArrays.push(byteArray);
      }

      const blob = new Blob(byteArrays, { type: contentType });
      const file = new File([blob], `profile.${image.format}`, {
        type: contentType,
      });

      const formData = new FormData();
      formData.append('imageProfile', file); // ← este nombre debe coincidir exactamente con el del backend

      await this.utilsService.presentLoading();

      this.profileService.updateimageProfile(formData).subscribe({
        next: async (data) => {
          this.utilsService.hiddenLoading();
          await this.toastService.presentToastSuccess(
            'Imagen de perfil actualizada correctamente'
          );
          this.ngOnInit(); // Recargar datos del usuario para reflejar el cambio
        },
        error: (error) => {
          this.utilsService.hiddenLoading();
          console.error('Error al actualizar la imagen de perfil:', error);
          if (error.status === 401) {
            this.toastService.presentToastDanger(
              'Sesión caducada. Inicia sesión de nuevo.'
            );
          } else {
            this.toastService.presentToastDanger(
              'Error al subir la imagen. Intenta nuevamente.'
            );
          }
        },
      });
    } catch (error) {
      console.error('Error al obtener la imagen:', error);
      this.toastService.presentToastDanger('No se pudo cargar la imagen.');
    }
  }
}
