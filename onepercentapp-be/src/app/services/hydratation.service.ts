import { inject, Injectable, input } from '@angular/core';
import { NavController } from '@ionic/angular/standalone';
import { SocialLoginPayload } from 'src/app/core/interfaces/social-login-payload.interface';
import { StorageKey } from 'src/app/core/interfaces/storage';

import {
    catchError,
    map,
    Observable,
    of,
    switchMap,
    tap,
    throwError,
    combineLatest,
} from 'rxjs';
import { StorageService } from './storage.service';
import { ApiCallService } from './api-call.service';
import { User } from '@capacitor-firebase/authentication';

/**
 * Auth Service
 */
@Injectable({
    providedIn: 'root',
})

export class HydrationService {
    private readonly basePath = '/hydration';

    getHydrationStatus(): Observable<{ color: string; status: string; }[]> {
        const mockHydration = [
            { color: '#E3EDFA', status: 'Excelente' },
            { color: '#E8FA96', status: 'Bueno' },
            { color: '#E4F504', status: 'Regular' },
            { color: '#F1D11A', status: 'Bajo' },
        ];
        return of(mockHydration);
    }

    sendHydrationStatus(selected: number) {
        console.log('Índice seleccionado:', selected);
    }

}