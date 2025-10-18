import { CommonModule } from '@angular/common';
import { Component, inject, Injector, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
import { IonContent, NavController } from '@ionic/angular/standalone';
import { ActivatedRoute } from '@angular/router';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FullScreenPictureComponent } from '../../../../../shared/components/forms/fullscreen-picture/fullscreen-picture.component';
import { PictureFormComponent } from '../../../../../shared/components/forms/picture-form/picture-form.component';
import { LandingLogoComponent } from 'src/app/shared/components/forms/landing-logo/landing-logo.component';
import { PRO_CONFIG } from './pro-form.config';
import { ToastService } from 'src/app/services/toast.service';
@Component({
  selector: 'app-pro-form',
  templateUrl: './pro-form.component.html',
  standalone: true,
  imports: [
    IonContent,
    CommonModule,
    FormsModule,
    TranslateModule,
    PictureFormComponent,
    FullScreenPictureComponent,
    LandingLogoComponent
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class ProFormComponent {
  private route = inject(ActivatedRoute);
  public translate = inject(TranslateService);
  toast = inject(ToastService);
  steps: any = PRO_CONFIG;
  currentStep: number = 0;
  totalSteps: number = this.steps.length;
  isFullscreenPicture = true;
  isLandingLogo = false;
  navCtrl = inject(NavController);
  continue() {
    if (this.currentStep < this.steps.length - 1) {
      this.currentStep++;
    } else {
      this.navCtrl.navigateForward('/private/plans/form/pro-two');
    }
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

}
