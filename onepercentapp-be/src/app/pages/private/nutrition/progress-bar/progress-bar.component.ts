import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { IonContent, IonProgressBar } from "@ionic/angular/standalone";
import { TranslateModule } from '@ngx-translate/core';

@Component({
  standalone: true,
  imports: [IonProgressBar, 
    CommonModule,
    TranslateModule,
  ],
  selector: 'app-progress-bar',
  templateUrl: './progress-bar.component.html',
  styleUrls: ['./progress-bar.component.scss'],
})
export class ProgressBarComponent  implements OnInit {

  @Input() puntos: number = 0;

  get progress(): number {
  return Math.min(this.puntos / 600, 1);
}

  constructor() { }

  ngOnInit() {}

}
