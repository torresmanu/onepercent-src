import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output, inject } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { NutritionService } from 'src/app/services/nutrition.service';

@Component({
  standalone: true,
  selector: 'app-meal-selector',
  templateUrl: './meal-selector.component.html',
  styleUrls: ['./meal-selector.component.scss'],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
  ],
})
export class MealSelectorComponent {
  private nutritionService = inject(NutritionService);

  meals: any[] = [];
  selectedIndex: number | null = null;

  @Output() selectionChange = new EventEmitter<number | null>();

  constructor() {
    this.nutritionService.getFoodData().subscribe((data) => {
      this.meals = Array.isArray(data) ? data : Object.values(data);
      console.log('Meals loaded in selector:', this.meals);
    });
  }

  selectMeal(index: number) {
    console.log('Meal card clicked, selecting index:', index);
    this.selectedIndex = index;
    this.onMealChange();
  }

  onMealChange() {
    console.log('Meal changed to:', this.selectedIndex);
    this.selectionChange.emit(this.selectedIndex);
  }
}