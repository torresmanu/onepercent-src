import { Component, OnInit } from '@angular/core';
import { IonCard, IonButton, IonIcon } from "@ionic/angular/standalone";

@Component({
  selector: 'app-today-pill-card',
  standalone: true,
  imports: [IonIcon, IonButton, IonCard, 
  ],
  templateUrl: './today-pill-card.component.html',
  styleUrls: ['./today-pill-card.component.scss'],
})
export class TodayPillCardComponent  implements OnInit {

  constructor() { }

  ngOnInit() {}

}
