import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { RecipeService } from '../modules/recipe/recipe.service';
import { IngredientService } from '../modules/ingredient/ingredient.service';
import * as fs from 'fs';
import * as path from 'path';

/**
 * Script to import recipes from JSON file
 * Usage: npx ts-node src/database/import-recipes.script.ts
 */

// Mapping tables based on CSV files
const MEAL_TIMES_MAP: { [key: number]: string } = {
  1: 'Cena',
  2: 'Comida',
  3: 'Desayuno',
  4: 'Snacks',
};

const DIETS_MAP: { [key: number]: string } = {
  1: 'Omnívora',
  2: 'Vegetariana',
  3: 'Vegana',
  4: 'Sin gluten',
  5: 'Pescetariana',
};

const ALLERGENS_MAP: { [key: number]: string } = {
  1: 'Altramuces',
  2: 'Apio',
  3: 'Cacahuetes',
  4: 'Cereales que contengan gluten',
  5: 'Crustáceos',
  6: 'Frutos secos',
  7: 'Huevos',
  8: 'Leche y derivados',
  9: 'Moluscos',
  10: 'Mostaza',
  11: 'Pescado',
  12: 'Pescados',
  13: 'Soja',
  14: 'Sulfitos',
  15: 'Sésamo',
};

/**
 * Parse amount string to extract quantity and unit
 * Examples: "80g" => { quantity: 80, unit: "g" }
 *           "1 unidad" => { quantity: 1, unit: "unidad" }
 *           "200ml" => { quantity: 200, unit: "ml" }
 */
function parseAmount(amount: string): { quantity: number; unit: string } {
  // Remove leading/trailing whitespace
  amount = amount.trim();

  // Try to match patterns like "80g", "200ml"
  const pattern1 = /^(\d+(?:\.\d+)?)\s*([a-zA-Z]+)$/;
  const match1 = amount.match(pattern1);
  if (match1) {
    return {
      quantity: parseFloat(match1[1]),
      unit: match1[2],
    };
  }

  // Try to match patterns like "1 unidad", "1/2 unidad"
  const pattern2 = /^(\d+(?:\/\d+)?)\s+(.+)$/;
  const match2 = amount.match(pattern2);
  if (match2) {
    let quantity: number;
    // Handle fractions like "1/2"
    if (match2[1].includes('/')) {
      const [numerator, denominator] = match2[1].split('/').map(Number);
      quantity = numerator / denominator;
    } else {
      quantity = parseFloat(match2[1]);
    }
    return {
      quantity,
      unit: match2[2],
    };
  }

  // Default fallback
  console.warn(`Could not parse amount: "${amount}", using default`);
  return {
    quantity: 0,
    unit: 'g',
  };
}

/**
 * Extract step number and description from step string
 * Example: "Paso 1: Mezclar todo" => { step: 1, name: "Mezclar todo" }
 */
function parseStep(stepString: string, index: number): { step: number; name: string } {
  const pattern = /^Paso\s+(\d+):\s*(.+)$/;
  const match = stepString.match(pattern);
  
  if (match) {
    return {
      step: parseInt(match[1], 10),
      name: match[2].trim(),
    };
  }

  // Fallback: use index as step number
  return {
    step: index + 1,
    name: stepString.trim(),
  };
}

/**
 * Convert nutritional_info object to array format
 */
function parseNutritionalInfo(nutritionalInfo: any): { name: string; value: number }[] {
  const result: { name: string; value: number }[] = [];
  
  // Map of JSON keys to display names
  const nutritionalMapping: { [key: string]: string } = {
    carbohydrates: 'Carbohidratos',
    fiber: 'Fibra',
    sugars: 'Azúcares',
    proteins: 'Proteínas',
    fats: 'Grasas',
    saturated_fats: 'Grasas saturadas',
    unsaturated_fats: 'Grasas no saturadas',
    potassium_mg: 'Potasio (mg)',
    sodium_mg: 'Sodio (mg)',
  };

  for (const [key, displayName] of Object.entries(nutritionalMapping)) {
    if (nutritionalInfo[key] !== undefined && nutritionalInfo[key] !== null) {
      result.push({
        name: displayName,
        value: parseFloat(nutritionalInfo[key]),
      });
    }
  }

  return result;
}

