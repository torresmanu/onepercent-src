import { Component, OnInit } from '@angular/core';
import { IonIcon } from "@ionic/angular/standalone";

@Component({
  selector: 'app-register-activity-card',
  standalone: true,
  imports: [IonIcon, ],
  templateUrl: './register-activity-card.component.html',
  styleUrls: ['./register-activity-card.component.scss'],
})
export class RegisterActivityCardComponent  implements OnInit {

  constructor() { }

  ngOnInit() {}

}
