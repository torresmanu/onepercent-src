import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  IonContent,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButton,
  IonIcon,
  IonAvatar,
  IonList,
  IonItem,
  IonLabel,
  NavController,
} from '@ionic/angular/standalone';
import { HeaderComponent } from 'src/app/shared/components/header/header.component';
import { StorageService } from 'src/app/services/storage.service';
import { StorageKey } from 'src/app/core/interfaces/storage';
import { User } from 'src/app/core/interfaces/user';
import { AuthService } from 'src/app/services/auth/auth.service';
import { TranslateModule } from '@ngx-translate/core';
import { environment } from 'src/environments/environment';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    CommonModule,
    IonContent,
    IonButton,
    IonAvatar,
    IonList,
    IonItem,
    IonLabel,
    HeaderComponent,
    TranslateModule,
    IonIcon,
  ],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent {
  private storageService = inject(StorageService);
  private authService = inject(AuthService);
  private navController = inject(NavController);
  tranaslate = inject(TranslateModule);
  user: User | null = null;
  public environment = environment;
  

  ionViewWillEnter() {
    console.log('sadsa');
    this.loadUserData();
  }
  loadUserData() {
    this.storageService.get<User>(StorageKey.userData).subscribe({
      next: (userData) => {
        this.user = userData;
      },
      error: (error) => {
        console.error('Error al cargar datos del usuario:', error);
      },
    });
  }

  getUserFullName(): string {
    if (!this.user) return 'Jon Doe';

    // if (this.user.firstname && this.user.lastname) {
    //   return `${this.user.firstname} ${this.user.lastname}`;
    // } else if (this.user.firstname) {
    //   return this.user.firstname;
    // } else {
    //   return 'Jon Doe';
    // }

    return this.user.firstname;
  }

  hasProLicense(): boolean {
    if (!this.user?.userLicenses) return false;

    return this.user.userLicenses.some(
      (license) =>
        license.active && license.license.title.toLowerCase().includes('pro')
    );
  }

  editProfile() {
    this.navController.navigateForward('/private/profile/edit');
  }

  goToSubscription() {
    this.navController.navigateForward('/private/profile/subscription');
  }

  goToNotifications() {
    this.navController.navigateForward('/private/profile/notifications');
  }

  goToChangePassword() {
    this.navController.navigateForward('/private/profile/changePassword');
  }

  goToDeleteAccount() {
    this.navController.navigateForward('/private/profile/deleteAccount');
  }

  goToTerms() {
    this.navController.navigateForward('/private/profile/termsAndConditions');
  }

  goToPrivacy() {
    this.navController.navigateForward('/private/profile/privacyPolicy');
  }

  goToMedicalInfo() {
    this.navController.navigateForward('/private/profile/medical');
  }

  goToContact() {
    this.navController.navigateForward('/private/profile/contact');
  }

  logout() {
    this.navController.navigateForward('/private/profile/logout');

    // this.authService.logout();
  }
}
