import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { IonItem, IonLabel, IonIcon } from "@ionic/angular/standalone";

@Component({
  selector: 'app-recipes-steps-card',
  standalone: true,
  imports: [IonIcon, IonLabel, IonItem, CommonModule ],
  templateUrl: './recipes-steps-card.component.html',
  styleUrls: ['./recipes-steps-card.component.scss'],
})
export class RecipesStepsCardComponent implements OnInit {
  @Input() steps : any[] = [];
  @Output() openModalStepRecipe = new EventEmitter<{ steps: any[], stepNumber: number }>();

  ngOnInit() {
    console.log('Steps received in component:', this.steps);
    this.steps.forEach((step, index) => {
      console.log(`Step ${index}:`, step);
    });
  }

  openModalStepRecipes(steps: any, stepNumber: number) {
    this.openModalStepRecipe.emit({ steps: steps, stepNumber: stepNumber });
  }


}
