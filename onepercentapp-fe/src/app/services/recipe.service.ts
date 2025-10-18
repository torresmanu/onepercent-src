import { computed, Injectable, signal } from '@angular/core';
import { RECETAS, Recipe } from '@src/app/core/interfaces/recipe';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class RecipeService {
  private readonly basePath = '/profile';

  private recipes = signal<Recipe[]>(RECETAS);
  private recipesFavorites = signal<Recipe[]>([]);

  private filterSection = signal<string | null>(null);
  private filterFavorites = signal<boolean>(false);
  private filterText = signal<string>('');

  constructor(private http: HttpClient) {}

  getFavorites(): Recipe[] {
    //return this.http.get<Recipe[]>(`${this.basePath}`).filter((recipe) => recipe.favorite);
    return this.recipes().filter((recipe) => recipe.favorite);
  }

  getBySection(section: string): Recipe[] {
    //return this.http.get<Recipe[]>(`${this.basePath}`).filter((recipe) => recipe.section === section);
    return this.recipes().filter((recipe) => recipe.section === section);
  }

  getByText(text: string): Recipe[] {
    return this.recipes().filter((recipe) => {
      return (
        recipe.title.toLowerCase().includes(text.toLowerCase()) ||
        recipe.description.toLowerCase().includes(text.toLowerCase())
      );
    });
  }

  getByTime(time: number): Recipe[] {
    return this.recipes().filter((recipe) => recipe.time <= time);
  }
}
