import { Component, OnInit, inject } from '@angular/core';
import { IonIcon, NavController } from "@ionic/angular/standalone";

@Component({
  selector: 'app-register-activity-card',
  standalone: true,
  imports: [IonIcon, ],
  templateUrl: './register-activity-card.component.html',
  styleUrls: ['./register-activity-card.component.scss'],
})
export class RegisterActivityCardComponent  implements OnInit {
  navCtrl = inject(NavController);

  constructor() { }

  ngOnInit() {}

  onRegisterActivity() {
    this.navCtrl.navigateForward(['/private/activity-registration']);
  }
}
