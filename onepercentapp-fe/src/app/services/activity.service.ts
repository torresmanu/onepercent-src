import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, catchError, of } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ApiCallService } from './api-call.service';

export interface ActivityType {
  id: number;
  title: string;
  description?: string;
  threshold?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface ActivityDetails {
  id?: number;
  activityTypeId: number;
  title: string;
  startTime: string;
  duration: number; // in minutes
  distance?: number; // in kilometers
  intensity: number; // 0-10
}

@Injectable({
  providedIn: 'root'
})
export class ActivityService {
  private readonly basePath = environment.apiBaseUrl;
  private http = inject(HttpClient);
  private apiCallService = inject(ApiCallService);

  // In-memory array to hold activities being registered before saving
  private activities: ActivityDetails[] = [];

  /**
   * Search activity types from backend
   */
  searchActivityTypes(query: string): Observable<ActivityType[]> {
    if (!query || query.length < 2) {
      return of([]);
    }

    return this.apiCallService.get<{ statusCode: number; data: ActivityType[] }>('/activity-type')
      .pipe(
        map(response => {
          const allActivityTypes = response.data || [];
          // Filter by query on frontend since backend doesn't have search endpoint
          return allActivityTypes.filter(activityType => 
            activityType.title.toLowerCase().includes(query.toLowerCase())
          );
        }),
        catchError(error => {
          console.error('Error searching activity types:', error);
          return of([]);
        })
      );
  }

  /**
   * Get all activity types
   */
  getAllActivityTypes(): Observable<ActivityType[]> {
    return this.apiCallService.get<{ statusCode: number; data: ActivityType[] }>('/activity-type')
      .pipe(
        map(response => response.data || []),
        catchError(error => {
          console.error('Error fetching activity types:', error);
          return of([]);
        })
      );
  }

  /**
   * Save activity record to backend
   */
  saveActivityRecord(activityData: any): Observable<any> {
    const payload = {
      userActivityRegisterType: 'workout',
      title: activityData.title,
      activityTypeId: activityData.activityTypeId,
      minutes: activityData.duration,
      distanceInKms: activityData.distance,
      perceivedEffort: activityData.intensity
    };

    return this.apiCallService.post('/user-activity/registerUserActivity', payload)
      .pipe(
        catchError(error => {
          console.error('Error saving activity:', error);
          throw error;
        })
      );
  }

  /**
   * Get user's activity history (if endpoint exists)
   */
  getUserActivities(): Observable<any[]> {
    // This endpoint might not exist yet, but we'll prepare for it
    return this.apiCallService.get<{ statusCode: number; data: any[] }>('/user-activity/user-activities')
      .pipe(
        map(response => response.data || []),
        catchError(error => {
          console.error('Error fetching user activities:', error);
          return of([]);
        })
      );
  }

  /**
   * Activity types management (similar to ingredients array)
   */
  getActivities(): ActivityDetails[] {
    return this.activities;
  }

  addActivity(activity: ActivityDetails): void {
    this.activities.push(activity);
  }

  updateActivity(index: number, activity: ActivityDetails): void {
    if (index >= 0 && index < this.activities.length) {
      this.activities[index] = activity;
    }
  }

  removeActivity(index: number): void {
    if (index >= 0 && index < this.activities.length) {
      this.activities.splice(index, 1);
    }
  }

  getActivityByIndex(index: number): ActivityDetails | null {
    if (index >= 0 && index < this.activities.length) {
      return this.activities[index];
    }
    return null;
  }

  clearActivities(): void {
    this.activities.length = 0;
  }
}
