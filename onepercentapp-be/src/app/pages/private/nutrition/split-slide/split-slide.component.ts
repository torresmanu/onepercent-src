import { CommonModule } from '@angular/common';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { NutritionService } from 'src/app/services/nutrition.service';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
  ],
  selector: 'app-split-slide',
  templateUrl: './split-slide.component.html',
  styleUrls: ['./split-slide.component.scss'],
})
export class SplitSlideComponent implements OnInit {

  @Output() puntosChange = new EventEmitter<number>();
  puntosActuales!: number;

  constructor(private nutritionService: NutritionService) {}

  ngOnInit() {
    this.nutritionService.getNutritionData('split').subscribe(value => {
      this.puntosActuales = value;
      this.puntosChange.emit(this.puntosActuales);
    });
  }

  someMethodThatChangesPoints(newValue: number) {
    this.puntosActuales = newValue;
    this.puntosChange.emit(this.puntosActuales);
  }
}