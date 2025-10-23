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
import { HydrationService } from './hydratation.service';
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
  private hydrationService = inject(HydrationService);

  // Ingredientes temporales para el registro de comida
  private tempIngredients: any[] = [];

  // Estado reactivo para el conteo de frutas
  private fruitsCountSubject = new BehaviorSubject<number>(0);
  private lastFruitsCountDate: string | null = null;
  private fruitsCountCache$: Observable<number> | null = null;

  // Estado reactivo para los datos de hidratación
  private hydrationDataSubject = new BehaviorSubject<{ status: string; hour: string }[]>([]);
  private lastHydrationDate: string | null = null;
  private hydrationDataCache$: Observable<{ status: string; hour: string }[]> | null = null;

  // Estado reactivo para los datos de comidas
  private mealsDataSubject = new BehaviorSubject<any[]>([]);
  private lastMealsDate: string | null = null;
  private mealsDataCache$: Observable<any[]> | null = null;

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
   * Get current hydration data reactively
   */
  getCurrentHydrationData(): Observable<{ status: string; hour: string }[]> {
    return this.hydrationDataSubject.asObservable();
  }

  /**
   * Get today's meals grouped by meal type
   */
  getTodayMeals(): Observable<any[]> {
    const today = new Date().toDateString();
    console.log('NutritionService - getTodayMeals called, today:', today);
    
    // Si ya tenemos datos en caché para hoy, los devolvemos
    if (this.lastMealsDate === today && this.mealsDataCache$) {
      console.log('NutritionService - Using cached meals data');
      return this.mealsDataCache$;
    }

    // Si no, obtenemos los datos del backend
    this.mealsDataCache$ = this.apiCallService.get<any>('/user-meal/today').pipe(
      map((response: any) => {
        console.log('NutritionService - Raw meals response from API:', response);
        
        // Handle different response structures
        let meals: any[] = [];
        if (Array.isArray(response)) {
          meals = response;
        } else if (response && Array.isArray(response.data)) {
          meals = response.data;
        } else {
          console.warn('NutritionService - Unexpected meals response structure:', response);
          return [];
        }
        
        console.log('NutritionService - Extracted meals:', meals);
        console.log('NutritionService - Number of meals found:', meals.length);
        
        // Group meals by mealType and format for display
        const groupedMeals = this.groupMealsByType(meals);
        console.log('NutritionService - Grouped meals:', groupedMeals);
        console.log('NutritionService - Number of grouped meals:', groupedMeals.length);
        
        return groupedMeals;
      }),
      tap(data => {
        this.mealsDataSubject.next(data);
        this.lastMealsDate = today;
        console.log('NutritionService - Meals data loaded:', data);
      }),
      catchError(error => {
        console.error('NutritionService - Error fetching meals records:', error);
        return of([]);
      }),
      shareReplay(1)
    );

    return this.mealsDataCache$;
  }

  /**
   * Get current meals data observable
   */
  getCurrentMealsData(): Observable<any[]> {
    return this.mealsDataSubject.asObservable();
  }

  /**
   * Update meals data after registration
   */
  updateMealsDataAfterRegistration(): void {
    console.log('NutritionService - Starting meals data update after registration...');
    
    // Invalidate cache to force refresh on next request
    this.lastMealsDate = null;
    this.mealsDataCache$ = null;
    console.log('NutritionService - Meals cache invalidated, fetching fresh data...');
    
    // Refresh data immediately and update reactive state
    this.getTodayMeals().subscribe(data => {
      this.mealsDataSubject.next(data);
      console.log('NutritionService - Meals data updated after registration:', data);
    });
  }

  /**
   * Group meals by meal type and format for display
   */
  private groupMealsByType(meals: any[]): any[] {
    console.log('NutritionService - groupMealsByType called with meals:', meals);
    const mealTypes = ['Desayuno', 'Comida', 'Cena', 'Snack'];
    const groupedMeals: any[] = [];

    mealTypes.forEach(mealType => {
      const mealsOfType = meals.filter(meal => meal.mealType === mealType);
      console.log(`NutritionService - Found ${mealsOfType.length} meals for type: ${mealType}`);
      
      // Format ingredients for display and calculate total kcal
      const allIngredients = mealsOfType.reduce((acc: any[], meal: any) => {
        const mealIngredients = meal.ingredients?.map((ingredient: any) => {
          // Convert "gramos" to "g" for better display
          const unit = ingredient.unit === 'gramos' ? 'g' : ingredient.unit;
          return {
            text: `${ingredient.ingredient?.name || 'Ingrediente desconocido'} ${ingredient.quantity}${unit}`,
            kcal: ingredient.kcal || 0
          };
        }) || [];
        return acc.concat(mealIngredients);
      }, []);
      
      // Calculate total kcal from individual ingredients
      const totalKcal = allIngredients.reduce((sum, ingredient) => sum + (ingredient.kcal || 0), 0);
      
      console.log(`NutritionService - ${mealType} ingredients:`, allIngredients);
      console.log(`NutritionService - ${mealType} totalKcal:`, totalKcal);

      // Always add the meal type, even if no meals exist
      groupedMeals.push({
        mealType: mealType,
        displayName: this.getMealDisplayName(mealType),
        totalKcal: totalKcal,
        ingredients: allIngredients,
        mealCount: mealsOfType.length,
        icon: this.getMealIcon(mealType),
        points: this.getNutritionalScoreArray(totalKcal),
        hasData: mealsOfType.length > 0
      });
    });

    return groupedMeals;
  }

  /**
   * Get display name for meal type
   */
  private getMealDisplayName(mealType: string): string {
    const displayNames: { [key: string]: string } = {
      'Desayuno': 'Desayuno',
      'Comida': 'Comida',
      'Cena': 'Cena',
      'Snack': 'Snack'
    };
    return displayNames[mealType] || mealType;
  }

  /**
   * Get icon for meal type
   */
  private getMealIcon(mealType: string): string {
    const icons: { [key: string]: string } = {
      'Desayuno': '/assets/imgs/nutrition/breakfast.svg',
      'Comida': '/assets/imgs/nutrition/lunch.svg',
      'Cena': '/assets/imgs/nutrition/dinner.svg',
      'Snack': '/assets/imgs/nutrition/snack.svg'
    };
    return icons[mealType] || '/assets/imgs/nutrition/food.svg';
  }

  /**
   * Get nutritional score as boolean array for collapsable card
   */
  private getNutritionalScoreArray(totalKcal: number): boolean[] {
    // If totalKcal is 0 or less, show all points as grey (false)
    if (totalKcal <= 0) return [false, false, false, false];
    
    let score = 1;
    if (totalKcal >= 600) score = 4;
    else if (totalKcal >= 400) score = 3;
    else if (totalKcal >= 200) score = 2;
    
    return [true, true, true, true].map((_, index) => index < score);
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
   * Update hydration data after hydration registration
   * This should be called after successfully saving a hydration record
   */
  updateHydrationDataAfterRegistration(): void {
    console.log('NutritionService - Starting hydration data update after registration...');
    
    // Invalidate cache to force refresh on next request
    this.lastHydrationDate = null;
    this.hydrationDataCache$ = null;
    console.log('NutritionService - Cache invalidated, fetching fresh data...');
    
    // Refresh data immediately and update reactive state
    this.getHydrateRegister().subscribe({
      next: data => {
        console.log('NutritionService - Fresh hydration data received:', data);
        this.hydrationDataSubject.next(data);
        console.log('NutritionService - Hydration data updated after registration:', data);
      },
      error: error => {
        console.error('NutritionService - Error updating hydration data:', error);
      }
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
    this.hydrationDataSubject.next([]);
    this.mealsDataSubject.next([]);
    
    // Clear cache
    this.lastFruitsCountDate = null;
    this.fruitsCountCache$ = null;
    this.lastHydrationDate = null;
    this.hydrationDataCache$ = null;
    this.lastMealsDate = null;
    this.mealsDataCache$ = null;
    
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
    const today = new Date().toDateString();
    console.log('NutritionService - getHydrateRegister called, today:', today);
    console.log('NutritionService - lastHydrationDate:', this.lastHydrationDate);
    console.log('NutritionService - hasCache:', !!this.hydrationDataCache$);
    
    // Si ya tenemos datos en caché para hoy, los devolvemos
    if (this.lastHydrationDate === today && this.hydrationDataCache$) {
      console.log('NutritionService - Returning cached hydration data');
      return this.hydrationDataCache$;
    }

    console.log('NutritionService - Fetching fresh hydration data from backend...');
    // Si no, obtenemos los datos del backend
    this.hydrationDataCache$ = this.hydrationService.getTodayHydrationRecords().pipe(
      tap(data => {
        this.hydrationDataSubject.next(data);
        this.lastHydrationDate = today;
        console.log('NutritionService - Hydration data loaded and cached:', data);
      }),
      shareReplay(1)
    );

    return this.hydrationDataCache$;
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
      
      // Update meals data after successful meal registration
      this.updateMealsDataAfterRegistration();
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