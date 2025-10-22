import { Component, OnInit, OnDestroy } from '@angular/core';
import { WeekTabsCalendarComponent } from 'src/app/shared/components/tabs-calendar/week-tabs-calendar/week-tabs-calendar.component';
import { IonRow, IonCol } from "@ionic/angular/standalone";
import { WeeklyProgressBarComponent } from './weekly-progress/weekly-progress-bar/weekly-progress-bar.component';
import { NumberOneAnimationComponent } from 'src/app/shared/components/number-one-animation/number-one-animation/number-one-animation.component';
import { NutritionService } from 'src/app/services/nutrition.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-weekly-menu',
  standalone: true,
  templateUrl: './weekly-menu.component.html',
  styleUrls: ['./weekly-menu.component.css'],
  imports: [IonCol, IonRow, WeekTabsCalendarComponent, WeeklyProgressBarComponent,NumberOneAnimationComponent]
})
export class WeeklyMenuComponent implements OnInit, OnDestroy {

  balancePoints: number = 0;
  physicalPoints: number = 0;
  physicalAnimationbumber: number = 0;
  nutritionPoints: number = 0;
  nutritionAnimationbumber: number = 0;
  minutePoints: number = 0;
  stepsPoints: number = 0;
  feedPoints: number = 0;
  activitityPoints: number = 0;
  fruitPoints: number = 0;

  private destroy$ = new Subject<void>();

  constructor(private nutritionService: NutritionService) { }

  ngOnInit() {
    console.log('WeeklyMenuComponent initialized');
    this.changePoints();
    this.initializeFruitsCount();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private initializeFruitsCount() {
    console.log('WeeklyMenuComponent - Initializing fruits count...');
    
    // First, load today's fruits count to get initial data
    this.nutritionService.getTodayFruitsCount()
      .pipe(takeUntil(this.destroy$))
      .subscribe(count => {
        this.fruitPoints = count;
        console.log('WeeklyMenuComponent - Today fruits count loaded:', count);
      });

    // Then subscribe to reactive updates for real-time changes
    this.nutritionService.getCurrentFruitsCount()
      .pipe(takeUntil(this.destroy$))
      .subscribe(count => {
        this.fruitPoints = count;
        console.log('WeeklyMenuComponent - Fruits count updated reactively:', count);
      });
  }

  changePoints(){
    this.balancePoints = Math.floor(Math.random() * 600);
    this.physicalPoints = Math.floor(Math.random() * 300);
    this.physicalAnimationbumber = this.physicalPoints/300 * 100;
    this.nutritionPoints = Math.floor(Math.random() * 300);
    this.nutritionAnimationbumber = this.nutritionPoints/300 * 100;
    this.minutePoints = Math.floor(Math.random() * 60);
    this.stepsPoints = Math.floor(Math.random() * 12000);
    this.feedPoints = Math.floor(Math.random() * 1000);
    this.activitityPoints = Math.floor(Math.random() * 5);
    // fruitPoints is now managed by initializeFruitsCount() - no random generation
  }

}
