import { CommonModule } from '@angular/common';
import { Component, OnInit, CUSTOM_ELEMENTS_SCHEMA, inject } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { Router } from '@angular/router';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
    // Add any other necessary imports here
  ],
  selector: 'app-daily-highlights-slider',
  templateUrl: './daily-highlights-slider.component.html',
  styleUrls: ['./daily-highlights-slider.component.scss'],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class DailyHighlightsSliderComponent  implements OnInit {
  private router = inject(Router);

  constructor() { }

  ngOnInit() {}

  goToRecipeLibraryWithFilters(mealTime: string) {
    console.log('DailyHighlightsSlider - Navigating to recipe library:', { mealTime });
    
    // Map meal time to route paths
    const routeMap: { [key: string]: string } = {
      'Desayuno': 'breakfast',
      'Comida': 'lunch', 
      'Cena': 'dinner',
      'Snack': 'snack'
    };

    const routePath = routeMap[mealTime] || 'breakfast';
    
    console.log('DailyHighlightsSlider - Mapped route:', routePath);
    
    // Navigate to specific meal time route
    this.router.navigate([`/private/nutrition/recipe-library/${routePath}`])
      .then(success => {
        console.log('DailyHighlightsSlider - Navigation result:', success);
      })
      .catch(error => {
        console.error('DailyHighlightsSlider - Navigation error:', error);
      });
  }
}
