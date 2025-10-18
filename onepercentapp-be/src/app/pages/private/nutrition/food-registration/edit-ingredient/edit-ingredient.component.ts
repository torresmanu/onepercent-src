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
  isFavorited = false;
  animateHeart = false;

  ngOnInit() {
    const index = Number(this.route.snapshot.paramMap.get('id'));
    this.ingredient = this.nutritionService.getIngredientByIndex(index);
  }

  toggleFavorite() {
    this.isFavorited = !this.isFavorited;
    this.animateHeart = true;

    setTimeout(() => {
      this.animateHeart = false;
    }, 300);
  }
}