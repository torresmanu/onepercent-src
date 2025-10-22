import { Component, inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { User } from 'src/app/core/interfaces/user';
import { IonAvatar } from '@ionic/angular/standalone';
import {
  IonContent,
  IonHeader,
  IonToolbar,
  IonIcon,
  NavController
} from '@ionic/angular/standalone';
import { StorageKey } from 'src/app/core/interfaces/storage';
import { StorageService } from 'src/app/services/storage.service';
import { environment } from 'src/environments/environment';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SplitSlideComponent } from './split-slide/split-slide.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { WaterSlideComponent } from './water-slide/water-slide.component';
import { FruitSlideComponent } from './fruit-slide/fruit-slide.component';
import { ProgressBarComponent } from './progress-bar/progress-bar.component';
// import { HydrationRegistrationComponent } from './hydration-registration/hydration-registration.component';
// import { FoodRegistrationComponent } from './food-registration/food-registration.component';
import { WeeklyMenuComponent } from './weekly-menu/weekly-menu.component';
import { DailyHighlightsSliderComponent } from './daily-highlights-slider/daily-highlights-slider.component';
import { TranslateModule } from '@ngx-translate/core';
import { CollapsableCardComponent } from 'src/app/shared/components/collapsable-card/collapsable-card.component';
import { NutritionService } from 'src/app/services/nutrition.service';

@Component({
  standalone: true,
  imports: [
    IonIcon,
    IonToolbar,
    IonHeader,
    IonContent,
    IonAvatar,
    RouterLink,
    CommonModule,
    FormsModule,
    SplitSlideComponent,
    WaterSlideComponent,
    FruitSlideComponent,
    ProgressBarComponent,
    // HydrationRegistrationComponent,
    // FoodRegistrationComponent,
    WeeklyMenuComponent,
    DailyHighlightsSliderComponent,
    TranslateModule,
    CollapsableCardComponent,
  ],
  selector: 'app-nutrition',
  templateUrl: './nutrition.component.html',
  styleUrls: ['./nutrition.component.scss'],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class NutritionComponent implements OnInit {
  public environment = environment;
  private nutritionService = inject(NutritionService);
  private storageService = inject(StorageService);
  private readonly navCtrl = inject(NavController);

  puntosSplit = 0;
  puntosFruit = 0;
  puntosWater = 0;

  rutaIconoHidratacion = 'assets/imgs/nutrition/glass-green.svg'; // O la ruta que corresponda

  get puntosTotales(): number {
    return this.puntosSplit + this.puntosFruit + this.puntosWater;
  }

  user: User | null = null;

  hydrateRegister: any[] = [];
  foodData: any[] = [];

  slides = [
    {
      type: 'split',
    },
    {
      type: 'double',
    },
  ];

  ngOnInit() {
    this.loadUserData();
    this.initializeFruitsCount();

    this.nutritionService.getHydrateRegister().subscribe((data) => {
      this.hydrateRegister = data;
    });

    this.nutritionService.getFoodData().subscribe((data) => {
      this.foodData = data; 
    });
  }

  private initializeFruitsCount() {
    // Initialize fruits count to ensure data is loaded
    this.nutritionService.getTodayFruitsCount().subscribe(count => {
      console.log('NutritionComponent - Initialized fruits count:', count);
    });
  }

  goToProgressDay() {
    this.navCtrl.navigateForward('/private/progress-day');
  }

  goToHydratationRegistration() {
    this.navCtrl.navigateForward('/private/hydration-registration');
  }

  goToFoodRegistration() {
    this.navCtrl.navigateForward('/private/food-registration');
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
}
