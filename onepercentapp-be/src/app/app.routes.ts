import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth-guard';

export const routes: Routes = [
  {
    path: 'public',
    canActivate: [authGuard],
    loadChildren: () =>
      import('./pages/public/public.route').then((m) => m.publicRoutes),
  },
  {
    path: 'private',
    canActivate: [authGuard],
    loadChildren: () =>
      import('./pages/private/private.routes').then((m) => m.privateRoutes),
  },
  {
    path: '**',
    redirectTo: 'public',
    pathMatch: 'full',
  },
];
