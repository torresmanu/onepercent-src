import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  NgModule,
  OnInit,
} from '@angular/core';
import {
  IonContent,
  IonBackButton,
  IonButton,
  NavController,
} from '@ionic/angular/standalone';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
@Component({
  selector: 'app-regiter-infoinit',
  standalone: true,
  imports: [IonBackButton, IonContent, IonButton, CommonModule, TranslateModule],
  templateUrl: './register-infoinit.component.html',
  styleUrls: ['./register-infoinit.component.scss'],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class RegiterInfoinitComponent implements OnInit {
  name: string = '';
  discover: boolean = false;

  private readonly navCtrl = inject(NavController);
  slides = [
    {
      image: 'assets/imgs/registerInit1.jpg',
      control: false,
      textBefore: 'Definir algo como saludable ',
      highlight: 'no es sencillo.',
    },
    {
      image: 'assets/imgs/registerInit2.png',
      control: false,
      textBefore: 'Cada cuerpo es ',
      highlight: 'diferente,',
      textAfter: 'pero hay una serie de',
      highlight2: 'hábitos',
      textAfter2: 'comunes que contribuyen a estar',
      highlight3: 'más sano.',
    },
    {
      image: 'assets/imgs/registerInit3.jpg',
      control: true,
      textBefore: 'Por eso, ',
      highlight: 'onepercent',
      textAfter: ' se basa en la',
      highlight2: 'evidencia científica',
      textAfter2: 'y en las recomendaciones de los',
      highlight3: 'expertos de la salud.',
    },
  ];

  ngOnInit(): void {}

  continue() {
    this.navCtrl.navigateForward(['public/registerFormStart']);
  }
}
