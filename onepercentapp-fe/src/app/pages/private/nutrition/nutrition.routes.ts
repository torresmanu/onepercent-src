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
  {
    path: 'recipe-library/breakfast',
    component: RecipeLibraryComponent,
    data: { mealTime: 'Breakfast' }
  },
  {
    path: 'recipe-library/lunch',
    component: RecipeLibraryComponent,
    data: { mealTime: 'Lunch' }
  },
  {
    path: 'recipe-library/dinner',
    component: RecipeLibraryComponent,
    data: { mealTime: 'Dinner' }
  },
  {
    path: 'recipe-library/snack',
    component: RecipeLibraryComponent,
    data: { mealTime: 'Snacks' }
  },
];
