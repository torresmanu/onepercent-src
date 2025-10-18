import {
  AfterViewInit,
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  ElementRef,
  ViewChild,
  inject
} from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { HeaderComponent } from '@src/app/shared/components/header/header.component';
import { IonContent } from "@ionic/angular/standalone";
import { DateProgressComponent } from './date-progress/date-progress.component';
import { SplitSlideComponent } from '../split-slide/split-slide.component';
import { WaterSlideComponent } from '../water-slide/water-slide.component';
import { FruitSlideComponent } from '../fruit-slide/fruit-slide.component';
import { ProgressBarComponent } from '../progress-bar/progress-bar.component';
import { CommonModule } from '@angular/common';
import { User } from '@capacitor-firebase/authentication';
import { NutritionService } from '@src/app/services/nutrition.service';
import { StorageService } from '@src/app/services/storage.service';

// Chart.js
import {
  Chart,
  LineController,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Title,
  Tooltip,
  Filler
} from 'chart.js';

// Registrar los elementos necesarios de Chart.js
Chart.register(
  LineController,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Title,
  Tooltip,
  Filler
);

@Component({
  standalone: true,
  imports: [
    IonContent,
    HeaderComponent,
    TranslateModule,
    CommonModule,
    DateProgressComponent,
    SplitSlideComponent,
    WaterSlideComponent,
    FruitSlideComponent,
    ProgressBarComponent
  ],
  selector: 'app-progres-day',
  templateUrl: './progres-day.component.html',
  styleUrls: ['./progres-day.component.scss'],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class ProgresDayComponent implements AfterViewInit {
  private nutritionService = inject(NutritionService);
  private storageService = inject(StorageService);

  puntosSplit = 0;
  puntosFruit = 0;
  puntosWater = 0;

  rutaIconoHidratacion = 'assets/imgs/nutrition/glass-green.svg'; // O la ruta que corresponda

  user: User | null = null;

  hydrateRegister: any[] = [];
  foodData: any[] = [];

  slides = [
    { type: 'split' },
    { type: 'double' },
  ];

  get puntosTotales(): number {
    return this.puntosSplit + this.puntosFruit + this.puntosWater;
  }

  @ViewChild('dailyChart') dailyChartRef!: ElementRef<HTMLCanvasElement>;
  chart!: Chart;

  constructor() { }

  ngAfterViewInit() {
    this.initChart();
  }

  initChart() {
    const ctx = this.dailyChartRef.nativeElement.getContext('2d');
    if (!ctx) return;

    const datos = this.getDataPoints();

    this.chart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: ['00:00', '08:00', '13:00', '18:00', '23:59'],
        datasets: [{
          data: datos,
          borderColor: '#BCDF84',
          backgroundColor: 'transparent',
          pointRadius: 0,
          tension: 0.3,
          borderWidth: 2,
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: { enabled: false },
        },
        scales: {
          x: {
            ticks: { color: '#333', font: { size: 10 } },
            grid: { display: false },
          },
          y: {
            min: 0,
            max: 500,
            ticks: { color: '#333', stepSize: 100, font: { size: 10 } },
            grid: { color: '#ccc', lineWidth: 0.5 },
          }
        }
      }
    });
  }

  getDataPoints(): number[] {
    const puntosSplit = this.puntosSplit;
    const puntosFruit = this.puntosFruit;
    const puntosWater = this.puntosWater;

    const total1 = puntosSplit;
    const total2 = total1 + puntosFruit;
    const total3 = total2 + puntosWater;

    return [0, total1, total2, total3, total3];
  }

  events = [
    {
      time: '06:00 - 07:00 hs',
      title: 'Desayuno',
      subtitle: '',
      points: 60,
    },
    {
      time: '08:00 - 09:00 hs',
      title: 'Hidratación',
      subtitle: 'baja',
      points: 25,
    },
    {
      time: '12:00 - 13:00 hs',
      title: 'Comida',
      subtitle: '',
      points: 30,
    },
  ];


}
