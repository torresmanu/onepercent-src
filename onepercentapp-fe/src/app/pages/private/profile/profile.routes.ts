import { Routes } from '@angular/router';
import { ProfileComponent } from './profile.component';

export const profileRoutes: Routes = [
  {
    path: '',
    component: ProfileComponent
  },
  {
    path: 'edit',
    loadComponent: () => import('./edit-profile/edit-profile.component').then(m => m.EditProfileComponent)
  },

  {
    path: 'logout',
    loadComponent: () => import('./log-out/log-out.component').then(m => m.LogOutComponent)
  },
  {
    path: 'deleteAccount',
    loadComponent: () => import('./delete-account/delete-account.component').then(m => m.DeleteAccountComponent)
  },
  {
    path: 'termsAndConditions',
    loadComponent: () => import('./terms-and-conditions/terms-and-conditions.component').then(m => m.TermsAndConditionsComponent)
  },
  {
    path: 'privacyPolicy',
    loadComponent: () => import('./privacy-policy/privacy-policy.component').then(m => m.PrivacyPolicyComponent)
  },
    {
    path: 'changePassword',
    loadComponent: () => import('./change-pasword/change-pasword.component').then(m => m.ChangePaswordComponent)
  },
  {
    path: 'notifications',
    loadComponent: () => import('./notifications/notifications.component').then(m => m.NotificationsComponent)
  },
   {
    path: 'subscription',
    loadComponent: () => import('./subscription/subscription.component').then(m => m.SubscriptionComponent)
  }, 
  {
    path: 'notifications',
    loadComponent: () => import('./notifications/notifications.component').then(m => m.NotificationsComponent)
  },
    {
    path: 'confirmLogout',
    loadComponent: () => import('./confirm-logout/confirm-logout.component').then(m => m.ConfirmLogoutComponent)
  },
  /* {
    path: 'change-password',
    loadComponent: () => import('./change-password/change-password.component').then(m => m.ChangePasswordComponent)
  },
  {
    path: 'delete-account',
    loadComponent: () => import('./delete-account/delete-account.component').then(m => m.DeleteAccountComponent)
  },
  {
    path: 'privacy',
    loadComponent: () => import('./privacy/privacy.component').then(m => m.PrivacyComponent)
  },
  {
    path: 'medical',
    loadComponent: () => import('./medical/medical.component').then(m => m.MedicalComponent)
  }, */
  {
    path: 'contact',
    loadComponent: () => import('./contact/contact.component').then(m => m.ContactComponent)
  }
]; 