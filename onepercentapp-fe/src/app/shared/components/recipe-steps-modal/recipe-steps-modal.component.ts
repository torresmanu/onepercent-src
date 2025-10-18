import { CommonModule } from '@angular/common';
import { Component, inject, Input, OnInit } from '@angular/core';
import {
  IonHeader,
  IonToolbar,
  IonButtons,
  IonTitle,
  IonButton,
  IonContent,
  IonIcon,
} from '@ionic/angular/standalone';
import { ModalController } from '@ionic/angular/standalone';

@Component({
  selector: 'app-recipe-steps',
  standalone: true,
  imports: [
    IonIcon,
    IonContent,
    IonButton,
    IonTitle,
    IonButtons,
    IonToolbar,
    IonHeader,
    CommonModule,
  ],
  templateUrl: './recipe-steps-modal.component.html',
  styleUrls: ['./recipe-steps-modal.component.scss'],
})
export class RecipeStepsComponent implements OnInit {
  @Input() steps: any[] = [];
  @Input() stepNumber?: number;
  @Input() backgroundColor?: string ;
  @Input() textColor?: string;
  @Input() recipe?: any;
  @Input() buttonTypes?: boolean;

  currentStep: number = 0;

  private readonly modalController = inject(ModalController);

  ngOnInit() {
    this.currentStep = this.stepNumber ?? 0;

    console.log(
      'RecipeStepsComponent initialized with steps:',
      this.steps,
      'and stepNumber:',
      this.stepNumber,
      'backgroundColor:',
      this.backgroundColor,
      'textColor:',
      this.textColor,
      'buttonType:',
      this.buttonTypes
    );
  }

  nextStep() {
    console.log('Current step before increment:', this.currentStep);
    if (this.currentStep < this.steps.length) {
      this.currentStep++;
    }
  }

  prevStep() {
    console.log('Current step before increment:', this.currentStep);
    if (this.currentStep > 0) {
      this.currentStep--;
    }
  }

  closeModal() {
    // Logic to close the modal
    this.modalController.dismiss({ data: 'some data' }, 'close');
  }
}
