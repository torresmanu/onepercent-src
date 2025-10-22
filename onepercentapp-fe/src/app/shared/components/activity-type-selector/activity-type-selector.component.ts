import { Component, EventEmitter, inject, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule, ModalController } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule } from '@angular/forms';
import { ActivityService, ActivityType } from '@src/app/services/activity.service';
import { debounceTime, distinctUntilChanged, Subject, takeUntil, catchError, of } from 'rxjs';

@Component({
  selector: 'app-activity-type-selector',
  standalone: true,
  imports: [
    CommonModule,
    IonicModule,
    TranslateModule,
    FormsModule
  ],
  templateUrl: './activity-type-selector.component.html',
  styleUrls: ['./activity-type-selector.component.scss']
})
export class ActivityTypeSelectorComponent implements OnInit, OnDestroy {
  @Input() selectedActivityType: ActivityType | null = null;
  @Output() activityTypeSelected = new EventEmitter<ActivityType>();
  @Output() modalDismissed = new EventEmitter<void>();

  private activityService = inject(ActivityService);
  private modalController = inject(ModalController);
  private destroy$ = new Subject<void>();

  searchQuery: string = '';
  allActivityTypes: ActivityType[] = [];
  filteredActivityTypes: ActivityType[] = [];
  isLoading = false;
  hasError = false;
  selectedActivityTypeId: number | null = null;

  ngOnInit() {
    this.loadAllActivityTypes();
    // Initialize selectedActivityTypeId if there's a pre-selected activity type
    if (this.selectedActivityType) {
      this.selectedActivityTypeId = this.selectedActivityType.id;
    }
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadAllActivityTypes() {
    this.isLoading = true;
    this.hasError = false;

    this.activityService.getAllActivityTypes().pipe(
      takeUntil(this.destroy$),
      catchError(error => {
        console.error('Error loading activity types:', error);
        this.hasError = true;
        this.isLoading = false;
        return of([]);
      })
    ).subscribe(activityTypes => {
      this.allActivityTypes = activityTypes;
      this.filteredActivityTypes = activityTypes;
      this.isLoading = false;
    });
  }

  onSearchChange() {
    if (!this.searchQuery || this.searchQuery.trim().length === 0) {
      this.filteredActivityTypes = this.allActivityTypes;
      return;
    }

    const query = this.searchQuery.toLowerCase().trim();
    this.filteredActivityTypes = this.allActivityTypes.filter(activityType =>
      activityType.title.toLowerCase().includes(query) ||
      (activityType.description && activityType.description.toLowerCase().includes(query))
    );
  }

  selectActivityType(activityType: ActivityType) {
    this.selectedActivityTypeId = activityType.id;
    this.selectedActivityType = activityType;
    // Cerrar el modal inmediatamente al seleccionar
    this.save();
  }

  onSelectionChange(event: any) {
    const selectedId = event.detail.value;
    const selectedActivityType = this.allActivityTypes.find(type => type.id === selectedId);
    if (selectedActivityType) {
      this.selectedActivityType = selectedActivityType;
      // Cerrar el modal inmediatamente al seleccionar con radio button
      this.save();
    }
  }

  isSelected(activityType: ActivityType): boolean {
    return this.selectedActivityTypeId === activityType.id;
  }

  async dismiss() {
    await this.modalController.dismiss(null);
    this.modalDismissed.emit();
  }


  async save() {
    if (this.selectedActivityType) {
      this.activityTypeSelected.emit(this.selectedActivityType);
      await this.modalController.dismiss(this.selectedActivityType);
    }
  }

  trackByActivityType(index: number, activityType: ActivityType): any {
    return activityType.id;
  }
}
