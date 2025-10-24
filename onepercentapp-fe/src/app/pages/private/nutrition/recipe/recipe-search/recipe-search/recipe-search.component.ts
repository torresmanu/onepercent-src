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
      // Component will automatically re-render when recipes change
    });
  }

  ngOnInit() {}

  getMealTimeDisplayName(section: string | undefined): string {
    if (!section) return '';
    
    const titleMap: { [key: string]: string } = {
      'Breakfast': 'Desayuno',
      'Lunch': 'Comida',
      'Dinner': 'Cena',
      'Snacks': 'Snack'
    };
    
    return titleMap[section] || section;
  }

  getDietTypeDisplay(description: any): string {
    // If description is an array, get the first element
    if (Array.isArray(description)) {
      return description[0] || '';
    }
    
    // If description is a string, return it
    if (typeof description === 'string') {
      return description;
    }
    
    // Fallback
    return '';
  }
}
