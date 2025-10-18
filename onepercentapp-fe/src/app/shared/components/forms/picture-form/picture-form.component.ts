import { CommonModule } from '@angular/common';
import {
  Component,
  Input,
  inject,
  ViewEncapsulation,
  Output,
  EventEmitter,
} from '@angular/core';
import {
  IonHeader,
  IonContent,
  IonButton,
  IonBackButton,
  IonToolbar,
  IonInput,
  IonIcon,
} from '@ionic/angular/standalone';
import { TranslateModule } from '@ngx-translate/core';
import { LogoComponent } from 'src/app/shared/components/logo/logo.component';
import { CustomInputComponent } from '../../../../shared/components/custom-input/custom-input.component';
import { FormControl } from '@angular/forms';
import { SelectableOptionsComponent } from 'src/app/shared/components/forms/selectable-options/selectable-options.component';
import { UtilsService } from 'src/app/services/utils.service';
import { PredictiveInputComponent } from '../../predictive-input/predictive-input.component';
@Component({
  selector: 'app-picture-form',
  templateUrl: './picture-form.component.html',
  styleUrls: ['./picture-form-component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonHeader,
    TranslateModule,
    LogoComponent,
    IonButton,
    CustomInputComponent,
    IonToolbar,
    IonIcon,
    SelectableOptionsComponent,
    PredictiveInputComponent,
  ],
})
export class PictureFormComponent {
  @Input() stepData: any;
  @Input() currentStep!: number;
  @Input() totalSteps!: number;
  @Input() steps: any[] = [];
  @Input() provinces: any[] = [];
  @Output() continue = new EventEmitter<void>();
  @Output() backstep = new EventEmitter<void>();

  public translate = inject(TranslateModule);
  utilsService = inject(UtilsService);

  onContinue() {
    this.continue.emit();
  }

  onBackstep(event?: Event) {
    if (event) {
      event.preventDefault();
    }
    this.backstep.emit();
  }

  isStepValid(): boolean {
    if (this.stepData.content === 'selectable') {
      // Para opciones seleccionables
      if (this.stepData.multiselect) {
        return (
          Array.isArray(this.stepData.control.value) &&
          this.stepData.control.value.length > 0
        );
      }
      return !!this.stepData.control.value;
    }
    if (this.stepData.content === 'input' && this.stepData.inputs) {
      // Para inputs, todos deben tener valor y no tener errores
      return this.stepData.inputs.every(
        (input: any) => !!input.control.value && input.control.valid
      );
    }
    // Otros casos (text, etc)
    return true;
  }

  getCustomIcon(input: any): string | undefined {
    // Si hay customIcon, se usa como base
    if (input.customIcon) {
      // Si hay validador
      if (input.control && input.control.validator) {
        if (this.utilsService.getFormError(input.control))
          return 'assets/icon/cross.svg';
        if (input.control.value) return 'assets/icon/check.svg';
        return input.customIcon;
      } else {
        // Si NO hay validador
        if (input.control.value) return 'assets/icon/check.svg';
        return input.customIcon;
      }
    }
    // Si no hay customIcon, no muestra nada
    return undefined;
  }
}

/*
====================================================================================
COMPONENTE: PictureFormComponent (app-picture-form)
====================================================================================

Descripción general:
--------------------
Formulario de paso tipo "stepper" con soporte para inputs personalizados, selección de opciones, validaciones y navegación entre pasos. Permite mostrar cabeceras con imagen, barra de progreso y lógica de avance/retroceso.

Inputs:
-------
- stepData: datos del paso actual (estructura flexible: puede contener opciones, inputs, títulos, etc).
- currentStep: índice del paso actual.
- totalSteps: total de pasos del formulario.
- steps: array de todos los pasos.
- provinces: array de provincias (para inputs predictivos).

Outputs:
--------
- continue: evento emitido al pulsar continuar.
- backstep: evento emitido al pulsar atrás.

Métodos y ciclo de vida:
------------------------
- onContinue(): emite el evento de continuar.
- onBackstep(): emite el evento de retroceso.
- isStepValid(): valida el paso actual según el tipo de contenido.
- getCustomIcon(): determina el icono a mostrar según el estado del input.

Buenas prácticas y recomendaciones:
----------------------------------
- Usa stepData para definir la estructura y lógica de cada paso.
- Personaliza los inputs usando CustomInputComponent y PredictiveInputComponent.
- Usa claves de traducción en títulos, descripciones y placeholders.
- Si necesitas lógica adicional, implementa métodos auxiliares y documenta su propósito.

Ejemplo de uso (ver picture-form.component.html):
-------------------------------------------------
<app-picture-form [stepData]="step" [currentStep]="stepIndex" [totalSteps]="steps.length" ... (continue)="onContinue()" (backstep)="onBackstep()"></app-picture-form>

Notas sobre estilos y extensibilidad:
-------------------------------------
- Personaliza la cabecera, barra de progreso y estilos de inputs en el SCSS.
- Si añades nuevos tipos de paso, actualiza la lógica de renderizado y validación.
*/
