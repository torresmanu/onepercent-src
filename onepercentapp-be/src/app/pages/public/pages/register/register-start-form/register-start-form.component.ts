import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  Input,
  type OnInit,
} from '@angular/core';
import {
  IonContent,
  IonBackButton,
  IonButton,
  NavController,
} from '@ionic/angular/standalone';
import { LogoComponent } from '../../../../../shared/components/logo/logo.component';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-regiter-start-form',
  standalone: true,
  imports: [IonButton, 
    IonBackButton, 
    IonContent, 
    CommonModule, 
    LogoComponent,
    TranslateModule,
  ],

  templateUrl: './register-start-form.component.html',
  styleUrls: ['./register-start-form.component.scss'],
})
export class RegiterStartFormComponent implements OnInit {
  name: string = '';
  private readonly navCtrl = inject(NavController);

  ngOnInit(): void {}

  continue() {
    this.navCtrl.navigateForward(['public/init-form']);
  }
}
