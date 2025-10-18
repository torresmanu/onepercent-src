import { Component, inject, OnInit } from '@angular/core';
import { IonContent, IonButton, NavController} from "@ionic/angular/standalone";
import { AuthService } from 'src/app/services/auth/auth.service';

@Component({
  standalone: true,
  imports: [IonButton, IonContent, ],
  selector: 'app-confirm-logout',
  templateUrl: './confirm-logout.component.html',
  styleUrls: ['./confirm-logout.component.scss'],
})
export class ConfirmLogoutComponent  implements OnInit {
authService = inject(AuthService);
navCtrl = inject(NavController);
  constructor() { }

  ngOnInit() {}


  confirmLogout() {

    // Aquí puedes implementar la lógica para confirmar el cierre de sesión
    console.log('Cierre de sesión confirmado');
     this.authService.logout();
    this.navCtrl.navigateRoot('/public/login');


  }
}
