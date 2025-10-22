# Fruit Counting Feature

## Overview
This feature automatically counts **only fruit and vegetable portions** when users register meals with ingredients from the "frutas, verduras, legumbres y frutos secos" group (ID: 2). Legumes and nuts are excluded from the fruit count.

## Nutritional Thresholds
Based on WHO and nutritional guidelines:

- **Fruits & Vegetables**: 80g = 1 portion ✅ (counted)
- **Legumes**: 150g = 1 portion ❌ (excluded from fruit count)
- **Nuts**: 30g = 1 portion ❌ (excluded from fruit count)

## Implementation Details

### Database Changes
- Added `fruitsCount` field to `UserMeal` entity
- Field type: `float` with default value 0
- Represents number of fruit/vegetable/legume/nut portions

### Service Logic
The `UserMealService.calculateFruitsCount()` method:

1. **Identifies relevant ingredients**: Checks if ingredient belongs to group ID 2
2. **Excludes legumes and nuts**: Skips ingredients identified as legumes or nuts
3. **Converts units to grams**: Supports g, kg, ml, l, oz, lb, etc.
4. **Applies fruit/vegetable threshold**: Uses 80g threshold for remaining ingredients
5. **Calculates portions**: `quantityInGrams / 80g`
6. **Returns total count**: Sum of all fruit/vegetable portions, rounded to 1 decimal place

### Detection Logic
- **Legumes**: Detected by keywords: 'frijol', 'lenteja', 'garbanzo', 'alubia', 'judía', 'soja', 'soy', 'guisante', 'chícharo', 'haba', 'legumbre' → **EXCLUDED**
- **Nuts**: Detected by keywords: 'nuez', 'almendra', 'avellana', 'pistacho', 'anacardo', 'cacahuete', 'maní', 'castaña', 'piñón', 'macadamia', 'pecan', 'fruto seco' → **EXCLUDED**
- **Fruits & Vegetables**: All other ingredients in group ID 2 → **COUNTED** (80g threshold)

## API Endpoints

### Create Meal Record
```
POST /user-meal
```
- Automatically calculates `fruitsCount` from ingredients
- Can override with manual `fruitsCount` value in request body

### Get Today's Fruits Count
```
GET /user-meal/fruits/today
```
- Returns total fruits count for current day
- Response: `number` (e.g., 2.5)

### Get Fruits Count by Date Range
```
GET /user-meal/fruits/date-range?startDate=2025-01-01&endDate=2025-01-31
```
- Returns total fruits count for date range
- Response: `number` (e.g., 15.2)

## Examples

### Example 1: Banana Breakfast
```json
{
  "mealType": "Desayuno",
  "ingredients": [
    {
      "id": 123,
      "quantity": 200,
      "unit": "gramos",
      "kcal": 180
    }
  ]
}
```
- **Result**: `fruitsCount = 2.5` (200g ÷ 80g = 2.5 portions)

### Example 2: Mixed Meal (Legumes and Nuts Excluded)
```json
{
  "mealType": "Comida",
  "ingredients": [
    {
      "id": 124, // Lentils
      "quantity": 150,
      "unit": "gramos",
      "kcal": 120
    },
    {
      "id": 125, // Almonds
      "quantity": 30,
      "unit": "gramos",
      "kcal": 180
    }
  ]
}
```
- **Result**: `fruitsCount = 0.0` (Lentils and almonds are excluded from fruit count)

### Example 3: Mixed Meal with Real Fruits
```json
{
  "mealType": "Desayuno",
  "ingredients": [
    {
      "id": 126, // Apple
      "quantity": 100,
      "unit": "gramos",
      "kcal": 50
    },
    {
      "id": 127, // Lentils (excluded)
      "quantity": 150,
      "unit": "gramos",
      "kcal": 120
    },
    {
      "id": 128, // Orange
      "quantity": 80,
      "unit": "gramos",
      "kcal": 40
    }
  ]
}
```
- **Result**: `fruitsCount = 2.0` (100g ÷ 80g + 80g ÷ 80g = 1.25 + 1.0 = 2.25, rounded to 2.0)
- **Note**: Lentils are excluded, only apple and orange count

### Example 4: Small Amount
```json
{
  "mealType": "Cena",
  "ingredients": [
    {
      "id": 129, // Apple
      "quantity": 50,
      "unit": "gramos",
      "kcal": 25
    }
  ]
}
```
- **Result**: `fruitsCount = 0.6` (50g ÷ 80g = 0.625, rounded to 0.6)

## Testing
Run the test script to verify functionality:
```bash
npx ts-node src/database/test-fruit-counting.script.ts
```

## Frontend Integration
The frontend can now:
1. Display daily fruits count in nutrition dashboard
2. Show fruits count in meal history
3. Track progress towards daily fruit/vegetable goals
4. Use the data for nutritional scoring and recommendations

## Notes
- Only ingredients from group ID 2 are counted
- Unit conversion handles common measurement units
- Portions are calculated as decimal values (e.g., 0.5, 1.25, 2.0)
- Manual override is possible via `fruitsCount` field in request
- Detection keywords can be extended for better accuracy
