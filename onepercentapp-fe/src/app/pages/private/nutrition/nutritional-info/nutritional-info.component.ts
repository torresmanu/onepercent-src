import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NavController } from '@ionic/angular';
import { CommonModule, Location } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { RecipeService } from '@src/app/services/recipe.service';

@Component({
  selector: 'app-nutritional-info',
  standalone: true,
  imports: [CommonModule, IonicModule],
  templateUrl: './nutritional-info.component.html',
  styleUrls: ['./nutritional-info.component.scss']
})
export class NutritionalInfoComponent implements OnInit {
  recipe: any = {};
  nutritionalData: any = {};

  private readonly navCtrl = inject(NavController);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly recipeService = inject(RecipeService);
  private readonly location = inject(Location);

  ngOnInit() {
    const idParam = this.route.snapshot.paramMap.get('id');
    const id = idParam ? Number(idParam) : NaN;
    
    if (!isNaN(id)) {
      this.recipeService.getRecipeById(id).subscribe({
        next: (data) => {
          this.recipe = data;
          this.loadNutritionalData();
        },
        error: () => {
          this.navCtrl.navigateBack('/private/nutrition/recipe-library');
        },
      });
    } else {
      this.navCtrl.navigateBack('/private/nutrition/recipe-library');
    }
  }

  loadNutritionalData() {
    // Process real nutritional data from recipeNutritionalInfos
    const nutritionalInfos = this.recipe.recipeNutritionalInfos || [];
    
    this.nutritionalData = {
      calories: this.recipe.kcal || 0,
      carbohydrates: {
        fiber: this.getNutritionalValueFromArray(nutritionalInfos, 'Fibra'),
        sugars: this.getNutritionalValueFromArray(nutritionalInfos, 'Azúcares')
      },
      proteins: this.getNutritionalValueFromArray(nutritionalInfos, 'Proteínas'),
      fats: {
        saturated: this.getNutritionalValueFromArray(nutritionalInfos, 'Grasas saturadas'),
        unsaturated: this.getNutritionalValueFromArray(nutritionalInfos, 'Grasas no saturadas')
      },
      other: {
        cholesterol: 0, // Not available in the data
        potassium: this.getNutritionalValueFromArray(nutritionalInfos, 'Potasio (mg)'),
        sodium: this.getNutritionalValueFromArray(nutritionalInfos, 'Sodio (mg)')
      }
    };
  }

  private getNutritionalValueFromArray(nutritionalInfos: any[], name: string): number {
    const item = nutritionalInfos.find((info: any) => info.name === name);
    return item ? item.value : 0;
  }

  getNutritionalValue(name: string): number {
    const nutritionalInfos = this.recipe?.recipeNutritionalInfos || [];
    const item = nutritionalInfos.find((info: any) => info.name === name);
    return item ? item.value : 0;
  }

  goBack() {
    this.location.back();
  }

  toggleFavorite() {
    // TODO: Implement favorite functionality
  }
}
