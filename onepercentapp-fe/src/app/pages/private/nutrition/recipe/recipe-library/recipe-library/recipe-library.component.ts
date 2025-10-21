import {
  IonToolbar,
  IonHeader,
  IonContent,
  IonButtons,
  IonButton,
  IonIcon,
  IonSearchbar,
  IonRow,
  IonCol,
  IonRadio,
  IonRadioGroup,
  NavController,
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
import { CommonModule, Location } from '@angular/common';
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
        IonButton,
        IonIcon,
        IonRadioGroup,
        IonRadio,
        RecipeSlideComponent,
        RecipeSearchComponent,
      ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class RecipeLibraryComponent implements OnInit {
  private recipesService = inject(RecipeService);
  private navCtrl = inject(NavController);
  private location = inject(Location);

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
      if (this.searchText()) {
        this.recipesService.searchRecipes(this.searchText()).subscribe(recipes => {
          // Apply time filter if one is selected
          if (this.time > 0) {
            this.searchedRecipes = recipes.filter(recipe => (recipe.time || 0) <= this.time);
          } else {
            this.searchedRecipes = recipes;
          }
        });
      } else {
        this.searchedRecipes = [];
      }
    });

    // Effect to handle recipe data changes
    effect(() => {
      const recipes = this.recipesService.recipesSignal();
      const isLoading = this.recipesService.loadingSignal();
      
      // Update recipe lists when data changes
      if (recipes.length > 0) {
        this.recipesFavorites = this.recipesService.getFavorites();
        this.recipesBreakfast = this.recipesService.getBySection('Breakfast');
        this.recipesLunch = this.recipesService.getBySection('Lunch');
        this.recipesDinner = this.recipesService.getBySection('Dinner');
        this.recipesSnacks = this.recipesService.getBySection('Snacks');
      }
      
      this.loading.set(isLoading);
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

  updateSearch(event: CustomEvent) {
    const value = event.detail.value;
    this.searchText.set(value);
    // The search is handled in the effect above
  }

  clearSearch() {
    this.searchText.set('');
  }

  toggleTimeFilter(selectedTime: number) {
    // If clicking the same filter, deselect it
    if (this.time === selectedTime) {
      this.time = 0;
    } else {
      this.time = selectedTime;
    }
    
    this.applyTimeFilter();
  }

  private applyTimeFilter() {
    // Reset the recipes to the original data
    this.setData();
    this.loading.set(true);

    // If no time filter is selected, show all recipes
    if (this.time === 0) {
      this.loading.set(false);
      // If there's an active search, also clear search results
      if (this.searchText()) {
        this.recipesService.searchRecipes(this.searchText()).subscribe(recipes => {
          this.searchedRecipes = recipes;
        });
      }
      return;
    }

    // Filter recipes based on the selected time
    setTimeout(() => {
      this.recipesFavorites = this.recipesFavorites.filter(
        (recipe) => (recipe.time || 0) <= this.time
      );
      this.recipesBreakfast = this.recipesBreakfast.filter(
        (recipe) => (recipe.time || 0) <= this.time
      );
      this.recipesLunch = this.recipesLunch.filter(
        (recipe) => (recipe.time || 0) <= this.time
      );
      this.recipesDinner = this.recipesDinner.filter(
        (recipe) => (recipe.time || 0) <= this.time
      );
      this.recipesSnacks = this.recipesSnacks.filter(
        (recipe) => (recipe.time || 0) <= this.time
      );
      
      // If there's an active search, also filter search results
      if (this.searchText()) {
        this.recipesService.searchRecipes(this.searchText()).subscribe(recipes => {
          this.searchedRecipes = recipes.filter(recipe => (recipe.time || 0) <= this.time);
        });
      }
      
      this.loading.set(false);
    }, 300); // Reduced from 1500ms to 300ms for faster response
  }

  goBack() {
    // Use location.back() for more reliable navigation
    this.location.back();
  }
}
