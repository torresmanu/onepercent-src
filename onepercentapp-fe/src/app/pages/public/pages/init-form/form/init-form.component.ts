import { Component, inject, OnInit } from '@angular/core';
import { LoaderFormResultsComponent } from '@src/app/shared/components/loader-form-results/loader-form-results.component';
import { OptionsForm } from '../../../../../shared/components/forms/options-form/options-form.component';
import { IonContent, NavController } from '@ionic/angular/standalone';
import { TranslateModule } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';
import { STEPS_CONFIG } from './init-form.config';
import { FormMetaService } from 'src/app/services/form-meta.service';
import { FORM_META_KEYS } from 'src/app/core/constraints/contraints';
@Component({
  standalone: true,
  imports: [
    IonContent,
    CommonModule,
    LoaderFormResultsComponent,
    TranslateModule,
    OptionsForm,
  ],
  selector: 'app-init-form',
  templateUrl: './init-form.component.html',
})
export class InitFormComponent implements OnInit {
  private formMetaService = inject(FormMetaService);
  public stepsConfig = STEPS_CONFIG;
  public translate = TranslateModule;
  public stepNumber = 0;
  public showLoader = false;
  public formMetas: any = {};
  public navCtrl = inject(NavController);
  ngOnInit(): void {
    this.formMetaService.getFormMeta(FORM_META_KEYS.INIT_FORM).subscribe({
      next: (data) => {
        this.formMetas = data;
        console.log('Form metas loaded:', this.formMetas);
        
        // Check if we have empty data and provide fallback data for testing
        if (this.hasEmptyData(data)) {
          console.warn('Backend returned empty data, using fallback data for testing');
          this.formMetas = this.getFallbackData();
        }
      },
      error: (error) => {
        console.error('Error al obtener los metadatos del formulario:', error);
        // Use fallback data when API fails
        console.warn('Using fallback data due to API error');
        this.formMetas = this.getFallbackData();
      },
    });
  }

  /**
   * Check if the data from backend is empty
   */
  private hasEmptyData(data: any): boolean {
    if (!data || typeof data !== 'object') return true;
    
    const keys = ['activeData', 'workoutWeeks', 'hydrationData', 'vegetablesAndFruitsData', 'nutritionPreferencesData'];
    return keys.some(key => !data[key] || !Array.isArray(data[key]) || data[key].length === 0);
  }

  /**
   * Provide fallback data for testing when backend is not configured
   */
  private getFallbackData(): any {
    return {
      activeData: [
        { id: 1, title: 'Caminar', description: 'Actividad ligera diaria' },
        { id: 2, title: 'Correr', description: 'Actividad moderada regular' },
        { id: 3, title: 'Entrenamiento intenso', description: 'Actividad vigorosa' }
      ],
      workoutWeeks: [
        { id: 1, title: '0 sesiones', description: 'Sin entrenamiento regular' },
        { id: 2, title: '1-3 sesiones', description: 'Entrenamiento ligero' },
        { id: 3, title: '4-5 sesiones', description: 'Entrenamiento moderado' },
        { id: 4, title: '5+ sesiones', description: 'Entrenamiento intenso' }
      ],
      hydrationData: [
        { id: 1, title: 'Poca hidratación', description: 'Menos de 1.5L al día' },
        { id: 2, title: 'Hidratación moderada', description: '1.5-2.5L al día' },
        { id: 3, title: 'Buena hidratación', description: 'Más de 2.5L al día' }
      ],
      vegetablesAndFruitsData: [
        { id: 1, title: 'Pocas verduras', description: 'Menos de 3 porciones diarias' },
        { id: 2, title: 'Verduras moderadas', description: '3-5 porciones diarias' },
        { id: 3, title: 'Muchas verduras', description: 'Más de 5 porciones diarias' }
      ],
      nutritionPreferencesData: [
        { id: 1, title: 'Vegetariano', description: 'Sin carne' },
        { id: 2, title: 'Vegano', description: 'Sin productos animales' },
        { id: 3, title: 'Omnívoro', description: 'Todo tipo de alimentos' }
      ]
    };
  }
  get isLastStep(): boolean {
    return this.stepNumber === this.stepsConfig.length - 1;
  }

  continue() {
    if (this.isLastStep) {
      this.startLoader();
      this.submit();
    } else {
      this.stepNumber++;
    }
  }

  goToResults(){
    console.log('🚀 NavigateToResults called - attempting navigation to /public/results-init-form');
    try {
      this.navCtrl.navigateRoot('/public/results-init-form');
      console.log('✅ Navigation successful');
    } catch (error) {
      console.error('❌ Navigation failed:', error);
    }
  }
  goBack() {
console.log('Current step before decrement:', this.stepNumber);
    if (this.stepNumber > 0) {
      this.stepNumber--;
    }
  }

  startLoader() {
    this.showLoader = true;
  }

  submit() {
    console.log('Formulario enviado');
  }
}

/*
====================================================================================
COMPONENTE: InitFormComponent (app-init-form)
====================================================================================

Descripción general:
--------------------
Componente padre que gestiona el flujo del formulario de inicio (init-form) en el área pública. Orquesta la carga de metadatos, la navegación entre pasos y la integración con el formulario hijo OptionsForm.

Inputs/Outputs:
---------------
- stepNumber: índice del paso actual.
- stepsConfig: configuración de los pasos (STEPS_CONFIG).
- formMetas: metadatos de opciones, obtenidos del servicio FormMetaService.
- showLoader: controla la visualización del loader.

Servicios y dependencias:
-------------------------
- FormMetaService: para obtener los metadatos de opciones dinámicas.
- NavController: para navegación programática.
- TranslateModule: para internacionalización de textos.

Ciclo de vida y métodos principales:
-----------------------------------
- ngOnInit(): carga los metadatos del formulario al inicializar el componente.
- continue(): avanza al siguiente paso o inicia el loader y envía el formulario si es el último paso.
- goToResults(): navega a la pantalla de resultados.
- backstep(): retrocede un paso en el formulario.

Buenas prácticas y recomendaciones:
----------------------------------
- Extiende STEPS_CONFIG para añadir nuevos pasos.
- Usa formMetas para cargar dinámicamente las opciones desde la API.
- Mantén la lógica de navegación y control de pasos en este componente padre.
- Si necesitas lógica adicional para validaciones o side-effects, implementa métodos auxiliares y documenta su propósito.

Ejemplo de uso (ver init-form.component.html):
----------------------------------------------
<ion-content class="safe-area">
  <app-options-form ... (continue)="continue()" ...></app-options-form>
  <app-loader-form-results *ngIf="showLoader" (finished)="goToResults()"></app-loader-form-results>
</ion-content>

Notas sobre estilos y extensibilidad:
-------------------------------------
- Si añades nuevos pasos, asegúrate de actualizar la lógica de avance y retroceso.
- Para internacionalización, usa siempre claves de traducción en los textos de configuración.
*/
