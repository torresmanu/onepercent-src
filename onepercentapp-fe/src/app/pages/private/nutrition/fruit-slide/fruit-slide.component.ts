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
  selector: 'app-fruit-slide',
  templateUrl: './fruit-slide.component.html',
  styleUrls: ['./fruit-slide.component.scss'],
})
export class FruitSlideComponent implements OnInit {
  @Output() puntosChange = new EventEmitter<number>();
  puntosActuales!: number;

  constructor(private nutritionService: NutritionService) {}

  ngOnInit() {
    this.nutritionService.getNutritionData('fruit').subscribe(value => {
      this.puntosActuales = value;
      this.puntosChange.emit(this.puntosActuales);
    });
  }

  actualizarPuntos(nuevosPuntos: number) {
    this.puntosActuales = nuevosPuntos;
    this.puntosChange.emit(this.puntosActuales);
  }
}