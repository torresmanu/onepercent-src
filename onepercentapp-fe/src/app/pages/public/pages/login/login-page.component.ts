import { Component, inject, NgZone } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SignInResult } from '@capacitor-firebase/authentication';
import { NavController, Platform } from '@ionic/angular/standalone';
import { IonButton, IonContent, IonIcon } from '@ionic/angular/standalone';
import { UserCredential } from 'firebase/auth';
import { SignInProvider } from 'src/app/core/enums/singInProvider.enum';
import { ResponseAppleSignIn } from 'src/app/core/interfaces/response-apple-signin.interface';
import { SocialLoginPayload } from 'src/app/core/interfaces/social-login-payload.interface';
import { AuthService } from 'src/app/services/auth/auth.service';
import { FirebaseAuthenticationService } from 'src/app/services/auth/firebase-authentication.service';
import { FirebaseAnalyticsService } from 'src/app/services/firebase-analytics.service';
import { ToastService } from 'src/app/services/toast.service';
import { UtilsService } from 'src/app/services/utils.service';
import { LogoComponent } from 'src/app/shared/components/logo/logo.component';
import { HeaderComponent } from '../../../../shared/components/header/header.component';
import { Capacitor } from '@capacitor/core';
import { CommonModule } from '@angular/common';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { StorageService } from 'src/app/services/storage.service';
import { StorageKey } from 'src/app/core/interfaces/storage';

@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.scss'],
  imports: [
    CommonModule,
    IonButton,
    IonContent,
    IonIcon,
    LogoComponent,
    HeaderComponent,
    TranslateModule,
  ],
})
export class LoginPageComponent {
  private readonly analyticsService = inject(FirebaseAnalyticsService);
  private readonly authService = inject(AuthService);
  private readonly navCtrl = inject(NavController);
  private readonly formBuilder = inject(FormBuilder);
  private readonly toastService = inject(ToastService);
  private readonly utilsService = inject(UtilsService);
  private readonly firebaseAuthService = inject(FirebaseAuthenticationService);
  private readonly platform = inject(Platform);
  private readonly storageService = inject(StorageService);


  loginForm!: FormGroup;
  providers = SignInProvider;
  isIOS: boolean = false;

  ngOnInit() {
    this.initializeForm();
    this.isIOS = this.platform.is('ios');
  }

  /**
   * Navigate to registration page
   */
  goToRegister(): void {
    this.navCtrl.navigateForward('/public/register');
  }

  /**
   * Navigate to login with email page
   */
  goToLoginWithEmail(): void {
    this.navCtrl.navigateForward('/public/login-with-email');
  }

