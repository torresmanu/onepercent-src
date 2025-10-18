import { Routes } from '@angular/router';
import { LoginPageComponent } from './pages/login/login-page.component';
import { WelcomePage } from './pages/welcome/welcome.page';
import { WelcomeFinalComponent } from './pages/welcome/welcome-final/welcome-final.component';
import { WelcomeNameComponent } from './pages/welcome/welcome-name/welcome-name.component';
import { LoginWithEmailComponent } from './pages/login/login-with-email/login-with-email.component';
import { RecoverPasswordComponent } from './pages/recover-password/recover-password.component';
import { ConfirmEmailComponent } from './pages/recover-password/confirm-email/confirm-email.component';
import { TermsPrivacyComponent } from './pages/terms-privacy/terms-privacy.component';
import { ResetPasswordComponent } from './pages/reset-password/reset-password.component';
import { RegisterPageComponent } from './pages/register/register-page.component';
import { EmailFormComponent } from './pages/register/email-form/email-form.component';
import { PasswordFormComponent } from './pages/register/password-form/password-form.component';
import { VerifyEmailComponent } from './pages/register/verify-email/verify-email.component';
import { RegiterInfoinitComponent } from './pages/register/register-infoinit/register-infoinit.component';
import { RegiterStartFormComponent } from './pages/register/register-start-form/register-start-form.component';
import { FreePlanPayWallComponent } from '../private/plans/free-plan-pay-wall/free-plan-pay-wall.component';
import { InitFormComponent } from './pages/init-form/form/init-form.component';
import { ComparasionOfPlansComponent } from '../private/plans/comparasion-of-plans/comparasion-of-plans.component';
import { FormResultComponent } from './pages/init-form/form-result/form-result.component';
import { PrivacyPolicyComponent } from '../private/profile/privacy-policy/privacy-policy.component';
import { TermsAndConditionsComponent } from '../private/profile/terms-and-conditions/terms-and-conditions.component';
import { ActivityMainComponent } from '../private/activity/activity-main/activity-main.component';

export const publicRoutes: Routes = [
  {
    path: 'welcome',
    component: WelcomePage, // Página de bienvenida
  },
  {
    path: 'welcome-name',
    component: WelcomeNameComponent, // Página para ingresar el nombre
  },
  {
    path: 'welcome-final',
    component: WelcomeFinalComponent, // Página para ingresar el nombre
  },
  {
    path: 'login',
    component: LoginPageComponent,
  },
  {
    path: 'register',
    component: RegisterPageComponent,
  },
  {
    path: 'email-form',
    component: EmailFormComponent,
  },
  {
    path: 'password-form',
    component: PasswordFormComponent,
  },
  {
    path: 'verify-email',
    component: VerifyEmailComponent,
  },
  {
    path: 'login-with-email',
    component: LoginWithEmailComponent,
  },
  {
    path: 'forgot-password',
    component: RecoverPasswordComponent,
  },
  {
    path: 'reset-password',
    component: ResetPasswordComponent,
  },
  {
    path: 'email-sent',
    component: ConfirmEmailComponent,
  },
  {
    path: 'privacyPolicy',
    component: PrivacyPolicyComponent,
  },
  {
    path: 'termsAndConditions',
    component: TermsAndConditionsComponent,
  },
  {
    path: 'register-init',
    component: RegiterInfoinitComponent,
  },
  {
    path: 'registerFormStart',
    component: RegiterStartFormComponent,
  },
  {
    path: 'init-form',
    component: InitFormComponent,
  },
  {
    path: 'results-init-form',
    component: FormResultComponent,
  },
  {
    path: 'test',
    component: ActivityMainComponent,
  },
  /* ,

  {
    path: 'recover-password',
    component: RecoverPasswordComponent,
  },
  {
    path: 'onboarding',
    component: OnboardingComponent,
  },
  {
    path: 'redirect-form',
    component: RedirectFormComponent,
  }, */

  {
    path: '**',
    redirectTo: 'welcome',
    pathMatch: 'full',
  },
];
