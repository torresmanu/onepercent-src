import {
  ChangeDetectionStrategy,
  Component,
  inject,
  Input,
  type OnInit,
} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import {
  IonContent,
  IonBackButton,
  IonButton,
  NavController,
  IonTitle,
  IonToolbar,
  IonHeader,
} from '@ionic/angular/standalone';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { StorageKey } from '@src/app/core/interfaces/storage';
import { StorageService } from '@src/app/services/storage.service';

@Component({
  selector: 'app-welcome-final',
  standalone: true,
  imports: [
    IonHeader,
    IonToolbar,
    IonTitle,
    IonButton,
    IonBackButton,
    IonContent,
    TranslateModule,
  ],
  templateUrl: './welcome-final.component.html',
  styleUrls: ['./welcome-final.component.scss'],
})
export class WelcomeFinalComponent implements OnInit {
  firstName: string = '';
  translate = inject(TranslateService);
  storageService = inject(StorageService);
  private readonly navCtrl = inject(NavController);


  ngOnInit(): void {
    this.getName();
  }

getName() {
  const registerForm = localStorage.getItem('registerform');
  if (registerForm) {
    const formData = JSON.parse(registerForm);
    console.log('Register Form from localStorage:', formData.firstname);
    this.firstName = formData.firstname || '';
  }
}

  continue() {
    this.navCtrl.navigateForward(['public/register-init']);
  }
}
