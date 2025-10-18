import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { IonIcon } from "@ionic/angular/standalone";

@Component({
  standalone: true,
  imports: [IonIcon,CommonModule ],
  selector: 'app-loader-form-results',
  templateUrl: './loader-form-results.component.html',
  styleUrls: ['./loader-form-results.component.scss'],
})
export class LoaderFormResultsComponent  implements OnInit {
  @Output() finished = new EventEmitter<void>();
 
  percentage = 0;


  steps: string[] = [
    'Evaluando tus hábitos de actividad física',
    'Evaluando tus hábitos alimenticios',
    'Basado en recomendaciones  de la Organización Mundial de la Salud',
  ];

  get stepIndex(): number {
    if (this.percentage >= 75) return 3;
    if (this.percentage >= 50) return 2;
    if (this.percentage >= 25) return 1;
    return 0;
  }

  ngOnInit(): void {
    // Reduced times for faster testing (original: [1500, 4000, 6000, 8000])
    const times = [500, 1000, 1500, 2000];
    const values = [25, 50, 75, 100];

    console.log('🔄 Loader initialized - starting progress animation');

    values.forEach((val, i) => {
      setTimeout(() => {
        this.percentage = val;
        console.log(`📈 Progress updated to ${val}%`);
        
        if (val === 100) {
          console.log('📊 Loader reached 100% - waiting 1 second before emitting finished event');
          setTimeout(() => {
            console.log('🎯 Emitting finished event from loader');
            this.finished.emit();
          }, 1000); // Reduced from 3000ms to 1000ms for testing
        }
      }, times[i]);
    });

  }
}