async function importRecipes() {
  console.log('Starting recipe import...');
  
  // Create NestJS application context
  const app = await NestFactory.createApplicationContext(AppModule);
  const recipeService = app.get(RecipeService);
  const ingredientService = app.get(IngredientService);

  try {
    // Read JSON file from database/json folder
    const jsonPath = path.join(__dirname, 'json/recetas_sin_gluten.json');
    
    if (!fs.existsSync(jsonPath)) {
      throw new Error(`Recipe file not found at: ${jsonPath}`);
    }

    const fileContent = fs.readFileSync(jsonPath, 'utf-8');
    const recipes = JSON.parse(fileContent);

    console.log(`Found ${recipes.length} recipes to import`);

    let successCount = 0;
    let errorCount = 0;
    const missingIngredients = new Set<number>();

    // Process each recipe
    for (let i = 0; i < recipes.length; i++) {
      const recipeData = recipes[i];
      
      try {
        console.log(`\n[${i + 1}/${recipes.length}] Processing: ${recipeData.name}`);

        // Parse ingredients and find them by code
        const recipeIngredients: Array<{
          ingredientId: number;
          quantity: number;
          unit: string;
        }> = [];
        let hasAllIngredients = true;

        for (const ingredient of recipeData.ingredients) {
          const { quantity, unit } = parseAmount(ingredient.amount);
          
          // Find ingredient by code (food_id is actually the code)
          const foundIngredient = await ingredientService.findByCode(ingredient.food_id.toString());
          
          if (!foundIngredient) {
            console.warn(`  ⚠ Missing ingredient with code: ${ingredient.food_id} (${ingredient.name})`);
            missingIngredients.add(ingredient.food_id);
            hasAllIngredients = false;
            break;
          }
          
          recipeIngredients.push({
            ingredientId: foundIngredient.id,
            quantity,
            unit,
          });
        }

        // Skip recipe if any ingredient is missing
        if (!hasAllIngredients) {
          console.error(`  ✗ Skipping recipe due to missing ingredients`);
          errorCount++;
          continue;
        }

        // Parse steps
        const recipeSteps = recipeData.steps.map((step: string, index: number) => 
          parseStep(step, index)
        );

        // Map meal_times IDs to names
        const momentOfDays = recipeData.meal_times
          .map((id: number) => MEAL_TIMES_MAP[id])
          .filter((name: string | undefined) => name !== undefined);

        // Map diets IDs to names
        const dietTypes = recipeData.diets
          .map((id: number) => DIETS_MAP[id])
          .filter((name: string | undefined) => name !== undefined);

        // Map allergens IDs to names
        const allergens = recipeData.allergens
          .map((id: number) => ALLERGENS_MAP[id])
          .filter((name: string | undefined) => name !== undefined);

        // Parse nutritional info
        const nutritionalInfos = parseNutritionalInfo(recipeData.nutritional_info);

        // Create recipe DTO
        const createRecipeDto = {
          name: recipeData.name,
          timeOfPreparation: recipeData.preparation_time,
          kcal: recipeData.kcal,
          nutritionalQuality: recipeData.nutritional_quality_score,
          recipeIngredients,
          recipeSteps,
          momentOfDays,
          dietTypes,
          allergens,
          nutritionalInfos,
        };

        // Create recipe in database
        const createdRecipe = await recipeService.createWithDto(createRecipeDto);
        console.log(`✓ Recipe created with ID: ${createdRecipe.id}`);
        successCount++;

      } catch (error) {
        console.error(`✗ Error processing recipe "${recipeData.name}":`, error.message);
        errorCount++;
        
        // Continue with next recipe instead of stopping
        continue;
      }
    }

    console.log('\n' + '='.repeat(50));
    console.log('Import completed!');
    console.log(`✓ Successfully imported: ${successCount} recipes`);
    console.log(`✗ Failed: ${errorCount} recipes`);
    
    if (missingIngredients.size > 0) {
      console.log('\n⚠ Missing ingredient codes:');
      console.log(Array.from(missingIngredients).sort((a, b) => a - b).join(', '));
    }
    
    console.log('='.repeat(50));

  } catch (error) {
    console.error('Fatal error during import:', error);
    throw error;
  } finally {
    await app.close();
  }
}

// Run the import
importRecipes()
  .then(() => {
    console.log('Script finished successfully');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Script failed:', error);
    process.exit(1);
  });

