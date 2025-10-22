import { Routes } from '@angular/router';
import { ActivityMainComponent } from './activity-main/activity-main.component';

export const activityRoutes: Routes = [
  {
    path: '',
    redirectTo: '',
    pathMatch: 'full',
  },
  {
    path: '',
    component: ActivityMainComponent,
  },
];
