import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { Recipe, RecipeStep } from '../../../../../core/interfaces/recipe';
import { RecipeService } from '../../../../../services/recipe.service';

@Component({
  selector: 'app-recipe-steps',
  standalone: true,
  imports: [IonicModule, CommonModule],
  templateUrl: './recipe-steps.component.html',
  styleUrls: ['./recipe-steps.component.scss']
})
export class RecipeStepsComponent implements OnInit {
  recipe: Recipe | null = null;
  currentStep: number = 0;
  totalSteps: number = 0;
  currentStepData: RecipeStep | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private recipeService: RecipeService
  ) {}

  ngOnInit() {
    // Get recipe ID from route parameters
    const recipeId = this.route.snapshot.paramMap.get('id');
    if (recipeId) {
      this.loadRecipe(parseInt(recipeId));
    }
  }

  loadRecipe(recipeId: number) {
    this.recipeService.getRecipeById(recipeId).subscribe({
      next: (recipe) => {
        this.recipe = recipe;
        this.totalSteps = recipe.recipeSteps?.length || 0;
        this.updateCurrentStepData();
      },
      error: () => {
        // Navigate back to recipe detail on error
        this.router.navigate(['/private/recipe-detail', recipeId]);
      }
    });
  }

  updateCurrentStepData() {
    if (this.recipe?.recipeSteps && this.recipe.recipeSteps.length > 0) {
      // Sort steps by step number to ensure correct order
      const sortedSteps = [...this.recipe.recipeSteps].sort((a, b) => a.step - b.step);
      this.currentStepData = sortedSteps[this.currentStep] || null;
    } else {
      this.currentStepData = null;
    }
  }

  nextStep() {
    if (this.currentStep < this.totalSteps - 1) {
      this.currentStep++;
      this.updateCurrentStepData();
    }
  }

  previousStep() {
    if (this.currentStep > 0) {
      this.currentStep--;
      this.updateCurrentStepData();
    }
  }

  finishRecipe() {
    // Navigate back to recipe detail or home
    if (this.recipe?.id) {
      this.router.navigate(['/private/recipe-detail', this.recipe.id]);
    } else {
      this.router.navigate(['/private/home']);
    }
  }

  goBack() {
    // Navigate back to recipe detail
    if (this.recipe?.id) {
      this.router.navigate(['/private/recipe-detail', this.recipe.id]);
    } else {
      this.router.navigate(['/private/home']);
    }
  }
}