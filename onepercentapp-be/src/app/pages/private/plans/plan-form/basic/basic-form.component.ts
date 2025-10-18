import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
import { IonContent, NavController } from '@ionic/angular/standalone';
import { ActivatedRoute } from '@angular/router';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { PictureFormComponent } from '../../../../../shared/components/forms/picture-form/picture-form.component';
import { LandingLogoComponent } from 'src/app/shared/components/forms/landing-logo/landing-logo.component';
import { BASIC_CONFIG } from '../basic/basic.config';
import { ToastService } from 'src/app/services/toast.service';
import { FormMetaService } from '@src/app/services/form-meta.service';
@Component({
  selector: 'app-basic-form',
  templateUrl: './basic-form.component.html',
  standalone: true,
  imports: [
    IonContent,
    CommonModule,
    FormsModule,
    TranslateModule,
    PictureFormComponent,
    LandingLogoComponent,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class BasicFormComponent implements OnInit {
  private route = inject(ActivatedRoute);
  public translate = inject(TranslateService);
  public formMetaService = inject(FormMetaService);
  public navController = inject(NavController);
  provinces = [];
  toast = inject(ToastService);
  steps: any = BASIC_CONFIG;
  currentStep: number = 0;
  totalSteps: number = 0;
  isPremium = false;
  isLandingLogo: boolean = true;
  continue() {  
    if (this.currentStep < this.steps.length - 1) {
      this.currentStep++;
    } else this.gotoHome();
  }
  gotoHome(){
    this.navController.navigateRoot('/private/home'); 
  }
  backstep() {
    if (this.currentStep > 0) {
      this.currentStep--;
    }
  }

  getCurrentStepCount() {
    // Cuenta los steps donde stepper es false
    const nonStepperCount = this.steps.reduce(
      (acc: number, step: any) => acc + (!step.stepper ? 1 : 0),
      0
    );

    return {
      currentStep: this.currentStep - nonStepperCount,
      totalSteps: this.steps.length - nonStepperCount + 1,
    };
  }

  getStepperCurrent() {
    let visualStep = 0;
    for (let i = 0; i <= this.currentStep; i++) {
      if (this.steps[i]?.stepper) visualStep++;
    }
    return visualStep;
  }

  getStepperTotal() {
    return this.steps.filter((s: any) => s.stepper).length;
  }

  ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      this.isPremium = params['isPremium'] === 'true';
      const stepCount = this.getCurrentStepCount().currentStep;
      this.currentStep = Math.max(
        0,
        Math.min(stepCount, this.steps.length - 1)
      );
      this.totalSteps = this.getCurrentStepCount().totalSteps;
    });
    this.loadProvinces();
  }

  loadProvinces() {
    this.formMetaService.getProvinces().subscribe((data) => {
      this.provinces = data;
    });
  }
}
