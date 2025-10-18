import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { IonItem, IonLabel } from "@ionic/angular/standalone";

@Component({
  selector: 'app-recipes-ingredients-card',
  standalone: true,
  imports: [IonLabel, IonItem,CommonModule ],
  templateUrl: './recipes-ingredients-card.component.html',
  styleUrls: ['./recipes-ingredients-card.component.scss'],
})
export class RecipesIngredientsCardComponent   {

  @Input() ingredients: any[] = [];
  @Input() portion: number = 0;

}
