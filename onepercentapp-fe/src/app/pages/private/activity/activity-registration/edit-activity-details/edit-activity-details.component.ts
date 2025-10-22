import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { HeaderComponent } from '@src/app/shared/components/header/header.component';
import { ActivityService, ActivityDetails } from 'src/app/services/activity.service';

@Component({
  standalone: true,
  imports: [
    IonicModule,
    TranslateModule,
    HeaderComponent,
    CommonModule,
    FormsModule,
  ],
  selector: 'app-edit-activity-details',
  templateUrl: './edit-activity-details.component.html',
  styleUrls: ['./edit-activity-details.component.scss'],
})
export class EditActivityDetailsComponent implements OnInit {
  route = inject(ActivatedRoute);
  router = inject(Router);
  activityService = inject(ActivityService);
  
  activity: ActivityDetails | null = null;
  activityIndex: number = -1;
  isSaving: boolean = false;

  // Form fields
  activityTitle: string = '';
  startTime: string = '';
  duration: number = 0;
  distance: number | null = null;
  intensity: number = 0;

  ngOnInit() {
    // Get the activity index from route params
    this.activityIndex = Number(this.route.snapshot.paramMap.get('id'));
    
    // Get the activity from the service by its index
    this.activity = this.activityService.getActivityByIndex(this.activityIndex);
    
    if (!this.activity) {
      // If activity doesn't exist, navigate back
      this.router.navigate(['/private/activity-registration']);
      return;
    }
    
    // Initialize form fields with activity data
    this.activityTitle = this.activity.title || '';
    this.startTime = this.activity.startTime || new Date().toISOString();
    this.duration = this.activity.duration || 0;
    this.distance = this.activity.distance || null;
    this.intensity = this.activity.intensity || 0;
  }

  async onSaveChanges() {
    this.isSaving = true;
    
    // Simulate a small delay to show the spinner (optional)
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Update the activity in the service array
    if (this.activityIndex >= 0 && this.activity) {
      const updatedActivity: ActivityDetails = {
        ...this.activity,
        title: this.activityTitle.trim(),
        startTime: this.startTime,
        duration: this.duration,
        distance: this.distance || undefined,
        intensity: this.intensity
      };
      
      this.activityService.updateActivity(this.activityIndex, updatedActivity);
    }
    
    this.isSaving = false;
    
    // Navigate back to the activity registration page
    this.router.navigate(['/private/activity-registration']);
  }

  onCancel() {
    // Navigate back without saving
    this.router.navigate(['/private/activity-registration']);
  }
}
