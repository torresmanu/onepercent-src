import {
  Component,
  inject,
  OnInit,
  ViewEncapsulation,
  AfterViewInit,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { Input, Output, EventEmitter } from '@angular/core';

import { TranslateModule } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';
import {
  IonButton,
  NavController,
  IonHeader,
  IonToolbar,
  IonButtons,
  IonIcon,
} from '@ionic/angular/standalone';
@Component({
  selector: 'app-options-form',
  templateUrl: './options-form.component.html',
  styleUrls: ['./options-form.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
    IonButton,
    IonHeader,
    IonToolbar,
    IonButtons,
    IonIcon,
  ],
})
export class OptionsForm implements AfterViewInit {
  private readonly navCtrl = inject(NavController);
  public translate = TranslateModule;
  @Input() stepsConfig: any = {};
  @Input() stepNumber!: number;
  @Input() formMetas: any = {};
  @Input() showLoader: boolean = false;
  // @Output() showLoaderChange = new EventEmitter<boolean>();
  @Output() continue = new EventEmitter<void>();
  @Output() backstep = new EventEmitter<void>();

  get totalSteps() {
    return this.stepsConfig.length;
  }

  public get currentSelected() {
    return this.currentStep.selected.values;
  }
  public get currentValues() {
    return this.currentStep.values;
  }
  public get currentIcons() {
    return this.currentStep.icons;
  }
  public get allowMultiple() {
    return this.currentStep.selected.allowMultiple;
  }
  public get max() {
    return this.currentStep.selected.max || 999;
  }
  public get currentStep() {
    return this.stepsConfig[this.stepNumber];
  }
  ngAfterViewInit(): void {
    this.mapDataIntoSteps(this.formMetas);
  }

  mapDataIntoSteps(data: any) {
    Object.entries(this.stepsConfig).forEach(([_, step]: [string, any]) => {
      const key = step.key;
      if (!data[key] || !Array.isArray(data[key])) {
        if (!step.values || !step.values.length) {
          step.values = [];
        }
        return;
      }
      // Mapea cada opción añadiendo la key (clave del objeto de la API)
      step.values = data[key].map((item: any) => ({ ...item, key }));
    });
  }

  continueStep() {
    this.continue.emit();
  }

  goBack() {
     this.backstep.emit();
  }
  // startLoader() {
  //   this.showLoader = true;
  // }

  select(id: number, allowMultiple: boolean = false, max: number = 2) {
    const index = this.currentSelected.indexOf(id);
    if (allowMultiple) {
      if (index > -1) {
        this.currentSelected.splice(index, 1);
      } else {
        if (!max || this.currentSelected.length < max) {
          this.currentSelected.push(id);
        }
      }
      return;
    }
    this.currentSelected.length = 0;
    if (index === -1) this.currentSelected.push(id);
  }

  isFullPictureStep() {
    return this.stepsConfig[this.stepNumber]?.fullPicture || false;
  }
  submit() {
    console.log('Formulario enviado');
  }
}

/*
====================================================================================
COMPONENTE: OptionsForm (app-options-form)
====================================================================================

Descripción general:
--------------------
Componente de formulario reutilizable para flujos tipo stepper. Permite mostrar opciones seleccionables por pasos, con soporte para selección múltiple, imágenes, títulos y descripciones, y lógica de avance/retroceso.

Inputs:
-------
- stepsConfig: configuración de los pasos (array de objetos con claves, títulos, iconos, etc).
- stepNumber: índice del paso actual.
- formMetas: metadatos de opciones, normalmente obtenidos de un servicio.
- showLoader: controla la visualización del loader.

Outputs:
--------
- continue: evento emitido al pulsar continuar.

Métodos y ciclo de vida:
------------------------
- ngAfterViewInit(): mapea los metadatos a los pasos al inicializar.
- mapDataIntoSteps(): integra los datos dinámicos en la configuración de pasos.
- continueStep(): emite el evento de continuar.
- backstep(): retrocede un paso o navega atrás si es el primero.
- select(): gestiona la selección de opciones (soporta múltiple y máximo).
- isFullPictureStep(): determina si el paso actual es de tipo imagen completa.
- submit(): lógica de envío del formulario (puede ser extendida).

Buenas prácticas y recomendaciones:
----------------------------------
- Extiende stepsConfig para añadir nuevos pasos o tipos de opción.
- Usa formMetas para cargar dinámicamente las opciones desde la API.
- Usa claves de traducción en títulos y descripciones.
- Si necesitas lógica adicional, implementa métodos auxiliares y documenta su propósito.

Ejemplo de uso (ver options-form.component.html):
-------------------------------------------------
<app-options-form [stepNumber]="stepNumber" [stepsConfig]="stepsConfig" [formMetas]="formMetas" (continue)="continue()"></app-options-form>

Notas sobre estilos y extensibilidad:
-------------------------------------
- Puedes personalizar la apariencia de las opciones y el stepper modificando el SCSS.
- Si añades nuevos tipos de paso, actualiza la lógica de renderizado y selección.
*/
