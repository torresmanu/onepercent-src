import { Component, inject } from '@angular/core';
import { IonButton, IonContent, IonIcon, NavController } from '@ionic/angular/standalone';
import { TranslateModule } from '@ngx-translate/core';
import { trailSign } from 'ionicons/icons';
import { StorageKey } from 'src/app/core/interfaces/storage';
import { StorageService } from 'src/app/services/storage.service';
import { User } from 'src/app/core/interfaces/user';


@Component({
  selector: 'app-free-plan-pay-wall',
  standalone:true,
  imports:[IonButton, IonContent, TranslateModule],
  templateUrl: './free-plan-pay-wall.component.html',
  styleUrls: ['./free-plan-pay-wall.component.scss'],
})
export class FreePlanPayWallComponent {

  navCtrl = inject(NavController);
  translate = inject(TranslateModule);
  storageService = inject(StorageService);

  username:string = '';

  constructor() { }

   ngOnInit() {
    // Aquí puedes implementar la lógica que necesites al inicializar el componente
    this.storageService.get(StorageKey.userData).subscribe((userData) => {
      const user = userData as User;
      if (user) {
        // Aquí puedes manejar los datos del usuario si es necesario
        console.log('User Data:', user);
        this.username = user.firstname || 'Usuario'; // Asigna un nombre por defecto si no hay nombre
      }
    });
  }


  goToplanComparaison() {
    // Aquí puedes implementar la lógica para redirigir al usuario a la página de comparación de planes
    this.navCtrl.navigateForward('/private/comparasion-of-plans');
  }

  goToHome() {
    // Aquí puedes implementar la lógica para redirigir al usuario a la página de inicio
    this.navCtrl.navigateForward('/private/choice-plans');
  }
}
