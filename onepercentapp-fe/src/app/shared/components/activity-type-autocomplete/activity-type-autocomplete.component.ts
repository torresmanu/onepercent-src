import { Component, EventEmitter, HostListener, inject, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { debounceTime, distinctUntilChanged, filter, Subject, switchMap, takeUntil, catchError, of, tap } from 'rxjs';
import { ActivityService, ActivityType } from '@src/app/services/activity.service';

@Component({
  selector: 'app-activity-type-autocomplete',
  standalone: true,
  imports: [
    CommonModule,
    IonicModule,
    ReactiveFormsModule,
    TranslateModule
  ],
  templateUrl: './activity-type-autocomplete.component.html',
  styleUrls: ['./activity-type-autocomplete.component.scss']
})
export class ActivityTypeAutocompleteComponent implements OnInit, OnDestroy {
  @Input() control!: FormControl;
  @Input() placeholder: string = 'Buscar tipo de actividad';
  @Output() activityTypeSelected = new EventEmitter<ActivityType>();

  private activityService = inject(ActivityService);
  private destroy$ = new Subject<void>();

  searchResults: ActivityType[] = [];
  isLoading = false;
  hasError = false;
  showDropdown = false;
  selectedIndex = -1;

  ngOnInit() {
    if (!this.control) {
      this.control = new FormControl('');
    }

    this.control.valueChanges
      .pipe(
        takeUntil(this.destroy$),
        tap(() => {
          this.isLoading = true;
          this.hasError = false;
        }),
        debounceTime(300),
        distinctUntilChanged(),
        filter(query => typeof query === 'string'),
        switchMap(query => {
          if (!query || query.length < 2) {
            this.isLoading = false;
            this.showDropdown = false;
            return of([]);
          }
          
          return this.activityService.searchActivityTypes(query).pipe(
            catchError(error => {
              console.error('Error searching activity types:', error);
              this.hasError = true;
              this.isLoading = false;
              return of([]);
            })
          );
        })
      )
      .subscribe(results => {
        this.searchResults = results;
        this.isLoading = false;
        this.showDropdown = results.length > 0 || this.control.value?.length >= 2;
        this.selectedIndex = -1;
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onInputFocus() {
    // Show all activity types when focused, or filtered results if there's a query
    if (this.control.value && this.control.value.length >= 2) {
      this.showDropdown = true;
    } else if (!this.control.value || this.control.value.length === 0) {
      // Load all activity types when input is focused and empty
      this.loadAllActivityTypes();
    }
  }

  onInputBlur() {
    // Delay to allow click on dropdown item
    setTimeout(() => {
      this.showDropdown = false;
      this.selectedIndex = -1;
    }, 200);
  }

  selectActivityType(activityType: ActivityType) {
    this.activityTypeSelected.emit(activityType);
    this.control.setValue('');
    this.showDropdown = false;
    this.searchResults = [];
    this.selectedIndex = -1;
  }

  onKeyDown(event: KeyboardEvent) {
    if (!this.showDropdown || this.searchResults.length === 0) {
      return;
    }

    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        this.selectedIndex = Math.min(this.selectedIndex + 1, this.searchResults.length - 1);
        this.scrollToSelected();
        break;
      case 'ArrowUp':
        event.preventDefault();
        this.selectedIndex = Math.max(this.selectedIndex - 1, -1);
        this.scrollToSelected();
        break;
      case 'Enter':
        event.preventDefault();
        if (this.selectedIndex >= 0 && this.selectedIndex < this.searchResults.length) {
          this.selectActivityType(this.searchResults[this.selectedIndex]);
        }
        break;
      case 'Escape':
        event.preventDefault();
        this.showDropdown = false;
        this.selectedIndex = -1;
        break;
    }
  }

  private scrollToSelected() {
    const dropdown = document.querySelector('.autocomplete-dropdown');
    const selected = document.querySelector('.autocomplete-item.selected');
    if (dropdown && selected) {
      selected.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
    }
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if (!target.closest('.activity-type-autocomplete-container')) {
      this.showDropdown = false;
      this.selectedIndex = -1;
    }
  }

  get showNoResults(): boolean {
    return !this.isLoading && 
           !this.hasError && 
           this.showDropdown && 
           this.searchResults.length === 0 && 
           this.control.value?.length >= 2;
  }

  get showMinChars(): boolean {
    return !this.isLoading && 
           !this.hasError && 
           this.showDropdown && 
           this.control.value?.length > 0 && 
           this.control.value?.length < 2;
  }

  private loadAllActivityTypes() {
    this.isLoading = true;
    this.hasError = false;
    
    this.activityService.getAllActivityTypes()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (activityTypes) => {
          this.searchResults = activityTypes;
          this.isLoading = false;
          this.showDropdown = activityTypes.length > 0;
          this.selectedIndex = -1;
        },
        error: (error) => {
          console.error('Error loading all activity types:', error);
          this.hasError = true;
          this.isLoading = false;
          this.showDropdown = false;
        }
      });
  }
}
