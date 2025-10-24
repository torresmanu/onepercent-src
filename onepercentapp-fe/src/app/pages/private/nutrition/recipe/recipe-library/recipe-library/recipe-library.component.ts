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
import { RouterLink, NavigationEnd, Router, ActivatedRoute } from '@angular/router';
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
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  recipesFavorites: Recipe[] = [];
  recipesBreakfast: Recipe[] = [];
  recipesLunch: Recipe[] = [];
  recipesDinner: Recipe[] = [];
  recipesSnacks: Recipe[] = [];

  time: number = 0;
  loading = signal(false);
  searchText = signal('');
  searchedRecipes: Recipe[] = [];

  // Properties for meal time filtering
  selectedMealTime: string | null = null;
  selectedPreparationTime: number | null = null;
  fromMealTime: boolean = false;
  
  // Property to control view mode
  showHorizontalCards: boolean = false;
  
  // Property to store filtered recipes for horizontal cards
  filteredRecipesForHorizontalView: Recipe[] = [];

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
        
        // Apply meal time filter if we're on a meal time route
        if (this.fromMealTime && this.selectedMealTime) {
          this.applyMealTimeFilter();
        }
      }
      
      this.loading.set(isLoading);
    });
  }

  ngOnInit() {
    console.log('RecipeLibrary - ngOnInit called');
    
    // Check for route data parameters (from meal time routes)
    const routeData = this.route.snapshot.data;
    console.log('RecipeLibrary - Route data:', routeData);
    
    if (routeData && routeData['mealTime']) {
      console.log('RecipeLibrary - Meal time route detected');
      
      this.selectedMealTime = routeData['mealTime'];
      this.fromMealTime = true;
      
      // Enable horizontal cards view for meal time routes
      this.showHorizontalCards = true;
      
      console.log('RecipeLibrary - Parsed parameters:', {
        selectedMealTime: this.selectedMealTime,
        fromMealTime: this.fromMealTime,
        showHorizontalCards: this.showHorizontalCards
      });
      
      // Apply meal time filter immediately
      this.applyMealTimeFilter();
    } else {
      console.log('RecipeLibrary - Regular recipe library route');
      this.fromMealTime = false;
      this.showHorizontalCards = false;
    }
    
    // Data loading is handled by the effect in the constructor
  }

  setData() {
    // Refresh recipe lists from current service data
    this.recipesFavorites = this.recipesService.getFavorites();
    this.recipesBreakfast = this.recipesService.getBySection('Breakfast');
    this.recipesLunch = this.recipesService.getBySection('Lunch');
    this.recipesDinner = this.recipesService.getBySection('Dinner');
    this.recipesSnacks = this.recipesService.getBySection('Snacks');

    // Apply meal time filter if coming from meal time navigation
    if (this.fromMealTime && this.selectedMealTime) {
      this.applyMealTimeFilter();
    }
  }

  private applyMealTimeFilter() {
    console.log('RecipeLibrary - applyMealTimeFilter called for:', this.selectedMealTime);
    
    // Clear all recipe lists except the selected meal time
    this.recipesFavorites = [];
    
    let filteredRecipes: Recipe[] = [];
    
    switch (this.selectedMealTime) {
      case 'Breakfast':
        filteredRecipes = this.recipesService.getBySection('Breakfast');
        this.recipesBreakfast = filteredRecipes;
        this.recipesLunch = [];
        this.recipesDinner = [];
        this.recipesSnacks = [];
        console.log('RecipeLibrary - Found breakfast recipes:', filteredRecipes.length);
        break;
      case 'Lunch':
        filteredRecipes = this.recipesService.getBySection('Lunch');
        this.recipesBreakfast = [];
        this.recipesLunch = filteredRecipes;
        this.recipesDinner = [];
        this.recipesSnacks = [];
        console.log('RecipeLibrary - Found lunch recipes:', filteredRecipes.length);
        break;
      case 'Dinner':
        filteredRecipes = this.recipesService.getBySection('Dinner');
        this.recipesBreakfast = [];
        this.recipesLunch = [];
        this.recipesDinner = filteredRecipes;
        this.recipesSnacks = [];
        console.log('RecipeLibrary - Found dinner recipes:', filteredRecipes.length);
        break;
      case 'Snacks':
        filteredRecipes = this.recipesService.getBySection('Snacks');
        this.recipesBreakfast = [];
        this.recipesLunch = [];
        this.recipesDinner = [];
        this.recipesSnacks = filteredRecipes;
        console.log('RecipeLibrary - Found snacks recipes:', filteredRecipes.length);
        break;
    }
    
    // Store filtered recipes for horizontal view and apply time filter if active
    if (this.time > 0) {
      this.filteredRecipesForHorizontalView = filteredRecipes.filter(
        (recipe) => (recipe.time || 0) <= this.time
      );
    } else {
      this.filteredRecipesForHorizontalView = filteredRecipes;
    }
    
    console.log('RecipeLibrary - Filtered recipes for horizontal view:', this.filteredRecipesForHorizontalView.length);
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
      
      // If we're in meal time view, also update the filtered recipes for horizontal view
      if (this.fromMealTime && this.selectedMealTime) {
        this.applyMealTimeFilter();
      }
      
      this.loading.set(false);
    }, 300); // Reduced from 1500ms to 300ms for faster response
  }

  getMealTimeTitle(): string {
    const titleMap: { [key: string]: string } = {
      'Breakfast': 'Recetas de desayuno',
      'Lunch': 'Recetas de comida',
      'Dinner': 'Recetas de cena',
      'Snacks': 'Recetas de snack'
    };
    
    console.log('getMealTimeTitle - selectedMealTime:', this.selectedMealTime);
    const result = titleMap[this.selectedMealTime || ''] || 'Biblioteca de recetas';
    console.log('getMealTimeTitle - result:', result);
    
    return result;
  }

  getHeaderTitle(): string {
    const titleMap: { [key: string]: string } = {
      'Breakfast': 'Desayuno',
      'Lunch': 'Comida',
      'Dinner': 'Cena',
      'Snacks': 'Snack'
    };
    
    console.log('getHeaderTitle - fromMealTime:', this.fromMealTime);
    console.log('getHeaderTitle - selectedMealTime:', this.selectedMealTime);
    
    const result = this.fromMealTime ? titleMap[this.selectedMealTime || ''] || 'Recetas' : 'Biblioteca de recetas';
    console.log('getHeaderTitle - result:', result);
    
    return result;
  }

  getMealTimeDisplayName(): string {
    // If we're in a specific meal time route, always show that meal time
    if (this.fromMealTime && this.selectedMealTime) {
      const titleMap: { [key: string]: string } = {
        'Breakfast': 'Desayuno',
        'Lunch': 'Comida',
        'Dinner': 'Cena',
        'Snacks': 'Snack'
      };
      return titleMap[this.selectedMealTime] || this.selectedMealTime;
    }
    
    // Otherwise, return empty string or fallback
    return '';
  }

  getDietTypeDisplay(description: any): string {
    // If description is an array, get the first element
    if (Array.isArray(description)) {
      return description[0] || '';
    }
    
    // If description is a string, return it
    if (typeof description === 'string') {
      return description;
    }
    
    // Fallback
    return '';
  }

  goBack() {
    // Use location.back() for more reliable navigation
    this.location.back();
  }
}
