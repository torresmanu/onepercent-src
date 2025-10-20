import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { FormControl } from '@angular/forms';
import { of, throwError } from 'rxjs';
import { IngredientAutocompleteComponent } from './ingredient-autocomplete.component';
import { NutritionService } from '@src/app/services/nutrition.service';
import { TranslateModule } from '@ngx-translate/core';

describe('IngredientAutocompleteComponent', () => {
  let component: IngredientAutocompleteComponent;
  let fixture: ComponentFixture<IngredientAutocompleteComponent>;
  let nutritionServiceSpy: jasmine.SpyObj<NutritionService>;

  const mockIngredients = [
    {
      id: 1,
      name: 'Arroz',
      name_en: 'Rice',
      energy: 350,
      ingredientGroup: { id: 1, name: 'Cereales' }
    },
    {
      id: 2,
      name: 'Pollo',
      name_en: 'Chicken',
      energy: 165,
      ingredientGroup: { id: 2, name: 'Carnes' }
    }
  ];

  beforeEach(async () => {
    const spy = jasmine.createSpyObj('NutritionService', ['searchIngredients']);

    await TestBed.configureTestingModule({
      imports: [
        IngredientAutocompleteComponent,
        TranslateModule.forRoot()
      ],
      providers: [
        { provide: NutritionService, useValue: spy }
      ]
    }).compileComponents();

    nutritionServiceSpy = TestBed.inject(NutritionService) as jasmine.SpyObj<NutritionService>;
    fixture = TestBed.createComponent(IngredientAutocompleteComponent);
    component = fixture.componentInstance;
    component.control = new FormControl('');
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with empty search results', () => {
    expect(component.searchResults).toEqual([]);
    expect(component.isLoading).toBeFalse();
    expect(component.hasError).toBeFalse();
    expect(component.showDropdown).toBeFalse();
  });

  it('should debounce input changes by 300ms', fakeAsync(() => {
    nutritionServiceSpy.searchIngredients.and.returnValue(of(mockIngredients));
    fixture.detectChanges();

    component.control.setValue('ar');
    tick(100); // Only 100ms
    expect(nutritionServiceSpy.searchIngredients).not.toHaveBeenCalled();

    tick(200); // Total 300ms
    expect(nutritionServiceSpy.searchIngredients).toHaveBeenCalledWith('ar');
  }));

  it('should not search with less than 2 characters', fakeAsync(() => {
    nutritionServiceSpy.searchIngredients.and.returnValue(of([]));
    fixture.detectChanges();

    component.control.setValue('a');
    tick(300);

    expect(component.showDropdown).toBeFalse();
    expect(component.searchResults).toEqual([]);
  }));

  it('should search and display results with 2 or more characters', fakeAsync(() => {
    nutritionServiceSpy.searchIngredients.and.returnValue(of(mockIngredients));
    fixture.detectChanges();

    component.control.setValue('arr');
    tick(300);

    expect(nutritionServiceSpy.searchIngredients).toHaveBeenCalledWith('arr');
    expect(component.searchResults).toEqual(mockIngredients);
    expect(component.showDropdown).toBeTrue();
    expect(component.isLoading).toBeFalse();
  }));

  it('should cancel previous API call when typing continues', fakeAsync(() => {
    nutritionServiceSpy.searchIngredients.and.returnValue(of(mockIngredients));
    fixture.detectChanges();

    component.control.setValue('ar');
    tick(200);
    component.control.setValue('arr');
    tick(100); // Only 100ms since last change
    
    expect(nutritionServiceSpy.searchIngredients).not.toHaveBeenCalled();
    
    tick(200); // Total 300ms since 'arr'
    expect(nutritionServiceSpy.searchIngredients).toHaveBeenCalledTimes(1);
    expect(nutritionServiceSpy.searchIngredients).toHaveBeenCalledWith('arr');
  }));

  it('should handle API errors gracefully', fakeAsync(() => {
    nutritionServiceSpy.searchIngredients.and.returnValue(
      throwError(() => new Error('API Error'))
    );
    fixture.detectChanges();

    component.control.setValue('arr');
    tick(300);

    expect(component.hasError).toBeTrue();
    expect(component.isLoading).toBeFalse();
    expect(component.searchResults).toEqual([]);
  }));

  it('should navigate down with arrow key', fakeAsync(() => {
    nutritionServiceSpy.searchIngredients.and.returnValue(of(mockIngredients));
    fixture.detectChanges();

    component.control.setValue('arr');
    tick(300);

    const event = new KeyboardEvent('keydown', { key: 'ArrowDown' });
    spyOn(event, 'preventDefault');
    component.onKeyDown(event);

    expect(event.preventDefault).toHaveBeenCalled();
    expect(component.selectedIndex).toBe(0);

    component.onKeyDown(event);
    expect(component.selectedIndex).toBe(1);
  }));

  it('should navigate up with arrow key', fakeAsync(() => {
    nutritionServiceSpy.searchIngredients.and.returnValue(of(mockIngredients));
    fixture.detectChanges();

    component.control.setValue('arr');
    tick(300);
    component.selectedIndex = 1;

    const event = new KeyboardEvent('keydown', { key: 'ArrowUp' });
    spyOn(event, 'preventDefault');
    component.onKeyDown(event);

    expect(event.preventDefault).toHaveBeenCalled();
    expect(component.selectedIndex).toBe(0);

    component.onKeyDown(event);
    expect(component.selectedIndex).toBe(-1);
  }));

  it('should select ingredient on Enter key', fakeAsync(() => {
    nutritionServiceSpy.searchIngredients.and.returnValue(of(mockIngredients));
    fixture.detectChanges();
    spyOn(component.ingredientSelected, 'emit');

    component.control.setValue('arr');
    tick(300);
    component.selectedIndex = 0;

    const event = new KeyboardEvent('keydown', { key: 'Enter' });
    spyOn(event, 'preventDefault');
    component.onKeyDown(event);

    expect(event.preventDefault).toHaveBeenCalled();
    expect(component.ingredientSelected.emit).toHaveBeenCalledWith(mockIngredients[0]);
  }));

  it('should close dropdown on Escape key', fakeAsync(() => {
    nutritionServiceSpy.searchIngredients.and.returnValue(of(mockIngredients));
    fixture.detectChanges();

    component.control.setValue('arr');
    tick(300);
    component.showDropdown = true;

    const event = new KeyboardEvent('keydown', { key: 'Escape' });
    spyOn(event, 'preventDefault');
    component.onKeyDown(event);

    expect(event.preventDefault).toHaveBeenCalled();
    expect(component.showDropdown).toBeFalse();
    expect(component.selectedIndex).toBe(-1);
  }));

  it('should emit ingredientSelected on click', () => {
    spyOn(component.ingredientSelected, 'emit');
    const ingredient = mockIngredients[0];

    component.selectIngredient(ingredient);

    expect(component.ingredientSelected.emit).toHaveBeenCalledWith(ingredient);
    expect(component.control.value).toBe('');
    expect(component.showDropdown).toBeFalse();
    expect(component.searchResults).toEqual([]);
  });

  it('should show "no results" message when search returns empty', fakeAsync(() => {
    nutritionServiceSpy.searchIngredients.and.returnValue(of([]));
    fixture.detectChanges();

    component.control.setValue('xyz');
    tick(300);

    expect(component.showNoResults).toBeTrue();
    expect(component.searchResults).toEqual([]);
  }));

  it('should show "min chars" message when input has 1 character', fakeAsync(() => {
    fixture.detectChanges();

    component.control.setValue('a');
    tick(300);
    component.showDropdown = true;

    expect(component.showMinChars).toBeTrue();
  }));

  it('should show loading state while searching', fakeAsync(() => {
    nutritionServiceSpy.searchIngredients.and.returnValue(of(mockIngredients));
    fixture.detectChanges();

    component.control.setValue('arr');
    
    expect(component.isLoading).toBeTrue();
    
    tick(300);
    
    expect(component.isLoading).toBeFalse();
  }));

  it('should open dropdown on focus if there are results', () => {
    component.searchResults = mockIngredients;
    component.showDropdown = false;

    component.onInputFocus();

    expect(component.showDropdown).toBeTrue();
  });

  it('should close dropdown on blur with delay', fakeAsync(() => {
    component.showDropdown = true;

    component.onInputBlur();
    
    expect(component.showDropdown).toBeTrue(); // Still true immediately
    
    tick(200); // Wait for timeout
    
    expect(component.showDropdown).toBeFalse();
  }));

  it('should not exceed max index when navigating down', fakeAsync(() => {
    nutritionServiceSpy.searchIngredients.and.returnValue(of(mockIngredients));
    fixture.detectChanges();

    component.control.setValue('arr');
    tick(300);

    const event = new KeyboardEvent('keydown', { key: 'ArrowDown' });
    
    component.onKeyDown(event); // 0
    component.onKeyDown(event); // 1
    component.onKeyDown(event); // Should stay at 1

    expect(component.selectedIndex).toBe(1);
  }));

  it('should not go below -1 when navigating up', fakeAsync(() => {
    nutritionServiceSpy.searchIngredients.and.returnValue(of(mockIngredients));
    fixture.detectChanges();

    component.control.setValue('arr');
    tick(300);

    const event = new KeyboardEvent('keydown', { key: 'ArrowUp' });
    component.onKeyDown(event); // Should stay at -1

    expect(component.selectedIndex).toBe(-1);
  }));
});

