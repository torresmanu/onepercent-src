import { Component, inject, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth/auth.service';
import { HeaderComponent } from "../../../../shared/components/header/header.component";
import { IonContent, IonButton, IonSkeletonText, IonText,NavController } from "@ionic/angular/standalone";
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-log-out',
  imports: [IonText, IonSkeletonText, IonButton, IonContent, HeaderComponent,TranslateModule],
  standalone: true,
  templateUrl: './log-out.component.html',
  styleUrls: ['./log-out.component.scss'],
})
export class LogOutComponent  implements OnInit {

authService = inject(AuthService);
  navCtrl = inject(NavController);
  tranaslate = inject(TranslateModule);

  constructor(
  ) { }

  ngOnInit() {}

  logOut() {
    this.navCtrl.navigateForward('/private/profile/confirmLogout');
  }
  goBack() {
    console.log('Volviendo a la página anterior...');

  }

}
