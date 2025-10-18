import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';

import { NavController, Platform } from '@ionic/angular/standalone';
import { NutritionService } from '@src/app/services/nutrition.service';
import { RecipesIngredientsCardComponent } from '../recipes-ingredients-card/recipes-ingredients-card.component';
import { RecipesStepsCardComponent } from '../recipes-steps-card/recipes-steps-card.component';
import { alarm } from 'ionicons/icons';
import { ModalService } from '@src/app/services/modal.service';
import { RecipeStepsComponent } from '@src/app/shared/components/recipe-steps-modal/recipe-steps-modal.component';
@Component({
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
    IonicModule,
    FormsModule,
    RecipesIngredientsCardComponent,
    RecipesStepsCardComponent,
  ],
  selector: 'app-recipe-detail',
  templateUrl: './recipeDetail.component.html',
  styleUrls: ['./recipeDetail.component.scss'],
})
export class RecipeDetailComponent implements OnInit {
  recipe: any = {};
  portion = 1;
  selectedTab = 'ingredients';

  private readonly navCtrl = inject(NavController);
  private readonly platform = inject(Platform);
  private readonly translate = inject(TranslateService);
  private readonly nutritionService = inject(NutritionService);
  private readonly modalService = inject(ModalService);

  ngOnInit() {
    this.nutritionService.getRecipeDetail('1').subscribe((data) => {
      this.recipe = data;
    });
  }

  increasePortion() {
    this.portion++;
  }
  decreasePortion() {
    if (this.portion > 1) this.portion--;
  }
  getBackgroundColor(category: string): string {
    switch (category) {
      case 'dinner':
        return '#131313';
      case 'lunch':
        return '#F0FBD2';
      case 'breakfast':
        return '#F0FFF0';
      case 'snack':
        return '#F8FDE8';
      default:
        return '#FFFFFF';
    }
  }

  getTextColor(category: string): string {
    switch (category) {
      case 'dinner':
        return '#FFFFFF';
      case 'lunch':
        return '#131313';
      case 'breakfast':
        return '#131313';
      case 'snack':
        return '#131313';
      default:
        return '#FFFFFF';
    }
  }

  getQuialityColor(category: string): string {
    switch (category) {
      case 'dinner':
        return '#75A042';
      case 'lunch':
        return '#75A042';
      case 'breakfast':
        return '#E8B225';
      case 'snack':
        return '#E8B225';
      default:
        return '#B2B2B2';
    }
  }

  buttonType(category: string): boolean {
    switch (category) {
      case 'dinner':
        return false;
      case 'lunch':
        return true;
      case 'breakfast':
        return true;
      case 'snack':
        return true;
      default:
        return false;
    }
  }

  goBack() {
    this.navCtrl.navigateBack('/private/home');
  }

  setFavourite() {
    console.log('Favourite set for recipe:', this.recipe.name);
  }

  openModalStepRecipe(steps: any, stepNumber: number) {
    console.log('Opening modal for step:', steps, stepNumber);
    this.modalService.presentFullScreenModal(RecipeStepsComponent, {
      recipe: this.recipe,
      steps: steps,
      stepNumber: stepNumber,
      backgroundColor: this.getBackgroundColor(this.recipe.category),
      textColor: this.getTextColor(this.recipe.category),
      buttonTypes: this.buttonType(this.recipe.category),
    });
  }
}
