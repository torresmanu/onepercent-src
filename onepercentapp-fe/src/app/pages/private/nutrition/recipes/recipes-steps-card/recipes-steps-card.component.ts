import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output,  } from '@angular/core';
import { IonItem, IonLabel, IonIcon } from "@ionic/angular/standalone";

@Component({
  selector: 'app-recipes-steps-card',
  standalone: true,
  imports: [IonIcon, IonLabel, IonItem, CommonModule ],
  templateUrl: './recipes-steps-card.component.html',
  styleUrls: ['./recipes-steps-card.component.scss'],
})
export class RecipesStepsCardComponent   {
  @Input() steps : any[] = [];
@Output() openModalStepRecipe = new EventEmitter<{ steps: any[], stepNumber: number }>();

openModalStepRecipes(steps: any, stepNumber: number) {
    this.openModalStepRecipe.emit({ steps: steps, stepNumber: stepNumber });
  }


}
