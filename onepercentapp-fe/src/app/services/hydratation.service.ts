import { inject, Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
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
}
