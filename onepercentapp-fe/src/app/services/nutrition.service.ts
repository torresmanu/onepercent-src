import { inject, Injectable } from '@angular/core';
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
  BehaviorSubject,
  shareReplay,
} from 'rxjs';
import { StorageService } from './storage.service';
import { ApiCallService } from './api-call.service';
import { User } from '@capacitor-firebase/authentication';
import { image } from 'ionicons/icons';

/**
 * Nutrition Service
 */
@Injectable({
  providedIn: 'root',
})
export class NutritionService {
  private readonly basePath = '/nutrition';
  private apiCallService = inject(ApiCallService);

  // Ingredientes temporales para el registro de comida
  private tempIngredients: any[] = [];

  // Estado reactivo para el conteo de frutas
  private fruitsCountSubject = new BehaviorSubject<number>(0);
  private lastFruitsCountDate: string | null = null;
  private fruitsCountCache$: Observable<number> | null = null;

  getIngredients(): any[] {
    return this.tempIngredients;
  }

  getIngredientByIndex(index: number): any {
    return this.tempIngredients[index];
  }

  /**
   * Set ingredients for food registration
   * Used when navigating from a recipe to pre-load its ingredients
   */
  setIngredients(ingredients: any[]): void {
    this.tempIngredients = ingredients;
  }

  /**
   * Clear all ingredients from temporary storage
   */
  clearIngredients(): void {
    this.tempIngredients = [];
  }

  /**
   * Get today's fruits count with reactive state management
   * Uses cache to avoid unnecessary API calls
   */
  getTodayFruitsCount(): Observable<number> {
    const today = new Date().toISOString().split('T')[0];
    
    // If we already have data for today, return cached observable
    if (this.lastFruitsCountDate === today && this.fruitsCountCache$) {
      return this.fruitsCountCache$;
    }

    // Create new observable for today's data
    this.fruitsCountCache$ = this.apiCallService.get<any>('/user-meal/fruits/today').pipe(
      map(response => {
        console.log('NutritionService - Raw API response:', response);
        // El backend devuelve { statusCode: 200, data: number }
        if (response && response.data && typeof response.data === 'number') {
          const count = Math.floor(response.data);
          console.log('NutritionService - Fruits count from data:', count);
          return count; // Solo números enteros
        }
        // Si la respuesta ya es un número directamente (por compatibilidad)
        if (typeof response === 'number') {
          const count = Math.floor(response);
          console.log('NutritionService - Fruits count direct:', count);
          return count;
        }
        console.log('NutritionService - No valid data found, returning 0');
        return 0;
      }),
      tap(count => {
        this.fruitsCountSubject.next(count);
        this.lastFruitsCountDate = today;
      }),
      catchError(error => {
        console.error('Error fetching fruits count:', error);
        return of(0);
      }),
      shareReplay(1)
    );

    return this.fruitsCountCache$;
  }

  /**
   * Get current fruits count from reactive state
   */
  getCurrentFruitsCount(): Observable<number> {
    return this.fruitsCountSubject.asObservable();
  }

  /**
   * Update fruits count after meal registration
   * This should be called after successfully saving a meal
   */
  updateFruitsCountAfterMeal(): void {
    // Invalidate cache to force refresh on next request
    this.lastFruitsCountDate = null;
    this.fruitsCountCache$ = null;
    
    // Refresh data immediately and update reactive state
    this.getTodayFruitsCount().subscribe(count => {
      this.fruitsCountSubject.next(count);
      console.log('NutritionService - Fruits count updated after meal:', count);
    });
  }

  /**
   * Force refresh of fruits count
   */
  refreshFruitsCount(): Observable<number> {
    this.lastFruitsCountDate = null;
    this.fruitsCountCache$ = null;
    return this.getTodayFruitsCount();
  }

  /**
   * Clear user-specific data when user changes
   * This should be called on logout or user switch
   */
  clearUserData(): void {
    console.log('NutritionService - Clearing user data');
    // Reset reactive state
    this.fruitsCountSubject.next(0);
    
    // Clear cache
    this.lastFruitsCountDate = null;
    this.fruitsCountCache$ = null;
    
    // Clear temporary ingredients
    this.tempIngredients = [];
    
    console.log('NutritionService - User data cleared');
  }

  getNutritionData(type: 'split' | 'water' | 'fruit'): Observable<number> {
    const mockValues = {
      split: 33,
      water: 22,
      fruit: 11,
    };

    return of(mockValues[type]);
  }

  getHydrateRegister(): Observable<{ status: string; hour: string }[]> {
    const mockHydration = [
      { status: 'Hidratación baja', hour: '9:00 am' },
      { status: 'Hidratación media', hour: '12:00 pm' },
      { status: 'Hidratación óptima', hour: '18:00 pm' },
    ];
    return of(mockHydration);
  }

