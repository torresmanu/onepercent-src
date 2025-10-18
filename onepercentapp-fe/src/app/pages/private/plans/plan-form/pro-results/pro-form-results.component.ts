import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
import { NavController, IonContent } from '@ionic/angular/standalone';
import { OptionsResultFormComponent } from '@src/app/shared/components/forms/options-result-form/options-result-form.component';
import { PRO_FORM_RESULTS_CONFIG } from './pro-form-results.config';
import { FullScreenPictureComponent } from '@src/app/shared/components/forms/fullscreen-picture/fullscreen-picture.component';
import { LoaderFormResultsComponent } from "@src/app/shared/components/loader-form-results/loader-form-results.component";
/*
====================================================================================
COMPONENTE: ProFormResultsComponent (app-pro- form-results)
====================================================================================

Descripción general:
--------------------
Componente padre que gestiona el flujo de resultados del formulario PRO en el área privada de planes. Orquesta la visualización de resultados paso a paso, mostrando componentes hijos como OptionsResultFormComponent y FullScreenPictureComponent según el estado del flujo.

Inputs/Outputs:
---------------
- steps: configuración de los pasos de resultados (PRO_FORM_RESULTS_CONFIG).
- stepNumber: índice del paso actual.
- showLoader: controla la visualización del loader de resultados.
- isFullPictureStep: determina si se muestra la pantalla de imagen a pantalla completa.

Servicios y dependencias:
-------------------------
- ActivatedRoute: para obtener parámetros de ruta si es necesario.
- TranslateService: para internacionalización de textos.

Ciclo de vida y métodos principales:
-----------------------------------
- ngOnInit(): inicialización y carga de datos si aplica.
- continue(): avanza al siguiente paso o muestra la pantalla final.
- deny(): acción personalizada para rechazar o finalizar el flujo.
- backstep(): retrocede un paso en el flujo de resultados.

Buenas prácticas y recomendaciones:
----------------------------------
- Mantén la lógica de control de pasos y visualización en este componente padre.
- Extiende PRO_FORM_RESULTS_CONFIG para añadir nuevos pasos o resultados.
- Usa showLoader para controlar la experiencia de carga.
- Si necesitas lógica adicional para validaciones o side-effects, implementa métodos auxiliares y documenta su propósito.

Ejemplo de uso (ver pro-form-results.component.html):
-----------------------------------------------------
<ion-content fullscreen>
  <app-loader-form-results *ngIf="showLoader" ...></app-loader-form-results>
  <app-options-result-form ... (continue)="continue()" (backstep)="backstep()" (deny)="deny()" *ngIf="!isFullPictureStep && !showLoader"></app-options-result-form>
  <app-fullscreen-picture *ngIf="isFullPictureStep && !showLoader" ...></app-fullscreen-picture>
</ion-content>

Notas sobre estilos y extensibilidad:
-------------------------------------
- Personaliza los estilos globales y de los hijos según las necesidades del flujo.
- Usa claves de traducción para todos los textos visibles.
- Si añades nuevos pasos, actualiza la lógica de avance y retroceso.
*/
@Component({
  selector: 'app-pro-form-results',
  templateUrl: './pro-form-results.component.html',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    TranslateModule,
    OptionsResultFormComponent,
    FullScreenPictureComponent,
    LoaderFormResultsComponent,
    IonContent
],
})
export class ProFormResultsComponent implements OnInit {
  public translate = inject(TranslateService);
  public steps: any = PRO_FORM_RESULTS_CONFIG;
  public stepNumber: number = 0;
  public showLoader: boolean = true;
  public isFullPictureStep: boolean = false;
  public navController = inject(NavController);
  ngOnInit(): void {
    this.showLoader = true
  }
  continue() {
    if (this.stepNumber < this.steps.length - 1) {
      this.stepNumber++;
    } else {
      this.isFullPictureStep = true;
    }
  }

  goToHome() {
    this.navController.navigateRoot('/private/home');
  }
  deny() {
    console.log('Deny action triggered');
    this.isFullPictureStep = true;
  }
  backstep() {
    if (this.stepNumber > 0) {
      this.stepNumber--;
    } else {
      this.navController.navigateRoot('/private/plans/form/pro-two');
    }
  }
}
