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

  ngOnInit() {
    // Obtener el índice del ingrediente de la URL
    this.ingredientIndex = Number(this.route.snapshot.paramMap.get('id'));
    
    // Obtener el ingrediente del servicio por su índice
    this.ingredient = this.nutritionService.getIngredientByIndex(this.ingredientIndex);
    
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