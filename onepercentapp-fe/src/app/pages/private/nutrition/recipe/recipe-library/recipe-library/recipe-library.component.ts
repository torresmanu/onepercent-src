import {
  IonToolbar,
  IonHeader,
  IonContent,
  IonButtons,
  IonBackButton,
  IonSearchbar,
  IonRow,
  IonCol,
  IonRadio,
  IonRadioGroup,
} from '@ionic/angular/standalone';
import {
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  effect,
  inject,
  input,
  OnInit,
  signal,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { Recipe, RECETAS } from '@src/app/core/interfaces/recipe';
import { CommonModule } from '@angular/common';
import { RecipeSlideComponent } from '../../recipe-slide/recipe-slide/recipe-slide.component';
import { RecipeService } from '../../../../../../services/recipe.service';
import { RecipeSearchComponent } from '../../recipe-search/recipe-search/recipe-search.component';

@Component({
  selector: 'app-recipe-library',
  standalone: true,
  templateUrl: './recipe-library.component.html',
  styleUrls: [
    './recipe-library.component.css',
    '../../../nutrition.component.scss',
  ],
  imports: [
    CommonModule,
    RouterLink,
    IonCol,
    IonRow,
    IonSearchbar,
    IonHeader,
    IonContent,
    IonToolbar,
    IonButtons,
    IonBackButton,
    IonRadioGroup,
    IonRadio,
    RecipeSlideComponent,
    RecipeSearchComponent,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class RecipeLibraryComponent implements OnInit {
  private recipesService = inject(RecipeService);

  recipesFavorites: Recipe[] = [];
  recipesBreakfast: Recipe[] = [];
  recipesLunch: Recipe[] = [];
  recipesDinner: Recipe[] = [];
  recipesSnacks: Recipe[] = [];

  time: number = 0;
  loading = signal(false);
  searchText = signal('');
  searchedRecipes: Recipe[] = [];

  constructor() {
    // Effect to handle search text changes
    effect(() => {
      console.log('Search text updated:', this.searchText());
      if (this.searchText()) {
        this.recipesService.searchRecipes(this.searchText()).subscribe(recipes => {
          this.searchedRecipes = recipes;
        });
      } else {
        this.searchedRecipes = [];
      }
    });

    // Effect to handle recipe data changes
    effect(() => {
      const recipes = this.recipesService.recipesSignal();
      const isLoading = this.recipesService.loadingSignal();
      
      console.log('Recipe data effect triggered:', { recipesCount: recipes.length, isLoading });
      
      // Update recipe lists when data changes
      if (recipes.length > 0) {
        this.recipesFavorites = this.recipesService.getFavorites();
        this.recipesBreakfast = this.recipesService.getBySection('Breakfast');
        this.recipesLunch = this.recipesService.getBySection('Lunch');
        this.recipesDinner = this.recipesService.getBySection('Dinner');
        this.recipesSnacks = this.recipesService.getBySection('Snacks');
        
        console.log('Recipe lists updated:', {
          favorites: this.recipesFavorites.length,
          breakfast: this.recipesBreakfast.length,
          lunch: this.recipesLunch.length,
          dinner: this.recipesDinner.length,
          snacks: this.recipesSnacks.length
        });
      }
      
      this.loading.set(isLoading);
      console.log('Loading state set to:', isLoading);
    });
  }

  ngOnInit() {
    // Data loading is handled by the effect in the constructor
  }

  setData() {
    // Refresh recipe lists from current service data
    this.recipesFavorites = this.recipesService.getFavorites();
    this.recipesBreakfast = this.recipesService.getBySection('Breakfast');
    this.recipesLunch = this.recipesService.getBySection('Lunch');
    this.recipesDinner = this.recipesService.getBySection('Dinner');
    this.recipesSnacks = this.recipesService.getBySection('Snacks');
  }

  updateSearch(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.searchText.set(value);
    // The search is handled in the effect above
  }

  clearSearch() {
    this.searchText.set('');
  }

  filterTime(event: CustomEvent) {
    // Reset the recipes to the original data
    this.setData();
    this.loading.set(true);

    console.log('Selected section:', event.detail.value);
    this.time = event.detail.value;

    // Filter recipes based on the selected time
    setTimeout(() => {
      this.recipesFavorites = this.recipesFavorites.filter(
        (recipe) => recipe.time === this.time
      );
      this.recipesBreakfast = this.recipesBreakfast.filter(
        (recipe) => recipe.time === this.time
      );
      this.recipesLunch = this.recipesLunch.filter(
        (recipe) => recipe.time === this.time
      );
      this.recipesDinner = this.recipesDinner.filter(
        (recipe) => recipe.time === this.time
      );
      this.recipesSnacks = this.recipesSnacks.filter(
        (recipe) => recipe.time === this.time
      );
      this.loading.set(false);
    }, 1500);
  }
}
