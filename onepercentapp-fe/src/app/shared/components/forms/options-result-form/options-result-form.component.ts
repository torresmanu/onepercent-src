import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter, inject } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import {
  IonHeader,
  IonToolbar,
  IonButtons,
  IonIcon,
  NavController,
  IonButton,
} from '@ionic/angular/standalone';
import { OptionsResultCardComponent } from '../options-result-card/options-result-card.component';

/*
====================================================================================
COMPONENTE: OptionsResultFormComponent (app-options-result-form)
====================================================================================

Descripción general:
--------------------
Componente de resultados paso a paso para formularios tipo stepper. Permite mostrar resultados, metas y acciones por paso, con soporte para selección, navegación y visualización de tarjetas de resultado.

Inputs:
-------
- stepsConfig: configuración de los pasos/resultados.
- stepNumber: índice del paso actual.
- showLoader: controla la visualización del loader.

Outputs:
--------
- continue: evento emitido al pulsar continuar.
- deny: evento emitido al pulsar el botón de denegar/rechazar.
- backstep: evento emitido al pulsar atrás.

Métodos y ciclo de vida:
------------------------
- selectOption(): gestiona la selección de opciones.
- getCurrentStep(): devuelve la configuración del paso actual.
- getResults(): obtiene los resultados a mostrar en el paso actual.

Buenas prácticas y recomendaciones:
----------------------------------
- Extiende stepsConfig para añadir nuevos pasos/resultados.
- Usa claves de traducción en títulos y descripciones.
- Personaliza los estilos usando customClass o modificando el SCSS.
- Si necesitas lógica adicional, implementa métodos auxiliares y documenta su propósito.

Ejemplo de uso (ver options-result-form.component.html):
--------------------------------------------------------
<app-options-result-form [stepsConfig]="steps" [stepNumber]="stepNumber" (continue)="continue()" (backstep)="backstep()" (deny)="deny()"></app-options-result-form>

Notas sobre estilos y extensibilidad:
-------------------------------------
- Personaliza la apariencia de las tarjetas de resultado y botones modificando el SCSS.
- Si añades nuevos tipos de resultado, actualiza la lógica de renderizado y selección.
*/

@Component({
  selector: 'app-options-result-form',
  templateUrl: './options-result-form.component.html',
  styleUrls: ['./options-result-form.component.scss'],
  standalone: true,
  imports: [
    IonButton,
    CommonModule,
    TranslateModule,
    IonHeader,
    IonToolbar,
    IonButtons,
    IonIcon,
    OptionsResultCardComponent,
  ],
})
export class OptionsResultFormComponent {
  navCtrl = inject(NavController);

  @Input() stepsConfig!: any;
  @Input() stepNumber: number = 0;
  @Input() showLoader: boolean = false;
  @Output() continue = new EventEmitter<void>();
  @Output() deny = new EventEmitter<void>();
  @Output() backstep = new EventEmitter<void>();

  currentSelected: number | null = null;

  mockedResults: any = {
    score: [
      {
        icon: '/assets/icons/initFormIcons/gluten.svg',
        title: 'Actividad',
        result: '300 puntos',
      },
      {
        icon: '/assets/icons/initFormIcons/gluten.svg',
        title: 'Nutrition',
        result: '300 puntos',
      },
    ],
    goals: [
      {
        icon: '/assets/icons/initFormIcons/gluten.svg',
        title: 'Actividad Física',
        result: '120 min. semanales',
      },
      {
        icon: '/assets/icons/initFormIcons/gluten.svg',
        title: 'Pasos diarios',
        result: '7000 pasos',
      },
      {
        icon: '/assets/icons/initFormIcons/gluten.svg',
        title: 'Pasos diarios',
        result: '7000 pasos',
      },

      {
        icon: '/assets/icons/initFormIcons/gluten.svg',
        title: 'Pasos diarios',
        result: '7000 pasos',
      },
      {
        icon: '/assets/icons/initFormIcons/gluten.svg',
        title: 'Pasos diarios',
        result: '7000 pasos',
      },
    ],
  };

  mockedMetas = [
    {
      id: 1,
      icon: '/assets/icons/initFormIcons/gluten.svg',
      title: 'Actividad Física',
    },
    {
      id: 2,
      icon: '/assets/icons/initFormIcons/gluten.svg',
      title: 'Pasos diarios',
    },
    {
      id: 3,
      icon: '/assets/icons/initFormIcons/gluten.svg',
      title: 'Pasos diarios',
    },
  ];
  get totalSteps() {
    return this.stepsConfig.length;
  }

  selectOption(id: number) {
    console.log('Selected option ID:', id);

    if (id === this.currentSelected) {
      this.currentSelected = null; // Deselect if already selected
      return;
    }

    this.currentSelected = id;
  }
  getCurrentStep() {
    return this.stepsConfig[this.stepNumber];
  }

  getResults() {
    const results = this.getCurrentStep().results;
    if (!results) return [];

    return results.map((key: string) => this.mockedResults[key]);
  }
}
