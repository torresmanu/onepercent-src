import { Component } from '@angular/core';
import { IonButton, IonIcon, IonRow, IonCol } from "@ionic/angular/standalone";

@Component({
  standalone: true,
  selector: 'app-date-progress',
  templateUrl: './date-progress.component.html',
  styleUrls: ['./date-progress.component.scss'],
  imports: [IonCol, IonRow, IonButton, IonIcon],
})
export class DateProgressComponent {
  currentDate: Date = new Date();

  previousDay() {
    this.currentDate.setDate(this.currentDate.getDate() - 1);
    this.currentDate = new Date(this.currentDate); 
  }

  nextDay() {
    this.currentDate.setDate(this.currentDate.getDate() + 1);
    this.currentDate = new Date(this.currentDate); 
  }

  getDayLabel(): string {
    return this.currentDate.toLocaleDateString('es-ES', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  }
}
