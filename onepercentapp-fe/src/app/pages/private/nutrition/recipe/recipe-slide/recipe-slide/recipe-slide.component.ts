import { CommonModule } from '@angular/common';
import {
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  Input,
  OnInit,
} from '@angular/core';
import { Recipe } from '@src/app/core/interfaces/recipe';
import {
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardSubtitle,
} from '@ionic/angular/standalone';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-recipe-slide',
  standalone: true,
  templateUrl: './recipe-slide.component.html',
  styleUrls: [
    './recipe-slide.component.css',
    '../../../nutrition.component.scss',
  ],
  imports: [
    IonCardSubtitle,
    IonCardTitle,
    CommonModule,
    IonCardHeader,
    IonCard,
    RouterLink,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class RecipeSlideComponent implements OnInit {
  @Input() recipe!: Recipe;
  points: number = 0;
  constructor() {}

  ngOnInit() {
    this.points = 4 - (this.recipe.value || 0);
  }
}
