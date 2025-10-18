import { Component, Input, OnInit } from '@angular/core';
import {  IonProgressBar, IonRow, IonCol } from "@ionic/angular/standalone";
@Component({
  standalone: true,
  selector: 'app-weekly-progress-bar',
  templateUrl: './weekly-progress-bar.component.html',
  styleUrls: ['./weekly-progress-bar.component.css'],
  imports: [IonCol, IonRow, IonProgressBar]
})
export class WeeklyProgressBarComponent implements OnInit {
  @Input() puntos: number = 0;

  get progress(): number {
    return Math.min(this.puntos / 600, 1);
  }
  constructor() { }

  ngOnInit() {
    console.log('WeeklyProgressBarComponent initialized');
  }

}
