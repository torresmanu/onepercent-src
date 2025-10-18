import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import {IonButton, IonIcon, IonRow, IonCol } from "@ionic/angular/standalone";

@Component({
  standalone: true,
  selector: 'app-week-tabs-calendar',
  templateUrl: './week-tabs-calendar.component.html',
  styleUrls: ['./week-tabs-calendar.component.css'],
    imports: [IonCol, IonRow,
    IonButton,
    IonIcon,
  ],
})
export class WeekTabsCalendarComponent implements OnInit {

  currentDate: Date = new Date();
  @Output() updatePoints = new EventEmitter<any>()
  weekDays: string[] = ["L", "M", "X", "J", "V", "S", "D"];
  icons: number[] = [1, 2, 3, 4, 5, 6,7]
  imagenesArray: (string | null)[] = [];

  constructor() { }

  ngOnInit() {
    console.log('WeekTabsCalendarComponent initialized');
    this.updateContent(); // Llama a la función para actualizar los puntos al iniciar
    this.updateIcons(); // Llama a la función para actualizar las imágenes al iniciar
  }

  getWeekRange(): string {
    const startOfWeek = new Date(this.currentDate);
    const endOfWeek = new Date(this.currentDate);
    endOfWeek.setDate(startOfWeek.getDate() + 6);

    const startStr = startOfWeek.toLocaleDateString('es-ES', { day: 'numeric' });
    const month = startOfWeek.toLocaleDateString('es-ES', { month: 'long' });
    const year = startOfWeek.getFullYear();

    return `Del ${startStr} al ${endOfWeek.getDate()} de ${month}, ${year}`;
  }

  previousWeek() {
    this.currentDate.setDate(this.currentDate.getDate() - 7);
    this.currentDate = new Date(this.currentDate); // Para que se actualice el binding
    this.updateContent(); // Llama a la función para actualizar los puntos
  }

  nextWeek() {
    this.currentDate.setDate(this.currentDate.getDate() + 7);
    this.currentDate = new Date(this.currentDate); // Para que se actualice el binding
    this.updateContent(); // Llama a la función para actualizar los puntos
  }

  updateContent(){
     this.updatePoints.emit(); // Llama a la función para actualizar los puntos
     // función para seleccionar 3 elementos de un array de manera randomica
     this.updateIcons();
     console.log('Content updated with new points and random images');

  }

   updateIcons(): void {
    const totalElementos = 7;
    const resultado: string[] = [];

    // Primero generamos 2 imágenes A o B para asegurar su presencia
    const imagenesFijas = [
      Math.random() < 0.5 ? 'elipses.svg' : 'elipses_full.svg',
      Math.random() < 0.5 ? 'elipses.svg' : 'elipses_full.svg'
    ];

    // Generamos 5 imágenes adicionales aleatorias
    for (let i = 0; i < totalElementos - imagenesFijas.length; i++) {
      resultado.push(Math.random() < 0.5 ? 'elipses.svg' : 'elipses_full.svg');
    }

    // Insertamos las 2 imágenes fijas en posiciones aleatorias
    for (const imagen of imagenesFijas) {
      const posicionAleatoria = Math.floor(Math.random() * (resultado.length + 1));
      resultado.splice(posicionAleatoria, 0, imagen);
    }
    this.imagenesArray = resultado;
  }

}
