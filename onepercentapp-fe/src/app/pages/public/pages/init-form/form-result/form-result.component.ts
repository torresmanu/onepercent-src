import { CommonModule } from '@angular/common';
import {
  Component,
  inject,
  OnInit,
  ViewChild,
  ElementRef,
} from '@angular/core';
import { IonContent, IonButton } from '@ionic/angular/standalone';
import { NavController } from '@ionic/angular/standalone';
import Chart from 'chart.js/auto';
import { LogoComponent } from '../../../../../shared/components/logo/logo.component';
import { Router, ActivatedRoute } from '@angular/router';
import labelPlugin from './plugins/label';
@Component({
  selector: 'app-form-result',
  standalone: true,
  imports: [IonButton, IonContent, CommonModule, LogoComponent],
  templateUrl: './form-result.component.html',
  styleUrls: ['./form-result.component.scss'],
})
export class FormResultComponent implements OnInit {
  private readonly navCtrl = inject(NavController);
  private registerForm: string = localStorage.getItem('registerform') ?? '';
  private route = inject(ActivatedRoute);
  public step: number = 0;
  public name: string = this.getUserName();

  /**
   * Safely parse user name from localStorage
   */
  private getUserName(): string {
    try {
      if (!this.registerForm || this.registerForm === '') {
        console.log('No register form data found, using default name');
        return 'Usuario'; // Default name
      }
      
      const parsedData = JSON.parse(this.registerForm);
      return parsedData?.firstname ?? 'Usuario';
    } catch (error) {
      console.error('Error parsing register form data:', error);
      return 'Usuario'; // Fallback name
    }
  }

  @ViewChild('healthChart') healthChartRef!: ElementRef<HTMLCanvasElement>;
  chartInstance: Chart | null = null;

  ngOnInit(): void {
    console.log('🎉 FormResultComponent loaded successfully');
    console.log('👤 User name:', this.name);
    console.log('📊 Step:', this.step);
  }

  continue() {
    this.step += 1;
    setTimeout(() => this.initChart(), 0);
  }

  goToRegister() {
    this.navCtrl.navigateForward(['/public/register']);
  }

  initChart() {
    if (this.healthChartRef) {
      if (this.chartInstance) {
        this.chartInstance.destroy();
      }
      const canvas = this.healthChartRef.nativeElement;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
      gradient.addColorStop(0, 'rgba(90, 158, 63, 0.15)');
      gradient.addColorStop(1, 'rgba(255, 255, 255, 1)');

      this.chartInstance = new Chart(this.healthChartRef.nativeElement, {
        type: 'line',
        data: {
          labels: ['', '', '', '', '', ''],
          datasets: [
            {
              data: [100, 200, 150, 400, 300, 600], // Example data
              fill: true,
              tension: 0.4,
              borderColor: '#5a9e3f',
              backgroundColor: (context: any) => {
                const chart = context.chart;
                const { ctx, chartArea } = chart;
                if (!chartArea) {
                  return null;
                }
                const gradient = ctx.createLinearGradient(
                  0,
                  chartArea.top,
                  0,
                  chartArea.bottom
                );
                gradient.addColorStop(0, 'rgba(90, 158, 63, 0.15)');
                gradient.addColorStop(1, 'rgba(255, 255, 255, 1)');
                return gradient;
              },
              pointRadius: 0,
            },
          ],
        },
        options: {
          responsive: true,
          layout: {
            padding: {
              top: 10,
              right: 16,
              left: 9,
              bottom: 0,
            },
          },
          plugins: {
            legend: { display: false },
            tooltip: { enabled: false },
          },
          scales: {
            x: {
              border: { display: true, color: 'black' },
              grid: { display: false, color: '#eee' },
              ticks: {
                align: 'center',
                font: {
                  family: 'Arial',
                  size: 12,
                  weight: 'normal',
                },
                color: '#000',
              },
            },
            y: {
              grid: { color: '#eee' },
              border: { display: false },
              ticks: {
                display: false,
                stepSize: 150,
              },
            },
          },
        },
        plugins: [labelPlugin],
      });
    }
  }
}
