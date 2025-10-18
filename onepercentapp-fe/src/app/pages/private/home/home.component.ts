import { Component, inject, signal, type OnInit } from '@angular/core';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonAvatar,
  IonIcon,
  NavController,
  IonImg,
  IonLabel,
  IonSegment,
  IonSegmentButton,
  SegmentCustomEvent,
  IonButtons,
  IonButton,
} from '@ionic/angular/standalone';
import { AuthService } from 'src/app/services/auth/auth.service';
import { CommonModule } from '@angular/common';
import { StorageService } from 'src/app/services/storage.service';
import { StorageKey } from 'src/app/core/interfaces/storage';
import { User } from 'src/app/core/interfaces/user';
import { RouterLink } from '@angular/router';
import { environment } from 'src/environments/environment';
import { WeeklyMenuComponent } from './weekly-menu/weekly-menu/weekly-menu.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    IonImg,
    CommonModule,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonAvatar,
    IonIcon,
    RouterLink,
    IonSegment,
    IonSegmentButton,
    IonLabel,
    IonButtons,
    IonButton,
    WeeklyMenuComponent,
  ],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  authService = inject(AuthService);
  storageService = inject(StorageService);
  navController = inject(NavController);
  public environment = environment;
  user: User | null = null;
  period = signal<string>('week');

  ngOnInit(): void {
    this.loadUserData();
    setTimeout(() => {
      const firstButton = document.querySelector('button');
      if (firstButton) (firstButton as HTMLElement).focus();
    }, 100);
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

  logOut() {
    this.authService.logout();
  }

  goToProfile() {
    this.navController.navigateForward('/private/profile');
  }
  navigateToProFormTwoResults() {
    this.navController.navigateForward('/private/plans/form/pro-results');
  }
  navigateToPlans() {
    this.navController.navigateForward('/private/plans/select-info');
  }
  navigateToProFormTwo() {
    this.navController.navigateForward('/private/plans/form/pro-two');
  }
  navigateToProForm() {
    this.navController.navigateForward('/private/plans/form/pro');
  }
  navigateToBasicForm() {
    this.navController.navigateForward('/private/plans/form/basic');
  }
  navigateToAllergies() {
    this.navController.navigateForward('/private/plans/form/allergies');
  }
  goToSecondPaywall() {
    console.log('Navegando a second-paywall');
    this.navController.navigateForward('/private/second-paywall');
  }

   goRecipeDetail() {
    console.log('Navegando a recipe-detail');
    this.navController.navigateForward('/private/recipe-detail/1');
  }
    goToPaywall() {

    console.log('Navegando a second-paywall');
    this.navController.navigateForward('/private/choice-plans');
  }

  goToFoodRegistration() {
    this.navController.navigateForward('/private/food-registration');
  }

  changeValue(event: SegmentCustomEvent) {
    this.period.set(String(event.detail.value));
    console.log('Selected period:', this.period());
  }
  goHealthTest(){
    this.navController.navigateForward('/private/healthTest');
  }
}
