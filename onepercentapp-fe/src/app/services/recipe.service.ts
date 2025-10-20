import { computed, Injectable, signal } from '@angular/core';
import { RECETAS, Recipe } from '@src/app/core/interfaces/recipe';
import { HttpClient } from '@angular/common/http';
import { Observable, map, tap, catchError, of } from 'rxjs';
import { environment } from '@src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class RecipeService {
  private readonly basePath = '/recipe';

  private recipes = signal<Recipe[]>([]);
  private recipesFavorites = signal<Recipe[]>([]);
  private loading = signal<boolean>(false);

  private filterSection = signal<string | null>(null);
  private filterFavorites = signal<boolean>(false);
  private filterText = signal<string>('');

  constructor(private http: HttpClient) {
    this.loadRecipes();
  }

  /**
   * Load all recipes from the API
   */
  loadRecipes(): void {
    console.log('[RecipeService] Starting to load recipes...');
    this.loading.set(true);
    console.log('[RecipeService] Loading state set to true');
    
    this.http.get<{ statusCode: number; data: Recipe[] }>(`${environment.apiBaseUrl}${this.basePath}`)
      .pipe(
        map(response => response.data), // Extract data from the wrapper
        tap((recipes) => {
          console.log('[RecipeService] Received recipes from API:', recipes.length);
          // Transform recipes to add frontend compatibility properties
          const transformedRecipes = recipes.map(recipe => this.transformRecipe(recipe));
          this.recipes.set(transformedRecipes);
          console.log('[RecipeService] Recipes signal updated with transformed data');
        }),
        catchError((error) => {
          console.error('[RecipeService] Error loading recipes:', error);
          // Fallback to mock data if API fails
          this.recipes.set(RECETAS);
          return of(RECETAS);
        })
      )
      .subscribe({
        next: () => {
          console.log('[RecipeService] Subscribe completed, setting loading to false');
          this.loading.set(false);
        },
        error: (error) => {
          console.error('[RecipeService] Subscribe error:', error);
          this.loading.set(false);
        }
      });
  }

  /**
   * Transform API recipe to frontend format
   */
  private transformRecipe(recipe: Recipe): Recipe {
    const section = this.mapMomentToSection(recipe.recipeMomentsOfDay?.[0]?.name);
    
    return {
      ...recipe,
      // Map API fields to frontend expected fields
      title: recipe.name,
      // Show diet types instead of first step as subtitle
      description: (recipe.recipeDietTypes && recipe.recipeDietTypes.length > 0)
        ? recipe.recipeDietTypes.map((d: any) => d.name).join(' · ')
        : '',
      time: recipe.timeOfPreparation,
      value: recipe.nutritionalQuality,
      // Map moment of day to section
      section: section,
      // Default image based on section
      image: this.getDefaultImageForSection(section),
      components: recipe.recipeIngredients?.map(ri => ri.ingredient.name) || [],
      favorite: false, // This would come from user preferences
    };
  }

  /**
   * Get default image based on recipe section
   */
  private getDefaultImageForSection(section?: string): string {
    switch (section) {
      case 'Breakfast':
      case 'Snacks':
        return '/assets/imgs/nutrition/recipe-defaults/breakfast-snack.jpg';
      case 'Lunch':
        return '/assets/imgs/nutrition/recipe-defaults/lunch.jpg';
      case 'Dinner':
        return '/assets/imgs/nutrition/recipe-defaults/dinner.jpg';
      default:
        return '/assets/imgs/nutrition/fruit.svg'; // Fallback
    }
  }

  /**
   * Map moment of day to section name
   */
  private mapMomentToSection(moment?: string): string {
    const mapping: { [key: string]: string } = {
      'Desayuno': 'Breakfast',
      'Comida': 'Lunch', 
      'Cena': 'Dinner',
      'Snacks': 'Snacks'
    };
    return mapping[moment || ''] || 'Lunch';
  }

  /**
   * Get all recipes
   */
  getAllRecipes(): Observable<Recipe[]> {
    return this.http.get<{ statusCode: number; data: Recipe[] }>(`${environment.apiBaseUrl}${this.basePath}`)
      .pipe(
        map(response => response.data.map(recipe => this.transformRecipe(recipe))),
        catchError((error) => {
          console.error('Error fetching recipes:', error);
          return of([]);
        })
      );
  }

  /**
   * Get recipe by ID
   */
  getRecipeById(id: number): Observable<Recipe> {
    return this.http.get<{ statusCode: number; data: Recipe }>(`${environment.apiBaseUrl}${this.basePath}/${id}`)
      .pipe(
        map(response => this.transformRecipe(response.data)),
        catchError((error) => {
          console.error('Error fetching recipe:', error);
          throw error;
        })
      );
  }

  /**
   * Search recipes by text
   */
  searchRecipes(query: string): Observable<Recipe[]> {
    return this.http.post<{ statusCode: number; data: Recipe[] }>(`${environment.apiBaseUrl}${this.basePath}/search`, { query })
      .pipe(
        map(response => response.data.map(recipe => this.transformRecipe(recipe))),
        catchError((error) => {
          console.error('Error searching recipes:', error);
          return of([]);
        })
      );
  }

  // Legacy methods for compatibility
  getFavorites(): Recipe[] {
    return this.recipes().filter((recipe) => recipe.favorite);
  }

  getBySection(section: string): Recipe[] {
    return this.recipes().filter((recipe) => recipe.section === section);
  }

  getByText(text: string): Recipe[] {
    return this.recipes().filter((recipe) => {
      return (
        recipe.title?.toLowerCase().includes(text.toLowerCase()) ||
        recipe.description?.toLowerCase().includes(text.toLowerCase())
      );
    });
  }

  getByTime(time: number): Recipe[] {
    return this.recipes().filter((recipe) => (recipe.time || recipe.timeOfPreparation) <= time);
  }

  // Getters for signals
  get recipesSignal() {
    return this.recipes.asReadonly();
  }

  get loadingSignal() {
    return this.loading.asReadonly();
  }
}
