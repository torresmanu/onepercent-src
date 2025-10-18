import { Component, effect, Input, OnInit } from '@angular/core';
import { Recipe } from '@src/app/core/interfaces/recipe';
import {
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardSubtitle,
  IonCol,
  IonRow,
} from '@ionic/angular/standalone';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-recipe-search',
  standalone: true,
  templateUrl: './recipe-search.component.html',
  styleUrls: ['./recipe-search.component.scss'],
  imports: [
    IonRow,
    IonCol,
    IonCardSubtitle,
    IonCardTitle,
    CommonModule,
    IonCardHeader,
    IonCard,
  ],
})
export class RecipeSearchComponent implements OnInit {
  @Input() recipes!: Recipe[];
  points: number = 0;
  constructor() {
    effect(() => {
      // This effect will run whenever the recipes input changes
      console.log('Recipes updated:', this.recipes);
    });
  }

  ngOnInit() {}
}
