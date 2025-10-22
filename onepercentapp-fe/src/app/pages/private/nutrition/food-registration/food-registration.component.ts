import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormControl, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { IonicModule, NavController } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { HeaderComponent } from 'src/app/shared/components/header/header.component';
import { IngredientAutocompleteComponent } from 'src/app/shared/components/ingredient-autocomplete/ingredient-autocomplete.component';
import { SelectMealModalComponent } from 'src/app/shared/components/select-meal-modal/select-meal-modal.component';
import { ModalService } from '@src/app/services/modal.service';
import { NutritionService } from 'src/app/services/nutrition.service';
import { CommonModule } from '@angular/common';
import { signal } from '@angular/core';
import { LoadingController, ToastController } from '@ionic/angular';

@Component({
  standalone: true,
  imports: [
    IonicModule,
    TranslateModule,
    HeaderComponent,
    ReactiveFormsModule,
    FormsModule,
    IngredientAutocompleteComponent,
    CommonModule,
  ],
  selector: 'app-food-registration',
  templateUrl: './food-registration.component.html',
  styleUrls: ['./food-registration.component.scss'],
})
export class FoodRegistrationComponent implements OnInit {
  foodInputControl = new FormControl('', Validators.required);
  modalService = inject(ModalService);
  nutritionService = inject(NutritionService);
  navCtrl = inject(NavController);
  loadingCtrl = inject(LoadingController);
  toastCtrl = inject(ToastController);
  cdr = inject(ChangeDetectorRef);

  selectedMealTitle: string | null = null;
  meals: any[] = [];
  recentMeals: any[] = [];
  selectedTab = signal<string>('registrando');
  selectedRecentMealIndex: number | null = null;

  get ingredients() {
    return this.nutritionService.getIngredients();
  }

  get canSave(): boolean {
    const hasTitle = !!this.selectedMealTitle;
    const hasIngredients = this.ingredients.length > 0;
    const hasSelectedRecentMeal = this.selectedTab() === 'recientes' && this.selectedRecentMealIndex !== null && hasTitle;
    return (hasTitle && hasIngredients) || hasSelectedRecentMeal;
  }

  /**
   * Calculate total calories from all ingredients
   */
  getTotalKcal(): number {
    return this.ingredients.reduce((total, ingredient) => {
      return total + (ingredient.kcal || 0);
    }, 0);
  }

  /**
   * Calculate nutritional score based on ingredients
   * Returns a score from 1-4 based on nutritional quality
   */
  getNutritionalScore(): number {
    if (this.ingredients.length === 0) return 0;

    let score = 0;
    let totalWeight = 0;

    this.ingredients.forEach(ingredient => {
      const weight = ingredient.quantity || 0;
      totalWeight += weight;

      // Calculate individual ingredient score based on nutritional values
      let ingredientScore = 1; // Base score

      // Protein content bonus (good protein sources get higher score)
      if (ingredient.protein && ingredient.protein > 10) {
        ingredientScore += 0.5;
      }

      // Fiber content bonus
      if (ingredient.fiber && ingredient.fiber > 3) {
        ingredientScore += 0.5;
      }

      // Low saturated fat bonus
      if (ingredient.fat && ingredient.fat < 5) {
        ingredientScore += 0.3;
      }

      // Energy density consideration (lower is better for most foods)
      const energyDensity = (ingredient.kcal || 0) / (weight || 1);
      if (energyDensity < 2) {
        ingredientScore += 0.2;
      }

      score += ingredientScore * weight;
    });

    // Normalize score to 1-4 range
    const normalizedScore = totalWeight > 0 ? (score / totalWeight) : 0;
    return Math.min(4, Math.max(1, Math.round(normalizedScore)));
  }


  constructor() {}

  ngOnInit() {
    this.nutritionService.getFoodData().subscribe((data) => {
      this.meals = Array.isArray(data) ? data : Object.values(data);
    });
    this.loadRecentMeals();

    // Check if navigating from recipe detail with pre-selected meal type
    const navigation = this.navCtrl['router']?.getCurrentNavigation();
    if (navigation?.extras?.state) {
      const state = navigation.extras.state;
      if (state['preSelectedMealType']) {
        this.selectedMealTitle = state['preSelectedMealType'];
        console.log('Pre-selected meal type from recipe:', this.selectedMealTitle);
      }
    }
  }

  loadRecentMeals() {
    this.nutritionService.getUserMeals().subscribe({
      next: (meals) => {
        this.recentMeals = meals;
      },
      error: (error) => {
        console.error('Error al cargar meals recientes:', error);
      }
    });
  }

