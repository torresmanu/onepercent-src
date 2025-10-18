import { Component, OnInit } from '@angular/core';
import { IonCardHeader, IonCard, IonCardTitle, IonCardContent, IonProgressBar, IonCol, IonRow } from "@ionic/angular/standalone";

@Component({
  selector: 'app-today-progress-card',
  standalone: true,
  imports: [IonRow, IonCol, IonProgressBar, IonCardContent, IonCardTitle, IonCard, IonCardHeader, 
  ],
  templateUrl: './today-progress-card.component.html',
  styleUrls: ['./today-progress-card.component.scss'],
})
export class TodayProgressCardComponent  implements OnInit {

  ngOnInit() {}

}
