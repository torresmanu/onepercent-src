import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output, inject } from '@angular/core';
import { IonRadio, IonRadioGroup } from '@ionic/angular/standalone';
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
    IonRadio,
    IonRadioGroup,
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
    });
  }
}