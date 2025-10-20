import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { IngredientService } from '../modules/ingredient/ingredient.service';

/**
 * Script to import ingredient groups
 * Usage: npx ts-node src/database/import-ingredient-groups.script.ts
 */

async function importIngredientGroups() {
  console.log('Starting ingredient groups import...');
  
  // Create NestJS application context
  const app = await NestFactory.createApplicationContext(AppModule);
  const ingredientService = app.get(IngredientService);

  try {
    // Create ingredient groups as defined in seeder.service.ts
    const groups = [
      { id: 1, name: "entrantes y platos preparados" },
      { id: 2, name: "frutas, verduras, legumbres y frutos secos" },
      { id: 3, name: "productos de cereales" },
      { id: 4, name: "carne, huevos y pescado" },
      { id: 5, name: "leche y productos lácteos" },
      { id: 6, name: "bebidas" },
      { id: 7, name: "azúcar y productos de confitería" },
      { id: 8, name: "helados y sorbetes" },
      { id: 9, name: "grasas y aceites" },
      { id: 10, name: "varios" },
      { id: 11, name: "alimentos para bebés" },
    ];

    let successCount = 0;
    let errorCount = 0;

    for (const group of groups) {
      try {
        await ingredientService.createIngredientGroup(group.id, group.name);
        console.log(`✓ Created group ${group.id}: ${group.name}`);
        successCount++;
      } catch (error: any) {
        // Ignore duplicate key errors (group already exists)
        if (error.code === 'ER_DUP_ENTRY') {
          console.log(`  ⚠ Group ${group.id} already exists, skipping`);
        } else {
          console.error(`✗ Error creating group ${group.id}:`, error.message);
          errorCount++;
        }
      }
    }

    console.log('\n' + '='.repeat(50));
    console.log('Import completed!');
    console.log(`✓ Created: ${successCount} ingredient groups`);
    console.log(`✗ Failed: ${errorCount} ingredient groups`);
    console.log('='.repeat(50));

  } catch (error) {
    console.error('Fatal error during import:', error);
    throw error;
  } finally {
    await app.close();
  }
}

// Run the import
importIngredientGroups()
  .then(() => {
    console.log('Script finished successfully');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Script failed:', error);
    process.exit(1);
  });

