import { CommonModule } from '@angular/common';
import { Component, EventEmitter, OnInit, OnDestroy, Output } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { NutritionService } from 'src/app/services/nutrition.service';
import { Subject, takeUntil } from 'rxjs';

@Component({
  standalone: true,
  imports: [CommonModule, TranslateModule],
  selector: 'app-water-slide',
  templateUrl: './water-slide.component.html',
  styleUrls: ['./water-slide.component.scss'],
})
export class WaterSlideComponent implements OnInit, OnDestroy {
  @Output() puntosChange = new EventEmitter<number>();
  puntosActuales!: number;
  nivelHidratacion!: string;
  
  private destroy$ = new Subject<void>();

  constructor(private nutritionService: NutritionService) { }

  ngOnInit() {
    // Subscribe to reactive hydration points updates
    this.nutritionService.getCurrentHydrationPoints()
      .pipe(takeUntil(this.destroy$))
      .subscribe(points => {
        console.log('WaterSlideComponent - Hydration points updated:', points);
        this.puntosActuales = points;
        this.nivelHidratacion = this.nutritionService.getHydrationLevel(points);
        this.puntosChange.emit(this.puntosActuales);
      });

    // Initial calculation
    this.calculateAndUpdatePoints();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private calculateAndUpdatePoints() {
    this.nutritionService.getNutritionData('water').subscribe(value => {
      this.puntosActuales = value;
      this.nivelHidratacion = this.nutritionService.getHydrationLevel(value);
      this.puntosChange.emit(this.puntosActuales);
      console.log('WaterSlideComponent - Points updated:', value, 'Level:', this.nivelHidratacion);
    });
  }

  actualizarPuntos(nuevosPuntos: number) {
    this.puntosActuales = nuevosPuntos;
    this.nivelHidratacion = this.nutritionService.getHydrationLevel(nuevosPuntos);
    this.puntosChange.emit(this.puntosActuales);
  }
}
