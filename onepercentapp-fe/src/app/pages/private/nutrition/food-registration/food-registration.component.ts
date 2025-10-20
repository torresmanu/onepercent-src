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

  get ingredients() {
    return this.nutritionService.getIngredients();
  }

  get canSave(): boolean {
    const hasTitle = !!this.selectedMealTitle;
    const hasIngredients = this.ingredients.length > 0;
    console.log('Can save check:', { hasTitle, hasIngredients, selectedMealTitle: this.selectedMealTitle, ingredientsLength: this.ingredients.length });
    return hasTitle && hasIngredients;
  }

  constructor() {}

  ngOnInit() {
    this.nutritionService.getFoodData().subscribe((data) => {
      this.meals = Array.isArray(data) ? data : Object.values(data);
    });
    this.loadRecentMeals();
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
    // Crear el ingrediente con valores por defecto
    const newIngredient = {
      id: ingredient.id,
      name: ingredient.name,
      quantity: 100,
      unit: 'gramos',
      kcal: ingredient.energy || 0,
      // Guardar datos adicionales del API
      energy: ingredient.energy,
      protein: ingredient.protein,
      carbs: ingredient.carbs,
      fat: ingredient.fat,
      ingredientGroup: ingredient.ingredientGroup
    };
    
    // Agregar el ingrediente a la lista
    this.nutritionService.getIngredients().push(newIngredient);
    
    // Obtener el índice del ingrediente recién agregado
    const index = this.nutritionService.getIngredients().length - 1;
    
    // Navegar a editar con el índice
    this.navCtrl.navigateForward(['/private/edit-ingredient', index]);
  }

  async saveMeal() {
    // Validar que hay ingredientes y comida seleccionada
    if (!this.selectedMealTitle || this.ingredients.length === 0) {
      await this.showToast('Por favor selecciona una comida y agrega al menos un ingrediente', 'warning');
      return;
    }

    const loading = await this.loadingCtrl.create({
      message: 'Guardando...'
    });
    await loading.present();

    // Preparar los datos para enviar al backend
    const mealData = {
      mealType: this.selectedMealTitle,
      ingredients: this.ingredients.map((ing: any) => ({
        id: ing.id,
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