  getFoodData(): Observable<any[]> {
    const mockFood = {
      desayuno: {
        title: 'Desayuno',
        recommended: '635 - 889 kcal',
        items: [
          { text: 'Café con leche 300 ml', kcal: 50 },
          { text: 'Sándwich mixto 100 g', kcal: 250 },
          { text: 'Nueces 20 g', kcal: 150 },
        ],
        total: 450,
        points: [true, true, true, false],
        icon: '/assets/imgs/nutrition/breakfast.svg',
      },
      comida: {
        title: 'Comida',
        recommended: '802 - 1122 kcal',
        items: [
          { text: 'Ensalada mixta 150 g', kcal: 80 },
          { text: 'Pechuga de pollo 120 g', kcal: 180 },
          { text: 'Arroz integral 100 g', kcal: 110 },
        ],
        total: 370,
        points: [true, true, false, false],
        icon: '/assets/imgs/nutrition/lunch.svg',
      },
      cena: {
        title: 'Cena',
        recommended: '635 - 889 kcal',
        items: [
          { text: 'Crema de verduras 200 g', kcal: 90 },
          { text: 'Tortilla francesa 2 huevos', kcal: 140 },
          { text: 'Pan integral 40 g', kcal: 100 },
        ],
        total: 330,
        points: [true, true, false, false],
        icon: '/assets/imgs/nutrition/dinner.svg',
      },
      snack: {
        title: 'Snack',
        recommended: '200 - 400 kcal',
        items: [
          { text: 'Yogur natural 125 g', kcal: 70 },
          { text: 'Fruta variada 100 g', kcal: 50 },
          { text: 'Barrita de cereales 1 ud', kcal: 90 },
        ],
        total: 210,
        points: [true, true, false, false],
        icon: '/assets/imgs/nutrition/snack.svg',
      },
    };

    const foodArray = Object.entries(mockFood).map(([name, data]) => ({
      name,
      ...data,
    }));
    return of(foodArray);
  }


getRecipeDetail(id: string): Observable<any> {
  const categories = ['dinner', 'lunch', 'breakfast', 'snack'];
  const randomCategory = categories[Math.floor(Math.random() * categories.length)];
  const mockRecipeDetail = {
    id,
    category: randomCategory,
    kcal: 742,
    time: '30 min',
    quality: {
      number: 3,
      text: 'calidad Excelente',
    },
    nutritionalInfo: {
      calories: 742,
      protein: 45,
      carbs: 60,
      fat: 30,
      fiber: 10,
    },
    instructions: [
      { step: 1, text: 'Cocinar el pollo a la parrilla.' },
      { step: 2, text: 'Mezclar todos los ingredientes en un bol.' },
      { step: 3, text: 'Servir frío.' }
    ],
    featured: false,
    image: '/assets/imgs/nutrition/recipe-detail.jpg',
    title: 'Ensalada César',
    description: 'Una deliciosa ensalada con pollo, lechuga y aderezo César.',
    ingredients: [
      { name: 'Pollo', quantity: 200, measurament: 'g' },
      { name: 'Lechuga', quantity: 100, measurament: 'g' },
      { name: 'Queso parmesano', quantity: 50, measurament: 'g' },
      { name: 'Aderezo César', quantity: 30, measurament: 'ml' },
    ],
    imageUrl: '../../../../../../assets/imgs/welcome-final.png',
  };
  return of(mockRecipeDetail);
}

searchIngredients(query: string): Observable<any[]> {
  if (!query || query.length < 2) {
    return of([]);
  }
  return this.apiCallService.get<any>(`/ingredient/search?query=${encodeURIComponent(query)}`).pipe(
    map(response => {
      // El backend devuelve { statusCode: 200, data: [...] }
      // Esto es debido al ResponseFormatInterceptor global
      if (response && response.data && Array.isArray(response.data)) {
        return response.data;
      }
      // Si la respuesta ya es un array directamente (por compatibilidad)
      if (Array.isArray(response)) {
        return response;
      }
      // Si no hay datos, devuelve array vacío
      return [];
    })
  );
}

saveMealRecord(mealData: { mealType: string; ingredients: any[]; date?: string }): Observable<any> {
  return this.apiCallService.post<any>('/user-meal', mealData).pipe(
    map(response => {
      // El backend devuelve { statusCode: 201, data: {...} }
      if (response && response.data) {
        return response.data;
      }
      return response;
    }),
    tap(() => {
      // Update fruits count after successful meal registration
      this.updateFruitsCountAfterMeal();
    })
  );
}

getUserMeals(): Observable<any[]> {
  return this.apiCallService.get<any>('/user-meal').pipe(
    map(response => {
      // El backend devuelve { statusCode: 200, data: [...] }
      if (response && response.data && Array.isArray(response.data)) {
        return response.data;
      }
      // Si la respuesta ya es un array directamente (por compatibilidad)
      if (Array.isArray(response)) {
        return response;
      }
      // Si no hay datos, devuelve array vacío
      return [];
    })
  );
}
}