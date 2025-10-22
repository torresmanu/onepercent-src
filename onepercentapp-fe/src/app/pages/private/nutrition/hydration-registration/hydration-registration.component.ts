import { Component, inject } from '@angular/core';
import { IonicModule } from "@ionic/angular";
import { Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { HeaderComponent } from "src/app/shared/components/header/header.component";
import { InputCardComponent } from "./input-card/input-card.component";
import { ReactiveFormsModule } from '@angular/forms';
import { HydrationService } from 'src/app/services/hydratation.service';
import { NutritionService } from 'src/app/services/nutrition.service';
import { ToastService } from 'src/app/services/toast.service';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  imports: [
    IonicModule,
    TranslateModule,
    HeaderComponent,
    InputCardComponent,
    ReactiveFormsModule,
    CommonModule
  ],
  selector: 'app-hydration-registration',
  templateUrl: './hydration-registration.component.html',
  styleUrls: ['./hydration-registration.component.scss']
})
export class HydrationRegistrationComponent {
  private hydrationService = inject(HydrationService);
  private nutritionService = inject(NutritionService);
  private toastService = inject(ToastService);
  private router = inject(Router);

  selected: number | null = null;
  isLoading = false;

  goBack() {
    this.router.navigate(['/private/nutrition']);
  }

  onSelectionChange(selected: number | null) {
    this.selected = selected;
  }

  registerHydration() {
    if (this.selected !== null && !this.isLoading) {
      this.isLoading = true;
      this.hydrationService.sendHydrationStatus(this.selected)
        .subscribe({
          next: () => {
            // Update hydration data in NutritionService
            this.nutritionService.updateHydrationDataAfterRegistration();
            
            this.toastService.presentToastSuccess('Hidratación registrada exitosamente');
            this.router.navigate(['/private/nutrition']);
          },
          error: (error) => {
            this.isLoading = false;
            console.error('Error registering hydration:', error);
            this.toastService.presentToastDanger('Error al registrar la hidratación');
          }
        });
    }
  }
}