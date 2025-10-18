import { Component, inject, OnInit } from '@angular/core';
import {
  IonButton,
  IonContent,
  IonIcon,
  NavController,
} from '@ionic/angular/standalone';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-comparasion-of-plans',
  standalone: true,
  imports: [IonButton, IonContent, IonIcon, TranslateModule],
  templateUrl: './comparasion-of-plans.component.html',
  styleUrls: ['./comparasion-of-plans.component.scss'],
})
export class ComparasionOfPlansComponent {
  private readonly navCtrl = inject(NavController);
  translate = inject(TranslateModule);

  constructor() {}

  goToHome() {
    this.navCtrl.navigateForward(['private/home']);
  }

  goToChoicePlan() {
    this.navCtrl.navigateForward(['private/choice-plans']);
  }
}
