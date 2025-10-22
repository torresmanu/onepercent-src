import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormControl, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { IonicModule, NavController } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { HeaderComponent } from 'src/app/shared/components/header/header.component';
import { ActivityTypeAutocompleteComponent } from 'src/app/shared/components/activity-type-autocomplete/activity-type-autocomplete.component';
import { ModalService } from '@src/app/services/modal.service';
import { ActivityService, ActivityType, ActivityDetails } from 'src/app/services/activity.service';
import { CommonModule } from '@angular/common';
import { signal } from '@angular/core';
import { LoadingController, ToastController } from '@ionic/angular';

@Component({
  standalone: true,
  imports: [
    IonicModule,
    TranslateModule,
    HeaderComponent,
    ReactiveFormsModule,
    FormsModule,
    ActivityTypeAutocompleteComponent,
    CommonModule,
  ],
  selector: 'app-activity-registration',
  templateUrl: './activity-registration.component.html',
  styleUrls: ['./activity-registration.component.scss'],
})
export class ActivityRegistrationComponent implements OnInit {
  activityTypeControl = new FormControl('', Validators.required);
  modalService = inject(ModalService);
  activityService = inject(ActivityService);
  navCtrl = inject(NavController);
  loadingCtrl = inject(LoadingController);
  toastCtrl = inject(ToastController);
  cdr = inject(ChangeDetectorRef);

  selectedActivityType: ActivityType | null = null;
  activityTitle: string = '';
  startTime: string = '';
  duration: number | null = null;
  distance: number | null = null;
  intensity: number | null = null;

  get activities() {
    return this.activityService.getActivities();
  }

  get canSave(): boolean {
    const hasActivityType = !!this.selectedActivityType;
    const hasTitle = !!this.activityTitle?.trim();
    const hasStartTime = !!this.startTime;
    const hasDuration = !!this.duration && this.duration > 0;
    const hasIntensity = this.intensity !== null && this.intensity >= 0 && this.intensity <= 10;
    
    return hasActivityType && hasTitle && hasStartTime && hasDuration && hasIntensity;
  }

  constructor() {}

  ngOnInit() {
    // Initialize with current time
    const now = new Date();
    this.startTime = now.toISOString();
  }

  onActivityTypeSelected(activityType: ActivityType) {
    this.selectedActivityType = activityType;
    console.log('Selected activity type:', activityType);
    this.cdr.detectChanges();
  }

  async saveActivity() {
    // Validate required fields
    if (!this.selectedActivityType) {
      await this.showToast('Por favor selecciona un tipo de actividad', 'warning');
      return;
    }

    if (!this.activityTitle?.trim()) {
      await this.showToast('Por favor ingresa un título para la actividad', 'warning');
      return;
    }

    if (!this.startTime) {
      await this.showToast('Por favor selecciona la hora de inicio', 'warning');
      return;
    }

    if (!this.duration || this.duration <= 0) {
      await this.showToast('Por favor ingresa la duración de la actividad', 'warning');
      return;
    }

    if (this.intensity === null || this.intensity < 0 || this.intensity > 10) {
      await this.showToast('Por favor ingresa la intensidad percibida (0-10)', 'warning');
      return;
    }

    const loading = await this.loadingCtrl.create({
      message: 'Guardando...'
    });
    await loading.present();

    // Prepare activity data
    const activityData: ActivityDetails = {
      activityTypeId: this.selectedActivityType.id,
      title: this.activityTitle.trim(),
      startTime: this.startTime,
      duration: this.duration,
      distance: this.distance || undefined,
      intensity: this.intensity
    };

    // Add to local activities array
    this.activityService.addActivity(activityData);

    // Save to backend
    this.activityService.saveActivityRecord(activityData).subscribe({
      next: async (response) => {
        await loading.dismiss();
        await this.showToast('Actividad registrada exitosamente', 'success');
        
        // Clear form
        this.clearForm();
        
        // Navigate back to activity main
        this.navCtrl.navigateBack('/private/activity');
      },
      error: async (error) => {
        await loading.dismiss();
        console.error('Error al guardar actividad:', error);
        await this.showToast('Error al guardar la actividad. Por favor intenta de nuevo.', 'danger');
      }
    });
  }

  private clearForm() {
    this.selectedActivityType = null;
    this.activityTitle = '';
    this.startTime = new Date().toISOString();
    this.duration = null;
    this.distance = null;
    this.intensity = null;
    this.activityTypeControl.setValue('');
  }

  private async showToast(message: string, color: string) {
    const toast = await this.toastCtrl.create({
      message,
      duration: 3000,
      position: 'bottom',
      color
    });
    await toast.present();
  }
}
