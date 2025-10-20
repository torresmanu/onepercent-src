import { computed, Injectable, signal } from '@angular/core';
import { RECETAS, Recipe } from '@src/app/core/interfaces/recipe';
import { HttpClient } from '@angular/common/http';
import { Observable, map, tap, catchError, of, switchMap } from 'rxjs';
import { environment } from '@src/environments/environment';
import { ApiCallService } from './api-call.service';

@Injectable({
  providedIn: 'root',
})
export class RecipeService {
  private readonly basePath = '/recipe';
  private readonly userPath = '/user';

  private recipes = signal<Recipe[]>([]);
  private recipesFavorites = signal<Recipe[]>([]);
  private loading = signal<boolean>(false);

  private filterSection = signal<string | null>(null);
  private filterFavorites = signal<boolean>(false);
  private filterText = signal<string>('');

  constructor(
    private http: HttpClient,
    private apiCallService: ApiCallService
  ) {
    this.loadRecipes();
  }

  /**
   * Load all recipes from the API
   */
  loadRecipes(): void {
    console.log('[RecipeService] Starting to load recipes...');
    this.loading.set(true);
    console.log('[RecipeService] Loading state set to true');
    
    // Load recipes and favorites in parallel
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
          console.log('[RecipeService] Recipes loaded, now loading favorites...');
          // Load user's favorite recipes to update the favorite status
          this.loadUserFavorites();
        },
        error: (error) => {
          console.error('[RecipeService] Subscribe error:', error);
          this.loading.set(false);
        }
      });
  }

  /**
   * Load user's favorite recipes and update the favorite status
   */
  private loadUserFavorites(): void {
    this.getMyFavoriteRecipes().subscribe({
      next: (favorites) => {
        console.log('[RecipeService] Favorites loaded:', favorites.length);
        // Update recipes to mark favorites
        const recipes = this.recipes();
        const updatedRecipes = recipes.map(recipe => ({
          ...recipe,
          favorite: favorites.some(fav => fav.id === recipe.id)
        }));
        this.recipes.set(updatedRecipes);
        this.loading.set(false);
      },
      error: (error) => {
        console.error('[RecipeService] Error loading favorites:', error);
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
   * Get recipe by ID with favorite status
   */
  getRecipeByIdWithFavoriteStatus(id: number): Observable<Recipe> {
    return this.getRecipeById(id).pipe(
      switchMap(recipe => {
        // Check if this recipe is in user's favorites
        return this.getMyFavoriteRecipes().pipe(
          map(favorites => {
            const isFavorite = favorites.some(fav => fav.id === id);
            return { ...recipe, favorite: isFavorite };
          }),
          catchError(() => {
            // If we can't get favorites, return recipe with favorite: false
            return of({ ...recipe, favorite: false });
          })
        );
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

  /**
   * Get favorites signal for reactive updates
   */
  get favoritesSignal() {
    return this.recipesFavorites.asReadonly();
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

  /**
   * Get user's favorite recipes from the backend
   */
  getMyFavoriteRecipes(): Observable<Recipe[]> {
    return this.apiCallService.get<{ statusCode: number; data: Recipe[] }>(`${this.userPath}/myFavoriteRecipes`)
      .pipe(
        map(response => response.data.map(recipe => this.transformRecipe(recipe))),
        tap((favorites) => {
          console.log('[RecipeService] Loaded favorite recipes:', favorites.length);
          this.recipesFavorites.set(favorites);
        }),
        catchError((error) => {
          console.error('[RecipeService] Error loading favorite recipes:', error);
          return of([]);
        })
      );
  }

  /**
   * Add a recipe to user's favorites
   */
  setFavoriteRecipe(recipeId: number): Observable<any> {
    return this.apiCallService.post(`${this.userPath}/setFavouriteRecipe`, { recipeId })
      .pipe(
        tap(() => {
          console.log('[RecipeService] Recipe added to favorites:', recipeId);
          // Update local state by marking the recipe as favorite
          const recipes = this.recipes();
          const updatedRecipes = recipes.map(recipe => 
            recipe.id === recipeId ? { ...recipe, favorite: true } : recipe
          );
          this.recipes.set(updatedRecipes);
        }),
        catchError((error) => {
          console.error('[RecipeService] Error adding recipe to favorites:', error);
          throw error;
        })
      );
  }

  /**
   * Remove a recipe from user's favorites
   */
  removeFavoriteRecipe(recipeId: number): Observable<any> {
    return this.apiCallService.post(`${this.userPath}/deleteFavouriteRecipe`, { recipeId })
      .pipe(
        tap(() => {
          console.log('[RecipeService] Recipe removed from favorites:', recipeId);
          // Update local state by marking the recipe as not favorite
          const recipes = this.recipes();
          const updatedRecipes = recipes.map(recipe => 
            recipe.id === recipeId ? { ...recipe, favorite: false } : recipe
          );
          this.recipes.set(updatedRecipes);
          
          // Also remove from favorites signal
          const currentFavorites = this.recipesFavorites();
          const updatedFavorites = currentFavorites.filter(recipe => recipe.id !== recipeId);
          this.recipesFavorites.set(updatedFavorites);
        }),
        catchError((error) => {
          console.error('[RecipeService] Error removing recipe from favorites:', error);
          throw error;
        })
      );
  }

  /**
   * Toggle favorite status of a recipe
   */
  toggleFavoriteRecipe(recipe: Recipe): Observable<any> {
    if (recipe.favorite) {
      return this.removeFavoriteRecipe(recipe.id);
    } else {
      return this.setFavoriteRecipe(recipe.id);
    }
  }

  /**
   * Check if a recipe is in user's favorites
   */
  isFavoriteRecipe(recipeId: number): boolean {
    return this.recipesFavorites().some(recipe => recipe.id === recipeId);
  }
}
