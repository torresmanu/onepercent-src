import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { TabsComponent } from './tabs/tabs.component';
import { PlanSelectInfoComponent } from './plans/plan-select-info/plan-select-info.component';
import { FreePlanPayWallComponent } from './plans/free-plan-pay-wall/free-plan-pay-wall.component';
import { ComparasionOfPlansComponent } from './plans/comparasion-of-plans/comparasion-of-plans.component';
import { TermsPrivacyComponent } from '../public/pages/terms-privacy/terms-privacy.component';
import { ChoicePlansComponent } from './plans/choice-plans/choice-plans.component';
import { ChangePaswordComponent } from './profile/change-pasword/change-pasword.component';
import { RecoverPasswordComponent } from '../public/pages/recover-password/recover-password.component';
import { SecondPaywallComponent } from './plans/second-paywall/second-paywall.component';
import { NutritionComponent } from './nutrition/nutrition.component';
import { ProFormComponent } from './plans/plan-form/pro/pro-form.component';
import { BasicFormComponent } from './plans/plan-form/basic/basic-form.component';
import { ProFormTwoComponent } from './plans/plan-form/pro-two/pro-form-two';
import { HydrationRegistrationComponent } from './nutrition/hydration-registration/hydration-registration.component';
import { FoodRegistrationComponent } from './nutrition/food-registration/food-registration.component';
import { AllergiesFormComponent } from './plans/plan-form/allergies/allergies-form.component';
import { RecipeLibraryComponent } from './nutrition/recipe/recipe-library/recipe-library/recipe-library.component';
import { ProFormResultsComponent } from './plans/plan-form/pro-results/pro-form-results.component';
import { ProgresDayComponent } from './nutrition/progres-day/progres-day.component';
import { RecipeDetailComponent } from './nutrition/recipes/recipeDetail/recipeDetail.component';
import { RecipeStepsComponent } from './nutrition/recipes/recipe-steps/recipe-steps.component';
import { NutritionalInfoComponent } from './nutrition/nutritional-info/nutritional-info.component';
import { EditIngredientComponent } from './nutrition/food-registration/edit-ingredient/edit-ingredient.component';
import { HealtTestComponent } from './healt-test/healt-test.component';


export const privateRoutes: Routes = [
  {
    path: '',
    component: TabsComponent,
    children: [
      {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full',
      },
      {
        path: 'home',
        component: HomeComponent,
      },
      {
        path: 'activity',
      loadChildren: () =>
          import('@src/app/pages/private/activity/activity.routes').then(
            (m) => m.activityRoutes
          ),
      },
      {
        path: 'healthTest',
        component: HealtTestComponent,
      },
      {
        path: 'nutrition',
        loadChildren: () =>
          import('@src/app/pages/private/nutrition/nutrition.routes').then(
            (m) => m.nutritionRoutes
          ),
      },
      {
        path: 'stats',
        component: HomeComponent,
      },
    ],
  },
  {
    path: '',
    children: [
      {
        path: 'plans/select-info',
        component: PlanSelectInfoComponent,
      },
      {
        path: 'plans/form/pro',
        component: ProFormComponent,
      },
      {
        path: 'plans/form/basic',
        component: BasicFormComponent,
      },
      {
        path: 'plans/form/pro-two',
        component: ProFormTwoComponent,
      },
      {
        path: 'plans/form/pro-results',
        component: ProFormResultsComponent,
      },
      {
        path: 'plans/form/allergies',
        component: AllergiesFormComponent,
      },
    ],
  },
  {
    path: 'free-plan-paywall',
    component: FreePlanPayWallComponent,
  },
  {
    path: 'profile',
    loadChildren: () =>
      import('./profile/profile.routes').then((m) => m.profileRoutes),
  },
  {
    path: 'comparasion-of-plans',
    component: ComparasionOfPlansComponent,
  },
  {
    path: 'recipe-detail/:id',
    component: RecipeDetailComponent,
  },
  {
    path: 'recipe-steps/:id',
    component: RecipeStepsComponent,
  },
  {
    path: 'nutritional-info/:id',
    component: NutritionalInfoComponent,
  },
  {
    path: 'confirmation-of-terms',
    component: TermsPrivacyComponent,
  },
  {
    path: 'choice-plans',
    component: ChoicePlansComponent,
  },
  {
    path: 'forgot-password',
    component: RecoverPasswordComponent,
  },
  {
    path: 'second-paywall',
    component: SecondPaywallComponent,
  },
  {
    path: 'progress-day',
    component: ProgresDayComponent,
  },
  {
    path: 'hydration-registration',
    component: HydrationRegistrationComponent,
  },
  {
    path: 'food-registration',
    component: FoodRegistrationComponent,
  },
  {
    path: 'edit-ingredient/:id',
    component: EditIngredientComponent
  },
  {
    path: '**',
    redirectTo: '',
    pathMatch: 'full',
  },
];

// Redirección automática en desarrollo a /private/plans/form?isPremium=true
// declare const window: any;
// if (window && window.location && window.location.hostname === 'localhost') {
//   const currentUrl = window.location.href;
//   if (!currentUrl.includes('/private/plans/form?isPremium=true')) {
//     window.location.href =
//       'http://localhost:8100/private/plans/form?isPremium=true';
//   }
// }
