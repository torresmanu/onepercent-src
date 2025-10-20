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
        return '#131313';
      case 'Lunch':
        return '#F0FBD2';
      case 'Breakfast':
        return '#F0FFF0';
      case 'Snacks':
        return '#F8FDE8';
      default:
        return '#FFFFFF';
    }
  }

  getTextColor(section: string): string {
    switch (section) {
      case 'Dinner':
        return '#FFFFFF';
      case 'Lunch':
        return '#131313';
      case 'Breakfast':
        return '#131313';
      case 'Snacks':
        return '#131313';
      default:
        return '#FFFFFF';
    }
  }

  getQuialityColor(section: string): string {
    switch (section) {
      case 'Dinner':
        return '#75A042';
      case 'Lunch':
        return '#75A042';
      case 'Breakfast':
        return '#E8B225';
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

  startRecipe() {
    if (this.recipe?.id) {
      this.router.navigate(['/private/recipe-steps', this.recipe.id]);
    }
  }
}
