import { bootstrapApplication } from '@angular/platform-browser';
import {
  PreloadAllModules,
  RouteReuseStrategy,
  provideRouter,
  withPreloading,
} from '@angular/router';
import {
  IonicRouteStrategy,
  provideIonicAngular,
} from '@ionic/angular/standalone';

import {
  provideHttpClient,
  withInterceptorsFromDi,
  HTTP_INTERCEPTORS,
  HttpClient,
} from '@angular/common/http';

import { importProvidersFrom } from '@angular/core';
import { Drivers } from '@ionic/storage';
import { IonicStorageModule } from '@ionic/storage-angular';

import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

import { initializeApp } from 'firebase/app';
import cordovaSQLiteDriver from 'localforage-cordovasqlitedriver';

import { AppComponent } from './app/app.component';
import { routes } from './app/app.routes';
import { environment } from './environments/environment';

import { TokenInterceptor } from './app/core/interceptors/token.interceptor';
import { NutritionService } from './app/services/nutrition.service';

import { addIcons } from 'ionicons';
import {
  checkmarkOutline,
  createOutline,
  eyeOffOutline,
  eyeOutline,
  logoApple,
  mailOutline,
  pencilOutline,
  homeOutline,
  personOutline,
  fitnessOutline,
  statsChartOutline,
  settingsOutline,
  chevronForwardOutline,
  chevronBackOutline,
  notificationsOutline,
  lockClosedOutline,
  logOutOutline,
  trashOutline,
  documentTextOutline,
  shieldOutline,
  medicalOutline,
  chatbubbleOutline,
  fileTrayStackedOutline,
  checkboxOutline,
  checkmark,
  close,
  cameraOutline,
  informationCircleOutline,
  checkmarkCircle,
  ellipseOutline,
  arrowBackOutline,
  flameOutline,
  timeOutline,
  heart,
  heartOutline,
  chevronDownOutline,
} from 'ionicons/icons';

initializeApp(environment.firebase);
cordovaSQLiteDriver._driver;

const httpLoaderFactory = (http: HttpClient) =>
  new TranslateHttpLoader(http, './assets/i18n/', '.json');

bootstrapApplication(AppComponent, {
  providers: [
    provideIonicAngular(),
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    provideRouter(routes, withPreloading(PreloadAllModules)),
    provideHttpClient(withInterceptorsFromDi()),
    { provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true },
    NutritionService,
    importProvidersFrom([
      TranslateModule.forRoot({
        loader: {
          provide: TranslateLoader,
          useFactory: httpLoaderFactory,
          deps: [HttpClient],
        },
      }),
      IonicStorageModule.forRoot({
        driverOrder: [
          cordovaSQLiteDriver._driver,
          Drivers.IndexedDB,
          Drivers.LocalStorage,
        ],
        name: environment.dbName,
      }),
    ]),
  ],
});

addIcons({
  'eye-outline': eyeOutline,
  'eye-off-outline': eyeOffOutline,
  'create-outline': createOutline,
  'checkmark-outline': checkmarkOutline,
  'logo-apple': logoApple,
  'mail-outline': mailOutline,
  'pencil-outline': pencilOutline,
  'check-outline': checkmark,
  'home-outline': homeOutline,
  'close-outline': close,
  'person-outline': personOutline,
  'fitness-outline': fitnessOutline,
  'stats-chart-outline': statsChartOutline,
  'settings-outline': settingsOutline,
  'chevron-forward-outline': chevronForwardOutline,
  'chevron-down-outline': chevronDownOutline,
  'notifications-outline': notificationsOutline,
  'lock-closed-outline': lockClosedOutline,
  'log-out-outline': logOutOutline,
  'trash-outline': trashOutline,
  'document-text-outline': documentTextOutline,
  'shield-outline': shieldOutline,
  'medical-outline': medicalOutline,
  'chatbubble-outline': chatbubbleOutline,
  'file-tray-stacked-outline': fileTrayStackedOutline,
  'camera-outline': cameraOutline,
  'information-circle-outline': informationCircleOutline,
  'checkmark-circle': checkmarkCircle,
  'ellipse-outline': ellipseOutline,
  'arrow-back-outline': arrowBackOutline,
  'elipse-outline': ellipseOutline,
  'chevron-back-outline': chevronBackOutline,
  'flame-outline': flameOutline,
  'time-outline': timeOutline,
  'heart': heart,
  'heart-outline': heartOutline,
});
