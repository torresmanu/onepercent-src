import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
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
  nutritionService = inject(NutritionService);
  ingredient: any;

  ngOnInit() {
    const index = Number(this.route.snapshot.paramMap.get('id'));
    this.ingredient = this.nutritionService.getIngredientByIndex(index);
    
    // Initialize with default values if not present
    if (!this.ingredient.quantity) {
      this.ingredient.quantity = 100;
    }
    if (!this.ingredient.unit) {
      this.ingredient.unit = 'Gramos';
    }
    if (!this.ingredient.kcal) {
      this.ingredient.kcal = 220;
    }
  }

  onQuantityChange() {
    // Recalculate calories based on quantity if needed
    // This could be expanded to update calories dynamically
  }

  onSaveChanges() {
    // Implement save logic here
    console.log('Saving ingredient changes:', this.ingredient);
    // Navigate back or show success message
  }
}