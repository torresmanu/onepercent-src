import { Component, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { IonContent, IonButton } from '@ionic/angular/standalone';
import { IonicModule } from '@ionic/angular';
import { MealSelectorComponent } from './meal-selector/meal-selector.component';
import { TranslateModule } from '@ngx-translate/core';


@Component({
  standalone: true,
  selector: 'app-select-meal-modal',
  templateUrl: './select-meal-modal.component.html',
  styleUrls: ['./select-meal-modal.component.scss'],
  imports: [
    IonicModule,
    MealSelectorComponent,
    TranslateModule,
  ],
})
export class SelectMealModalComponent {

  @Input() title!: string;
  @Input() confirmButtonText!: string;


  selected: number | null = null;

  constructor(private modalController: ModalController) { }

  onSelectionChange(selected: number | null) {
    this.selected = selected;
  }


  confirm() {
    this.modalController.dismiss(this.selected, 'confirm');
    console.log('Selected meal ID:', this.selected);
  }


}
