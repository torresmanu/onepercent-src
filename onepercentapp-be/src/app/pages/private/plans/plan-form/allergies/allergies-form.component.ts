import { CommonModule } from '@angular/common';
import { Component, inject, Injector, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
import { IonContent } from '@ionic/angular/standalone';
import { ActivatedRoute } from '@angular/router';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { OptionsForm } from '../../../../../shared/components/forms/options-form/options-form.component';
import { ALLERGIES_FORM_CONFIG } from './allergies.config';
import { LandingLogoComponent } from 'src/app/shared/components/forms/landing-logo/landing-logo.component';
import { FormMetaService } from 'src/app/services/form-meta.service';
import { FORM_META_KEYS } from '@src/app/core/constraints/contraints';
@Component({
  selector: 'app-allergies-form',
  templateUrl: './allergies-form.component.html',
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
export class AllergiesFormComponent implements OnInit {
  private route = inject(ActivatedRoute);
  public translate = inject(TranslateService);
  public formMetaService = inject(FormMetaService);
  public stepNumber: number = 0;
  public steps: any = ALLERGIES_FORM_CONFIG;
  public isLandingLogo: boolean = true;

  public formMetas: any = {};

  ngOnInit(): void {
    this.formMetaService.getFormMeta(FORM_META_KEYS.ALLERGIES).subscribe({
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
  }

  goBack() {
    if (this.stepNumber > 0) {
      this.stepNumber--;
    }
  }
}
