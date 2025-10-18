import { Routes } from '@angular/router';
import { RecipeLibraryComponent } from './recipe/recipe-library/recipe-library/recipe-library.component';
import { NutritionComponent } from './nutrition.component';
import { ProgresDayComponent } from './progres-day/progres-day.component';


export const nutritionRoutes: Routes = [
  {
    path: '',
    redirectTo: '',
    pathMatch: 'full',
  },
  {
    path: '',
    component: NutritionComponent,
  },
  {
    path: 'recipe-library',
    component: RecipeLibraryComponent,
  },
];