  initializeForm() {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  logEvent() {
    this.analyticsService
      .logEvent('test_event', { value: 'Probando Analytics' })
      .then(() => console.log('Evento enviado con éxito'))
      .catch((err) => console.error('Error enviando evento', err));
  }

  async signInWith(provider: SignInProvider): Promise<void> {
    await this.utilsService.presentLoading();
    let resp;

    try {
      const result: any = await this.authenticateWithProvider(provider);

      if (!result) {
        throw new Error('No se pudo obtener el resultado de autenticación');
      }
      const sendData = await this.mapUserToPayload(provider, result);

      if (provider === SignInProvider.apple) {
        this.authService.appleLogin(sendData).subscribe({
         

          next: (resp) =>  this.storageService.get(StorageKey.termsAccepted).subscribe((termsAccepted) => {
            if (termsAccepted) {
              this.navCtrl.navigateRoot('/private/home');
            } else {
              this.navCtrl.navigateRoot('/private/confirmation-of-terms');

            }
          }),
          
          error: (error) => {
            console.error('Error  appleLogin:', error);
            this.toastService.presentToastDanger('Errol en login con apple.');
          },
        });
      } else if (provider === SignInProvider.google) {
        this.authService.googleLogin(sendData).subscribe({
          next: (resp) =>  this.storageService.get(StorageKey.termsAccepted).subscribe((termsAccepted) => {
            if (termsAccepted) {
              this.navCtrl.navigateRoot('/private/home');
            } else {
              this.navCtrl.navigateRoot('/private/confirmation-of-terms');

            }
          }),
          error: (error) => {
            console.error('Error  googleLogin:', error);
            this.toastService.presentToastDanger('Errol en google con apple.');
          },
        });
      } else if (provider === SignInProvider.facebook) {
        this.authService.metaLogin(sendData).subscribe({
          next: (resp) => this.storageService.get(StorageKey.termsAccepted).subscribe((termsAccepted) => {
            if (termsAccepted) {
              this.navCtrl.navigateRoot('/private/home');
            } else {
              this.navCtrl.navigateRoot('/private/confirmation-of-terms');
            }
          }),
          error: (error) => {
            console.error('Error  metaLogin:', error);

            // Verificar si el error es por cuenta existente con diferente proveedor
            if (
              error.error?.message?.includes('already exists') ||
              error.error?.message?.includes(
                'account-exists-with-different-credential'
              )
            ) {
              this.toastService.presentToastDanger(
                'Ya existe una cuenta con este email pero con otro proveedor. Prueba cerrando sesión de Facebook primero.'
              );
            } else {
              this.toastService.presentToastDanger(
                'Error en login con Facebook. ¿Quieres cambiar de cuenta?'
              );
            }
          },
        });
      }
    } catch (error: any) {
      console.error('Error  signInWith:', error);
      if (error.code === 'auth/account-exists-with-different-credential') {
        this.toastService.presentToastDanger(
          'Ya existe una cuenta con este email pero con otro proveedor.'
        );
        return;
      }
      this.toastService.presentToastDanger(
        'No se ha completado el inicio de sesión.'
      );
    } finally {
      this.utilsService.hiddenLoading();
    }
  }

  private async authenticateWithProvider(
    provider: SignInProvider
  ): Promise<unknown> {
    try {
      switch (provider) {
        case SignInProvider.apple:
          return await this.firebaseAuthService.signInWithApple();
        case SignInProvider.facebook:
          return this.firebaseAuthService.signInWithFacebook();
        case SignInProvider.google:
          return this.firebaseAuthService.signInWithGoogle();
        case SignInProvider.twitter:
          return this.firebaseAuthService.signInWithTwitter();
        default:
          throw new Error(
            `Proveedor de inicio de sesión no soportado: ${provider}`
          );
      }
    } catch (error) {
      console.error('Error en authenticateWithProvider:', error);
      throw error;
    }
  }

  // Método para mapear los datos del usuario
  private async mapUserToPayload(
    provider: SignInProvider,
    result: unknown
  ): Promise<SocialLoginPayload> {
    if (provider === SignInProvider.apple) {
      if (Capacitor.isNativePlatform()) {
        const nativeResult = result as ResponseAppleSignIn;
        return {
          displayName: nativeResult.user?.displayName || '',
          email: nativeResult.user?.email,
          idToken: nativeResult.credential.idToken,
          phoneNumber: nativeResult.user?.phoneNumber || '',
          imageProfile: nativeResult.user?.photoUrl || '',
        };
      } else {
        const webResult = result as UserCredential;
        return {
          displayName: webResult.user?.displayName || '',
          email: webResult.user?.email,
          idToken: await webResult.user.getIdToken(),
          phoneNumber: webResult.user?.phoneNumber || '',
          imageProfile: webResult.user?.photoURL || '',
        };
      }
    } else if (provider === SignInProvider.facebook) {
      const nativeResult = result as SignInResult;
      return {
        displayName: nativeResult.user?.displayName || '',
        email: nativeResult.user?.email,
        idToken: nativeResult.credential?.accessToken,
        phoneNumber: nativeResult.user?.phoneNumber || '',
        imageProfile: nativeResult.user?.photoUrl || '',
      };
    } else {
      const nativeResult = result as SignInResult;
      return {
        displayName: nativeResult.user?.displayName || '',
        email: nativeResult.user?.email,
        idToken: nativeResult.credential?.idToken,
        phoneNumber: nativeResult.user?.phoneNumber || '',
        imageProfile: nativeResult.user?.photoUrl || '',
      };
    }
  }

  login() {
    this.navCtrl.navigateForward('/public/login-with-email');
  }

  goToTerms() {
    this.navCtrl.navigateForward('/public/termsAndConditions');
  }
  goToPrivacy() {
    this.navCtrl.navigateForward('/public/privacyPolicy');
  }
}
