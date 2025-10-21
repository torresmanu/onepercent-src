import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { HeaderComponent } from '@src/app/shared/components/header/header.component';
import { NutritionService } from 'src/app/services/nutrition.service';

@Component({
  standalone: true,
  imports: [
    IonicModule,
    TranslateModule,
    HeaderComponent,
    CommonModule,
    FormsModule,
  ],
  selector: 'app-edit-ingredient',
  templateUrl: './edit-ingredient.component.html',
  styleUrls: ['./edit-ingredient.component.scss'],
})
export class EditIngredientComponent implements OnInit {
  route = inject(ActivatedRoute);
  router = inject(Router);
  nutritionService = inject(NutritionService);
  ingredient: any;
  ingredientIndex: number = -1;
  isSaving: boolean = false;
  isNutritionExpanded: boolean = false;

  ngOnInit() {
    // Obtener el índice del ingrediente de la URL
    this.ingredientIndex = Number(this.route.snapshot.paramMap.get('id'));
    
    // Obtener el ingrediente del servicio por su índice
    this.ingredient = this.nutritionService.getIngredientByIndex(this.ingredientIndex);
    
    // Debug: Log ingredient data to see what's available
    console.log('Ingredient data:', this.ingredient);
    console.log('Ingredient fiber:', this.ingredient?.fiber);
    console.log('Ingredient sodium:', this.ingredient?.sodium);
    console.log('Ingredient sugar:', this.ingredient?.sugar);
    
    // Asegurar valores por defecto
    if (!this.ingredient) {
      // Si no existe, volver atrás
      this.router.navigate(['/private/food-registration']);
      return;
    }
    
    if (!this.ingredient.quantity) {
      this.ingredient.quantity = 100;
    }
    if (!this.ingredient.unit) {
      this.ingredient.unit = 'gramos';
    }
    if (!this.ingredient.kcal && this.ingredient.energy) {
      this.ingredient.kcal = this.ingredient.energy;
    }
  }

  onQuantityChange() {
    // Recalcular calorías basadas en la cantidad
    if (this.ingredient.energy && this.ingredient.quantity) {
      // Las calorías del API son por 100g, recalcular proporcionalmente
      this.ingredient.kcal = Math.round((this.ingredient.energy * this.ingredient.quantity) / 100);
    }
  }

  /**
   * Toggle nutritional information dropdown
   */
  toggleNutritionInfo() {
    this.isNutritionExpanded = !this.isNutritionExpanded;
  }

  /**
   * Calculate nutritional values based on ingredient quantity
   * Returns nutritional data scaled by the current quantity
   */
  getNutritionalData() {
    if (!this.ingredient) return null;

    const baseQuantity = 100; // Base quantity for nutritional values (per 100g)
    const currentQuantity = this.ingredient.quantity || 100;
    const scaleFactor = currentQuantity / baseQuantity;

    // Debug: Log specific nutritional values to see what's available
    console.log('Fiber value:', this.ingredient.fiber);
    console.log('Protein value:', this.ingredient.protein);
    console.log('Carbs value:', this.ingredient.carbs);
    console.log('Fat value:', this.ingredient.fat);
    console.log('Sodium value:', this.ingredient.sodium);
    console.log('Sugar value:', this.ingredient.sugar);
    console.log('Cholesterol value:', this.ingredient.cholesterol);
    console.log('Potassium value:', this.ingredient.potassium);
    console.log('Scale factor:', scaleFactor);
    console.log('Current quantity:', currentQuantity);

    const nutritionalData = {
      calories: Math.round((this.ingredient.energy || 0) * scaleFactor),
      protein: Math.round((this.ingredient.protein || 0) * scaleFactor * 10) / 10,
      carbs: Math.round((this.ingredient.carbs || 0) * scaleFactor * 10) / 10,
      fat: Math.round((this.ingredient.fat || 0) * scaleFactor * 10) / 10,
      fiber: Math.round((this.ingredient.fiber || 0) * scaleFactor * 10) / 10,
      // Additional nutritional values - using exact property names from the data
      sugars: Math.round((this.ingredient.sugar || 0) * scaleFactor * 10) / 10,
      saturatedFat: Math.round((this.ingredient.saturatedFat || 0) * scaleFactor * 10) / 10,
      unsaturatedFat: Math.round((this.ingredient.nonSaturatedFat || 0) * scaleFactor * 10) / 10,
      sodium: Math.round((this.ingredient.sodium || 0) * scaleFactor),
      potassium: Math.round((this.ingredient.potassium || 0) * scaleFactor),
      cholesterol: Math.round((this.ingredient.cholesterol || 0) * scaleFactor)
    };

    // Debug: Log calculated values
    console.log('Calculated fiber:', nutritionalData.fiber);
    console.log('Calculated sodium:', nutritionalData.sodium);
    console.log('Calculated sugars:', nutritionalData.sugars);
    console.log('Full nutritional data:', nutritionalData);

    return nutritionalData;
  }

  async onSaveChanges() {
    this.isSaving = true;
    
    // Simular un pequeño delay para mostrar el spinner (opcional)
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Actualizar el ingrediente en el array del servicio
    if (this.ingredientIndex >= 0) {
      // Si estamos editando un ingrediente existente
      const ingredients = this.nutritionService.getIngredients();
      if (ingredients[this.ingredientIndex]) {
        ingredients[this.ingredientIndex] = { ...this.ingredient };
      }
    }
    
    this.isSaving = false;
    
    // Navegar de vuelta a la página de registro de comida
    this.router.navigate(['/private/food-registration']);
  }
}