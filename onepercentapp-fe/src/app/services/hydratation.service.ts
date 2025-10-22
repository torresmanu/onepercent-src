import { inject, Injectable } from '@angular/core';
import { Observable, of, map, catchError } from 'rxjs';
import { ApiCallService } from './api-call.service';

/**
 * Hydration Service
 */
@Injectable({
    providedIn: 'root',
})
export class HydrationService {
    private apiCallService = inject(ApiCallService);

    getHydrationStatus(): Observable<{ color: string; status: string; }[]> {
        const mockHydration = [
            { color: '#E3EDFA', status: 'Excelente' },
            { color: '#E8FA96', status: 'Bueno' },
            { color: '#E4F504', status: 'Regular' },
            { color: '#F1D11A', status: 'Bajo' },
        ];
        return of(mockHydration);
    }

    sendHydrationStatus(selectedIndex: number): Observable<any> {
        const colors = ['#E3EDFA', '#E8FA96', '#E4F504', '#F1D11A'];
        const peeColor = colors[selectedIndex];
        
        return this.apiCallService.post('/user-hydration', { peeColor });
    }

    /**
     * Get today's hydration records and map them to display format
     */
    getTodayHydrationRecords(): Observable<{ status: string; hour: string }[]> {
        console.log('HydrationService - Fetching today hydration records...');
        return this.apiCallService.get<any>('/user-hydration/today').pipe(
            map((response: any) => {
                console.log('HydrationService - Raw response from API:', response);
                
                // Handle different response structures
                let records: any[] = [];
                if (Array.isArray(response)) {
                    records = response;
                } else if (response && Array.isArray(response.data)) {
                    records = response.data;
                } else {
                    console.warn('HydrationService - Unexpected response structure:', response);
                    return [];
                }
                
                console.log('HydrationService - Extracted records:', records);
                const mappedRecords = records.map(record => {
                    const status = this.mapPeeColorToStatus(record.peeColor);
                    const hour = this.formatTime(record.createdAt);
                    console.log('HydrationService - Mapped record:', { status, hour, originalRecord: record });
                    return { status, hour };
                });
                console.log('HydrationService - Final mapped records:', mappedRecords);
                return mappedRecords;
            }),
            catchError(error => {
                console.error('HydrationService - Error fetching hydration records:', error);
                console.error('HydrationService - Error details:', error.status, error.message);
                return of([]);
            })
        );
    }

    /**
     * Map pee color to hydration status
     */
    private mapPeeColorToStatus(peeColor: string): string {
        const colorMap: { [key: string]: string } = {
            '#E3EDFA': 'Hidratación excelente',  // Excelente - color claro
            '#E8FA96': 'Hidratación buena',      // Bueno - color amarillo claro
            '#E4F504': 'Hidratación regular',    // Regular - color amarillo
            '#F1D11A': 'Hidratación baja'        // Bajo - color amarillo oscuro
        };
        return colorMap[peeColor] || 'Hidratación baja';
    }

    /**
     * Format time to display format (e.g., "9:00 am")
     */
    private formatTime(dateString: string): string {
        const date = new Date(dateString);
        return date.toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true
        });
    }
}
