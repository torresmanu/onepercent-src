import { CommonModule, Location } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';

import { NavController, Platform } from '@ionic/angular/standalone';
import { ActivatedRoute, Router } from '@angular/router';
import { RecipeService } from '@src/app/services/recipe.service';
import { RecipesIngredientsCardComponent } from '../recipes-ingredients-card/recipes-ingredients-card.component';
import { RecipesStepsCardComponent } from '../recipes-steps-card/recipes-steps-card.component';
import { alarm } from 'ionicons/icons';
import { ModalService } from '@src/app/services/modal.service';
import { RecipeStepsComponent } from '@src/app/shared/components/recipe-steps-modal/recipe-steps-modal.component';
import { NutritionService } from '@src/app/services/nutrition.service';
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
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly recipeService = inject(RecipeService);
  private readonly modalService = inject(ModalService);
  private readonly location = inject(Location);
  private readonly nutritionService = inject(NutritionService);

  ngOnInit() {
    const idParam = this.route.snapshot.paramMap.get('id');
    const id = idParam ? Number(idParam) : NaN;
    
    if (!isNaN(id)) {
      // Load recipe with favorite status in one call
      this.recipeService.getRecipeByIdWithFavoriteStatus(id).subscribe({
        next: (data) => {
          this.recipe = {
            ...data,
            image: data.image || this.getDefaultImageForSection(data.section),
          };
          console.log(`Recipe ${id} loaded with favorite status:`, this.recipe.favorite);
        },
        error: () => {
          // In case of error, go back to library to keep UX consistent
          this.navCtrl.navigateBack('/private/nutrition/recipe-library');
        },
      });
    } else {
      this.navCtrl.navigateBack('/private/nutrition/recipe-library');
    }
  }

  increasePortion() {
    this.portion++;
  }
  decreasePortion() {
    if (this.portion > 1) this.portion--;
  }
  getBackgroundColor(section: string): string {
    switch (section) {
      case 'Dinner':
        return '#131313'; // --ion-color-dark
      case 'Lunch':
        return '#F0FBD2'; // --ion-color-secondary
      case 'Breakfast':
        return '#BCDF84'; // --ion-color-primary (consistent with cards)
      case 'Snacks':
        return '#F0FBD2'; // --ion-color-secondary (consistent with cards)
      default:
        return '#FFFFFF';
    }
  }

  getTextColor(section: string): string {
    switch (section) {
      case 'Dinner':
        return '#FFFFFF'; // White text for dark background
      case 'Lunch':
        return '#131313'; // Dark text for light background
      case 'Breakfast':
        return '#000000'; // Black text for green primary background
      case 'Snacks':
        return '#131313'; // Dark text for light background
      default:
        return '#131313';
    }
  }

  getQuialityColor(section: string): string {
    switch (section) {
      case 'Dinner':
        return '#75A042';
      case 'Lunch':
        return '#75A042';
      case 'Breakfast':
        return '#131313'; // Changed from #E8B225 to black for breakfast
      case 'Snacks':
        return '#E8B225';
      default:
        return '#B2B2B2';
    }
  }

  buttonType(section: string): boolean {
    switch (section) {
      case 'Dinner':
        return false;
      case 'Lunch':
        return true;
      case 'Breakfast':
        return true;
      case 'Snacks':
        return true;
      default:
        return false;
    }
  }

  goBack() {
    this.location.back();
  }

  openNutritionalInfo() {
    this.router.navigate(['/private/nutritional-info', this.recipe.id]);
  }

  setFavourite() {
    if (this.recipe?.id) {
      this.recipeService.toggleFavoriteRecipe(this.recipe).subscribe({
        next: () => {
          // Update local recipe state
          this.recipe.favorite = !this.recipe.favorite;
          console.log('Recipe favorite status updated:', this.recipe.favorite);
          
          // Force refresh of recipe library to reflect changes
          this.recipeService.loadRecipes();
        },
        error: (error) => {
          console.error('Error updating favorite status:', error);
          // TODO: Show error message to user
        }
      });
    }
  }

  openModalStepRecipe(steps: any, stepNumber: number) {
    this.modalService.presentFullScreenModal(RecipeStepsComponent, {
      recipe: this.recipe,
      steps: steps,
      stepNumber: stepNumber,
      backgroundColor: this.getBackgroundColor(this.recipe.section),
      textColor: this.getTextColor(this.recipe.section),
      buttonTypes: this.buttonType(this.recipe.section),
    });
  }

  private getDefaultImageForSection(section?: string): string {
    switch (section) {
      case 'Breakfast':
      case 'Snacks':
        return '/assets/imgs/nutrition/recipe-defaults/breakfast-snack.jpg';
      case 'Lunch':
        return '/assets/imgs/nutrition/recipe-defaults/lunch.jpg';
      case 'Dinner':
        return '/assets/imgs/nutrition/recipe-defaults/dinner.jpg';
      default:
        return '/assets/imgs/nutrition/fruit.svg';
    }
  }

  getQualityText(value?: number): string {
    if (!value) return '';
    const map: Record<number, string> = {
      4: 'Calidad excelente',
      3: 'Calidad muy buena',
      2: 'Calidad buena',
      1: 'Calidad moderada',
    };
    return map[value] || '';
  }

  /**
   * Register meal from recipe
   * Navigates to food registration with pre-loaded ingredients from the recipe
   */
  startRecipe() {
    if (!this.recipe?.id) {
      console.error('No recipe ID available');
      return;
    }

    // Check if recipe has ingredients
    if (!this.recipe.recipeIngredients || this.recipe.recipeIngredients.length === 0) {
      console.error('Recipe has no ingredients');
      // TODO: Show error toast to user
      return;
    }

    // Transform recipe ingredients to the format expected by food registration
    const ingredientsForRegistration = this.recipe.recipeIngredients.map((recipeIngredient: any) => {
      // Extract ingredient data, handling both possible structures
      const ingredient = recipeIngredient.ingredient || recipeIngredient;
      
      // Calculate quantity based on selected portion
      const baseQuantity = recipeIngredient.quantity || 100;
      const adjustedQuantity = baseQuantity * this.portion;

      return {
        id: ingredient.id,
        name: ingredient.name || 'Ingrediente sin nombre',
        quantity: adjustedQuantity,
        unit: recipeIngredient.unit || 'gramos',
        kcal: ingredient.energy || 0,
        // Include ALL nutritional data
        energy: ingredient.energy,
        protein: ingredient.protein,
        carbs: ingredient.carbs,
        fat: ingredient.fat,
        fiber: ingredient.fiber,
        sugar: ingredient.sugar,
        saturatedFat: ingredient.saturatedFat,
        nonSaturatedFat: ingredient.nonSaturatedFat,
        sodium: ingredient.sodium,
        potassium: ingredient.potassium,
        cholesterol: ingredient.cholesterol,
        salt: ingredient.salt,
        ingredientGroup: ingredient.ingredientGroup
      };
    });

    // Pre-load ingredients in nutrition service
    this.nutritionService.setIngredients(ingredientsForRegistration);

    // Map recipe section to meal type for food registration
    const mealTypeMap: { [key: string]: string } = {
      'Breakfast': 'Desayuno',
      'Lunch': 'Comida',
      'Dinner': 'Cena',
      'Snacks': 'Snack'
    };
    
    const mealType = mealTypeMap[this.recipe.section] || null;

    // Navigate to food registration with meal type as state
    this.router.navigate(['/private/food-registration'], {
      state: { 
        preSelectedMealType: mealType,
        fromRecipe: true,
        recipeId: this.recipe.id
      }
    });
  }
}
