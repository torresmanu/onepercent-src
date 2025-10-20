import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { IngredientService } from '../modules/ingredient/ingredient.service';
import * as fs from 'fs';
import * as path from 'path';
import * as csv from 'csv-parser';
import { Ingredient } from '../modules/ingredient/entities/ingredient.entity';

/**
 * Script to import ingredients from CSV file
 * Usage: npx ts-node src/database/import-ingredients.script.ts
 */

function parseBool(value: string): boolean {
  return ['true', '1', 'yes', 'TRUE'].includes(String(value).trim());
}

async function importIngredients() {
  console.log('Starting ingredient import...');
  
  // Create NestJS application context
  const app = await NestFactory.createApplicationContext(AppModule);
  const ingredientService = app.get(IngredientService);

  try {
    // Read CSV file from database/csv folder
    const csvPath = path.join(__dirname, 'csv', 'ingredients.csv');
    
    if (!fs.existsSync(csvPath)) {
      throw new Error(`Ingredient CSV file not found at: ${csvPath}`);
    }

    const results: any[] = [];
    
    // Read CSV file
    await new Promise<void>((resolve, reject) => {
      fs.createReadStream(csvPath)
        .pipe(csv({ separator: ';' }))
        .on('data', (data: any) => results.push(data))
        .on('end', () => resolve())
        .on('error', (error: any) => reject(error));
    });

    console.log(`Found ${results.length} ingredients to import`);

    let successCount = 0;
    let updateCount = 0;
    let errorCount = 0;

    // Process each ingredient
    for (let i = 0; i < results.length; i++) {
      const row = results[i];
      
      try {
        // Parse row data
        const code = row['code'];
        const name = row['name'];
        const name_en = row['name_en'];
        
        // Parse numeric values with comma to dot conversion
        const energy = parseFloat(row['energy']?.replace(',', '.')) || 0;
        const protein = parseFloat(row['protein']?.replace(',', '.')) || 0;
        const carbs = parseFloat(row['carbs']?.replace(',', '.')) || 0;
        const fat = parseFloat(row['fat']?.replace(',', '.')) || 0;
        const saturatedFat = parseFloat(row['saturatedFat']?.replace(',', '.')) || 0;
        const nonSaturatedFat = parseFloat(row['nonSaturatedFat']?.replace(',', '.')) || 0;
        const sugar = parseFloat(row['sugar']?.replace(',', '.')) || 0;
        const fiber = parseFloat(row['fiber']?.replace(',', '.')) || 0;
        const cholesterol = parseFloat(row['cholesterol']?.replace(',', '.')) || 0;
        const potassium = parseFloat(row['potassium']?.replace(',', '.')) || 0;
        const sodium = parseFloat(row['sodium']?.replace(',', '.')) || 0;
        const salt = parseFloat(row['salt']?.replace(',', '.')) || 0;
        const fresh = parseBool(row['fresh']) || false;

        // Skip if code is missing
        if (!code) {
          console.warn(`  ⚠ Skipping row ${i + 1}: missing code`);
          errorCount++;
          continue;
        }

        // Check if ingredient already exists
        const existingIngredient = await ingredientService.findByCode(code);

        // Parse allergens
        let allergies: any[] = [];
        try {
          const allergensIds = JSON.parse(row['allergens'] || '[]');
          if (allergensIds && allergensIds.length > 0) {
            allergies = await ingredientService.findAllergensByIds(allergensIds);
          }
        } catch (error: any) {
          console.warn(`  ⚠ Error parsing allergens for ${code}: ${error.message}`);
        }

        // Prepare ingredient data
        const ingredientData: any = {
          code,
          name,
          name_en,
          energy,
          protein,
          carbs,
          fat,
          saturatedFat,
          nonSaturatedFat,
          sugar,
          fiber,
          cholesterol,
          potassium,
          sodium,
          salt,
          fresh,
        };

        // Check and set group
        const group = parseInt(row['group']);
        if (group >= 1 && group <= 11) {
          ingredientData.ingredientGroupId = group;
        }

        let ingredient: Ingredient;
        if (!existingIngredient) {
          // Create new ingredient
          ingredient = await ingredientService.create({
            ...ingredientData,
            allergies,
          });
          successCount++;
          
          // Show progress every 100 ingredients
          if (successCount % 100 === 0) {
            console.log(`  Progress: ${successCount} ingredients created...`);
          }
        } else {
          // Update existing ingredient
          ingredient = await ingredientService.update(existingIngredient.id, {
            ...ingredientData,
            allergies,
          });
          updateCount++;
          
          // Show progress every 100 ingredients
          if (updateCount % 100 === 0) {
            console.log(`  Progress: ${updateCount} ingredients updated...`);
          }
        }

      } catch (error) {
        console.error(`  ✗ Error processing row ${i + 1} (code: ${row['code']}):`, error.message);
        errorCount++;
        continue;
      }
    }

    console.log('\n' + '='.repeat(50));
    console.log('Import completed!');
    console.log(`✓ Created: ${successCount} ingredients`);
    console.log(`↻ Updated: ${updateCount} ingredients`);
    console.log(`✗ Failed: ${errorCount} ingredients`);
    console.log('='.repeat(50));

  } catch (error) {
    console.error('Fatal error during import:', error);
    throw error;
  } finally {
    await app.close();
  }
}

// Run the import
importIngredients()
  .then(() => {
    console.log('Script finished successfully');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Script failed:', error);
    process.exit(1);
  });

