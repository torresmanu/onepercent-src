import { CommonModule } from '@angular/common';
import { Component, EventEmitter, OnInit, Output, OnDestroy } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { NutritionService } from 'src/app/services/nutrition.service';
import { Subject, takeUntil } from 'rxjs';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
  ],
  selector: 'app-fruit-slide',
  templateUrl: './fruit-slide.component.html',
  styleUrls: ['./fruit-slide.component.scss'],
})
export class FruitSlideComponent implements OnInit, OnDestroy {
  @Output() puntosChange = new EventEmitter<number>();
  puntosActuales: number = 0;
  fruitsCount: number = 0;
  private destroy$ = new Subject<void>();

  constructor(private nutritionService: NutritionService) {}

  ngOnInit() {
    // Load today's fruits count first
    this.nutritionService.getTodayFruitsCount()
      .pipe(takeUntil(this.destroy$))
      .subscribe(count => {
        console.log('FruitSlideComponent - Today fruits count:', count);
        this.fruitsCount = count;
        this.puntosActuales = count * 25; // 25 points per fruit portion
        this.puntosChange.emit(this.puntosActuales);
      });

    // Also subscribe to current state for reactive updates
    this.nutritionService.getCurrentFruitsCount()
      .pipe(takeUntil(this.destroy$))
      .subscribe(count => {
        console.log('FruitSlideComponent - Current fruits count:', count);
        this.fruitsCount = count;
        this.puntosActuales = count * 25; // 25 points per fruit portion
        this.puntosChange.emit(this.puntosActuales);
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  actualizarPuntos(nuevosPuntos: number) {
    this.puntosActuales = nuevosPuntos;
    this.puntosChange.emit(this.puntosActuales);
  }
}