  changeTab(event: any) {
    this.selectedTab.set(event.detail.value);
  }

  async openSelectMealModal() {
    await this.modalService.presentMediumModal(
      SelectMealModalComponent,
      {
        title: 'Escoge la comida',
        confirmButtonText: 'Aceptar',
        cancelButtonText: 'Cancelar',
      }
    ).then((result) => {
      console.log('Modal result:', result);
      if (result.role === 'confirm' && result.data !== null && result.data !== undefined) {
        console.log('Selected meal index:', result.data);
        console.log('Meals array:', this.meals);
        this.selectedMealTitle = this.meals[result.data]?.title ?? null;
        console.log('Selected meal title:', this.selectedMealTitle);
        // Forzar detección de cambios
        this.cdr.detectChanges();
      }
    });
  }

  editIngredient(index: number) {
    this.navCtrl.navigateForward(['/private/edit-ingredient', index]);
  }

  removeIngredient(index: number) {
    this.nutritionService.getIngredients().splice(index, 1);
  }

  onIngredientSelected(ingredient: any) {
    // Crear el ingrediente con valores por defecto y TODOS los datos nutricionales
    const newIngredient = {
      id: ingredient.id,
      name: ingredient.name,
      quantity: 100,
      unit: 'gramos',
      kcal: ingredient.energy || 0,
      // Guardar TODOS los datos nutricionales del API
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
    
    // Agregar el ingrediente a la lista
    this.nutritionService.getIngredients().push(newIngredient);
    
    // Obtener el índice del ingrediente recién agregado
    const index = this.nutritionService.getIngredients().length - 1;
    
    // Navegar a editar con el índice
    this.navCtrl.navigateForward(['/private/edit-ingredient', index]);
  }

  selectRecentMeal(index: number) {
    // Toggle selection - if clicking the same meal, deselect it
    if (this.selectedRecentMealIndex === index) {
      this.selectedRecentMealIndex = null;
      this.selectedMealTitle = null;
    } else {
      this.selectedRecentMealIndex = index;
      this.selectedMealTitle = this.recentMeals[index].mealType;
    }
  }

  isRecentMealSelected(index: number): boolean {
    return this.selectedRecentMealIndex === index;
  }

  async saveMeal() {
    // Validar que hay un tipo de comida seleccionado
    if (!this.selectedMealTitle) {
      await this.showToast('Por favor selecciona una comida', 'warning');
      return;
    }

    // Determinar qué ingredientes usar
    let ingredientsToSave: any[] = [];
    
    // Si estamos en la pestaña de recientes y hay una comida seleccionada
    if (this.selectedTab() === 'recientes' && this.selectedRecentMealIndex !== null) {
      const selectedMeal = this.recentMeals[this.selectedRecentMealIndex];
      if (!selectedMeal || !selectedMeal.ingredients || selectedMeal.ingredients.length === 0) {
        await this.showToast('La comida seleccionada no tiene ingredientes', 'warning');
        return;
      }
      ingredientsToSave = selectedMeal.ingredients;
    } else {
      // Validar que hay ingredientes
      if (this.ingredients.length === 0) {
        await this.showToast('Por favor agrega al menos un ingrediente', 'warning');
        return;
      }
      ingredientsToSave = this.ingredients;
    }

    const loading = await this.loadingCtrl.create({
      message: 'Guardando...'
    });
    await loading.present();

    // Preparar los datos para enviar al backend
    const mealData = {
      mealType: this.selectedMealTitle,
      ingredients: ingredientsToSave.map((ing: any) => ({
        id: ing.ingredient?.id || ing.id,
        quantity: ing.quantity,
        unit: ing.unit,
        kcal: ing.kcal
      }))
    };

    this.nutritionService.saveMealRecord(mealData).subscribe({
      next: async (response) => {
        await loading.dismiss();
        await this.showToast('Comida registrada exitosamente', 'success');
        
        // Limpiar los ingredientes después de guardar
        this.nutritionService.getIngredients().length = 0;
        this.selectedMealTitle = null;
        this.selectedRecentMealIndex = null;
        
        // Recargar las meals recientes
        this.loadRecentMeals();
        
        // Navegar de regreso a la pantalla de nutrición
        this.navCtrl.navigateBack('/private/nutrition');
      },
      error: async (error) => {
        await loading.dismiss();
        console.error('Error al guardar comida:', error);
        await this.showToast('Error al guardar la comida. Por favor intenta de nuevo.', 'danger');
      }
    });
  }

  private async showToast(message: string, color: string) {
    const toast = await this.toastCtrl.create({
      message,
      duration: 3000,
      position: 'bottom',
      color
    });
    await toast.present();
  }
}