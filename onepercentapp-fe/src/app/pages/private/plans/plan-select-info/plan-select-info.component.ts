import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, NgModule, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IonContent, IonBackButton, IonButton, NavController } from "@ionic/angular/standalone";
import { SwiperModule } from 'swiper/types';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { text } from 'ionicons/icons';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  standalone: true,
  imports: [ IonBackButton, 
    IonContent, 
    IonButton, 
    CommonModule, 
    TranslateModule
  ],
  selector: 'app-plan-select-info',
  templateUrl: './plan-select-info.component.html',
  styleUrls: ['./plan-select-info.component.scss'],
  schemas: [CUSTOM_ELEMENTS_SCHEMA], 

})
export class PlanSelectInfoComponent  implements OnInit {
 name: string = '';
  discover: boolean = false;

  private route = inject(ActivatedRoute);
  private readonly navCtrl = inject(NavController);
slides = [
  {
    image: 'assets/imgs/planSelector1.jpg',
    control: false,
    textImage:1,
    textBefore: 'Hemos creado un plan',
    highlight: 'para ti',
    textBefore2: 'No es un programa para bajar de peso o sacar músculo. Es un programa',
    highlight2: 'para cuidar tu salud.',
  },
  {
    image: 'assets/imgs/planSelector2.jpg',
    control: false,
    textImage:1,
    textBefore: 'Pon la ciencia',
    highlight: 'de tu lado',
    textBefore2: 'No hay más trucos.',
    textBefore3: 'Sigue los objetivos esenciales que dice la ciencia ',
    highlight3: 'para cuidarte.',
  },
  {
    image: 'assets/imgs/planSelector3.jpg',
    control: false,
    textImage:1,

    textBefore: 'Todo pensado ',
    highlight: 'para tu salud',
    textBefore2: 'Entrenos únicos.',
    textBefore3: 'Recetas eficientes.',
    highlight4: 'Entrena',
    textBefore4: 'con un método innovador.',
    highlight5: 'Cocina',
    textBefore5: 'sin perder tiempo ni sabor.',
  },
    {
    image: 'assets/imgs/planSelector4.jpg',
    control: true,
    textImage:2,

    textBefore: 'Inteligencia',
    highlight: 'saludable',
    textBefore6: 'Inteligencia artificial,',
    textBefore7: 'Inteligencia saludable.',
    textBefore8: 'Fotografía tu nevera y obtén recetas o encuentra entrenos ',
    highlight6: 'según tu estado',
    textBefore9: ' con la IA.',
  }
];
  ngOnInit(): void {
    // Obtiene el nombre de los parámetros de consulta
    this.route.queryParams.subscribe(params => {
      if (params['name']) {
        this.name = params['name'];
      }
    });
  }

  continue() {
    this.navCtrl.navigateForward(['private/free-plan-paywall']);
  }
}