import { Component, inject, OnInit } from '@angular/core';
import { HealthService } from '@src/app/services/healthService';
import { IonContent } from "@ionic/angular/standalone";

@Component({
  selector: 'app-healt-test',
  standalone: true,
  imports: [IonContent, ],
  templateUrl: './healt-test.component.html',
  styleUrls: ['./healt-test.component.scss'],
})
export class HealtTestComponent implements OnInit {

steps: number | null = null;

  healthService = inject(HealthService);
monthlySteps: any;

  async ngOnInit() {
    const available = await this.healthService.ensureAvailable();
    if (!available) {
      console.log('Health plugin is not available');
      return;
    }

    await this.healthService.requestPermissions();
    
    await this.healthService.getTodaySteps().then(steps => {
      console.log('Steps today:', steps);
      this.steps = steps;
    }).catch(err => {
      console.error('Error getting steps:', err);
    });


  // Año y mes actual
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth(); // 0=enero, 11=diciembre

  // Pasos diarios del mes actual
 this.monthlySteps = await this.healthService.getMonthlyDailySteps(year, month);
  console.log(`Daily steps for ${month + 1}/${year}:`, this.monthlySteps);

  this.sendMonthlySteps();
  }

  async sendMonthlySteps() {
      const response = await this.healthService.sendMonthlyStepsToServer(this.monthlySteps).subscribe({
        next: (res) => {
          console.log('Monthly steps sent successfully:', res);
        },
        error: (err) => {
          console.error('Error sending monthly steps:', err);
        }
      });
    
  }
}
