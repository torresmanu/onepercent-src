import { CommonModule } from '@angular/common';
import { Component, inject, Injector, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
import { IonContent, NavController } from '@ionic/angular/standalone';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { OptionsForm } from '../../../../../shared/components/forms/options-form/options-form.component';
import { PRO_FORM_TWO_CONFIG } from './pro-form-two.config';
import { LandingLogoComponent } from 'src/app/shared/components/forms/landing-logo/landing-logo.component';
import { FormMetaService } from 'src/app/services/form-meta.service';
import { FORM_META_KEYS } from '@src/app/core/constraints/contraints';
@Component({
  selector: 'app-pro-form-two',
  templateUrl: './pro-form-two.html',
  standalone: true,
  imports: [
    IonContent,
    CommonModule,
    FormsModule,
    TranslateModule,
    LandingLogoComponent,
    OptionsForm,
    
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class ProFormTwoComponent implements OnInit {
  public translate = inject(TranslateService);
  public formMetaService = inject(FormMetaService);
  public stepNumber: number = 0;
  public steps: any = PRO_FORM_TWO_CONFIG;
  public isLandingLogo: boolean = true;
  public navController = inject(NavController);
  public formMetas: any = {};

  /*
====================================================================================
COMPONENTE: ProFormTwoComponent (app-pro-form-two)
====================================================================================

Descripción general:
--------------------
Este componente es el "padre" del flujo de formulario PRO TWO en el área privada de planes. Gestiona el ciclo de vida, la navegación entre pasos, la carga de metadatos y la integración con los formularios hijos (OptionsForm y LandingLogoComponent).

Su objetivo es orquestar el flujo de pasos del formulario profesional, mostrando una pantalla de bienvenida (LandingLogo) y, posteriormente, el formulario de opciones (OptionsForm) para cada paso definido en la configuración.

Inputs/Outputs:
---------------
- No recibe inputs externos, pero gestiona internamente:
  - stepNumber: número de paso actual.
  - steps: configuración de pasos (PRO_FORM_TWO_CONFIG).
  - isLandingLogo: controla si se muestra la pantalla de bienvenida.
  - formMetas: metadatos de opciones, obtenidos del servicio FormMetaService.

Servicios y dependencias:
-------------------------
- FormMetaService: para obtener los metadatos de opciones dinámicas.
- NavController: para navegación programática.
- TranslateService: para internacionalización de textos.

Ciclo de vida y métodos principales:
-----------------------------------
- ngOnInit(): carga los metadatos del formulario al inicializar el componente.
- continue(): avanza al siguiente paso o navega al resultado si es el último paso.
- goToResults(): navega a la pantalla de resultados.
- backstep(): retrocede un paso en el formulario.

Buenas prácticas y recomendaciones:
----------------------------------
- Extiende la configuración de pasos en PRO_FORM_TWO_CONFIG para añadir nuevos pasos.
- Utiliza formMetas para cargar dinámicamente las opciones de cada paso.
- Controla la visibilidad de la pantalla de bienvenida con isLandingLogo.
- Mantén la lógica de navegación y control de pasos en este componente padre.
- Si necesitas lógica adicional para validaciones o side-effects, implementa métodos auxiliares y documenta su propósito.

Ejemplo de uso (ver pro-form-two.html):
---------------------------------------
<ion-content fullscreen>
  <app-landing-logo *ngIf="isLandingLogo; else optionsForm" ... (continue)="isLandingLogo = false"></app-landing-logo>
  <ng-template #optionsForm>
    <app-options-form ... (continue)="continue()" (backstep)="backstep()"></app-options-form>
  </ng-template>
</ion-content>

Notas sobre estilos y extensibilidad:
-------------------------------------
- Si añades nuevos pasos, asegúrate de actualizar la lógica de avance y retroceso.
- Para internacionalización, usa siempre claves de traducción en los textos de configuración.
*/

  ngOnInit(): void {
    this.isLandingLogo = true
    this.formMetaService.getFormMeta(FORM_META_KEYS.PRO_PLAN_TWO).subscribe({
      next: (data) => {
        this.formMetas = data;
      },
      error: (error) => {
        console.error('Error al obtener los metadatos del formulario:', error);
      },
    });
  }
  continue() {
    this.stepNumber++;
    if (this.stepNumber >= this.steps.length) {
      this.goToResults();
    }
  }

  goToResults(){
    this.navController.navigateRoot('/private/plans/form/pro-results');
  }
  goBack() {
    if (this.stepNumber > 0) {
      this.stepNumber--;
    }
  }
}
