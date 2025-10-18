import { inject, Injectable } from '@angular/core';
import { Health, HealthPermission, HealthPlugin } from 'capacitor-health';
import { catchError, Observable, throwError } from 'rxjs';
import { ApiCallService } from './api-call.service';


const PERMISSIONS: HealthPermission[] = ['READ_STEPS', 'READ_DISTANCE'];

export interface DailySteps {
  date: string;  
  steps: number;
}

@Injectable({ providedIn: 'root' })

export class HealthService {


    private readonly apiCallService = inject(ApiCallService);
  

 async ensureAvailable(): Promise<boolean> {
    const { available } = await Health.isHealthAvailable();
    console.log('[Health] available:', available);
    return available;
  }


    async requestPermissions(): Promise<void> {
    await Health.requestHealthPermissions({
      permissions: ['READ_STEPS', 'READ_DISTANCE']
    });
  }



  async checkPermissions(): Promise<boolean> {
    const res = await Health.checkHealthPermissions({ permissions: PERMISSIONS });
    // res.permissions: [{ permission: 'READ_STEPS', granted: boolean }, ...]
    console.log('Health permissions:', res.permissions);
    const allGranted = res.permissions?.every(p => p) ?? false;
    return allGranted;
  }

  async getTodaySteps(): Promise<number> {
  const start = new Date();
  start.setHours(0, 0, 0, 0);   // medianoche de hoy
  const end = new Date();       // ahora

  const res: any = await Health.queryAggregated({
    dataType: 'steps',
    startDate: start.toISOString(),
    endDate: end.toISOString(),
    bucket: 'day'
  });

  console.log('[Health] aggregated steps:', res);

  // el resultado puede venir en res.aggregatedData[0].value
  const v = Array.isArray(res?.aggregatedData)
    ? res.aggregatedData[0]?.value
    : res?.value;

  return Number(v ?? 0);
}


async getMonthlyDailySteps(year?: number, month?: number): Promise<DailySteps[]> {
    const now = new Date();
    const y = year ?? now.getFullYear();
    const m = month ?? now.getMonth(); // 0-11

    // Rango del mes en hora local
    const start = new Date(y, m, 1, 0, 0, 0, 0);
    const end   = new Date(y, m + 1, 0, 23, 59, 59, 999);

    // 1) Pedimos agregados por día
    const { aggregatedData } = await Health.queryAggregated({
      startDate: start.toISOString(),
      endDate: end.toISOString(),
      dataType: 'steps',
      bucket: 'day',
    });

    // 2) Pasamos a mapa YYYY-MM-DD -> pasos
    const byDay = new Map<string, number>();
    for (const a of aggregatedData ?? []) {
      const d = this.toLocalYMD(new Date(a.startDate));
      byDay.set(d, (a.value ?? 0));
    }

    // 3) Rellenamos todos los días del mes con 0 si faltan
    const out: DailySteps[] = [];
    for (let day = 1; day <= this.daysInMonth(y, m); day++) {
      const d = this.toLocalYMD(new Date(y, m, day, 0, 0, 0, 0));
      out.push({ date: d, steps: byDay.get(d) ?? 0 });
    }

    return out;
  }

  private daysInMonth(year: number, month0to11: number): number {
    return new Date(year, month0to11 + 1, 0).getDate();
  }

  private toLocalYMD(d: Date): string {
    // Fecha local normalizada a 'YYYY-MM-DD'
    const y = d.getFullYear();
    const m = (d.getMonth() + 1).toString().padStart(2, '0');
    const day = d.getDate().toString().padStart(2, '0');
    return `${y}-${m}-${day}`;
  }

  sendMonthlyStepsToServer(steps: DailySteps[]): Observable<any> {
      return this.apiCallService
        .post(`/user-activity/addUserStepsByDateArray`, {
         data:steps
        })
        .pipe(
          catchError((error) => {
            console.error('Error en AuthService.recoverPassword:', error);
            return throwError(() => error);
          })
        );
    }
}