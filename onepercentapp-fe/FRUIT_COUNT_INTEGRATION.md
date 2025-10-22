# Fruit Count Integration - Frontend

## Overview
This document describes the integration of the fruit counting functionality in the frontend, showing how the daily fruit count is displayed in the nutrition dashboard.

## Implementation Details

### 1. NutritionService Updates
- **Reactive State Management**: Uses `BehaviorSubject` to maintain fruit count state
- **Smart Caching**: Only makes API calls when data is stale (different day)
- **Auto-Update**: Automatically refreshes count after meal registration
- **Integer Display**: Converts decimal portions to whole numbers for display

### 2. FruitSlideComponent Updates
- **Real-time Data**: Displays actual fruit count from backend
- **Reactive Updates**: Automatically updates when fruit count changes
- **Points Calculation**: 25 points per fruit portion
- **Memory Management**: Properly unsubscribes to prevent memory leaks

### 3. API Integration
- **Endpoint**: `GET /user-meal/fruits/today`
- **Response Format**: `{ statusCode: 200, data: number }`
- **Error Handling**: Graceful fallback to 0 on API errors

## User Experience

### Before Integration
- Static display: "1 / 4 porciones"
- No real data from user's actual consumption
- No updates after meal registration

### After Integration
- Dynamic display: "2 / 4 porciones" (actual count)
- Real-time updates when user registers meals
- Accurate reflection of daily fruit consumption
- Only whole numbers displayed (e.g., 2, not 2.5)

## Technical Flow

1. **Page Load**: 
   - `FruitSlideComponent` subscribes to `getCurrentFruitsCount()`
   - If no cached data, calls `getTodayFruitsCount()`
   - Displays current count

2. **Meal Registration**:
   - User registers meal with fruits
   - `saveMealRecord()` calls backend
   - On success, `updateFruitsCountAfterMeal()` is called
   - Cache is invalidated and data refreshed
   - UI updates automatically

3. **State Management**:
   - `BehaviorSubject` maintains current state
   - Multiple components can subscribe to same data
   - Automatic updates across all subscribers

## Testing

### Manual Testing
1. Register a meal with fruits (e.g., 200g banana)
2. Check nutrition dashboard shows updated count
3. Register another meal with fruits
4. Verify count increases correctly
5. Check that only whole numbers are displayed

### API Testing
```bash
# Get today's fruits count
curl -H "Authorization: Bearer <token>" \
     http://localhost:3000/user-meal/fruits/today

# Expected response
{
  "statusCode": 200,
  "data": 2
}
```

## Configuration

### Points per Fruit Portion
Currently set to 25 points per fruit portion. This can be adjusted in `fruit-slide.component.ts`:
```typescript
this.puntosActuales = count * 25; // Adjust multiplier as needed
```

### Cache Duration
Cache is invalidated daily. To change this behavior, modify the date comparison in `getTodayFruitsCount()`.

## Error Handling

- **API Errors**: Falls back to 0 fruits count
- **Network Issues**: Displays last known count
- **Invalid Data**: Converts to 0 and logs error
- **Memory Leaks**: Proper cleanup with `takeUntil` pattern

## Future Enhancements

1. **Weekly/Monthly Views**: Extend to show fruit count over time
2. **Goals Setting**: Allow users to set custom fruit goals
3. **Notifications**: Remind users to eat more fruits
4. **Analytics**: Track fruit consumption trends
5. **Offline Support**: Cache data for offline viewing
