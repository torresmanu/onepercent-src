import { CommonModule } from '@angular/common';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { NutritionService } from 'src/app/services/nutrition.service';

@Component({
  standalone: true,
  imports: [CommonModule, TranslateModule],
  selector: 'app-water-slide',
  templateUrl: './water-slide.component.html',
  styleUrls: ['./water-slide.component.scss'],
})
export class WaterSlideComponent implements OnInit {
  @Output() puntosChange = new EventEmitter<number>();
  puntosActuales!: number;

  constructor(private nutritionService: NutritionService) { }

  ngOnInit() {
    this.nutritionService.getNutritionData('water').subscribe(value => {
      this.puntosActuales = value;
      this.puntosChange.emit(this.puntosActuales);
    });
  }

  actualizarPuntos(nuevosPuntos: number) {
    this.puntosActuales = nuevosPuntos;
    this.puntosChange.emit(this.puntosActuales);
  }
}
