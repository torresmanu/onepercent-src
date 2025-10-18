import {forwardRef, Module} from '@nestjs/common';
import { RecipeController } from './recipe.controller';
import { RecipeService } from './recipe.service';
import {TypeOrmModule} from "@nestjs/typeorm";
import {Ingredient} from "../ingredient/entities/ingredient.entity";
import {BusinessModule} from "../business.module";
import {Recipe} from "./entities/recipe.entity";
import {RecipeDietType} from "./entities/recipeDietType.entity";
import {RecipeMomentOfDay} from "./entities/recipeMomentOfDay.entity";
import {RecipeNutritionalInfo} from "./entities/recipeNutritionalInfo.entity";
import {RecipeStep} from "./entities/recipeStep.entity";
import {RecipeIngredient} from "./entities/recipeIngredient.entity";
import {RecipeAllergen} from "../recipe-allergen/dto/recipe-allergen.entity";

@Module({
  imports: [
    TypeOrmModule.forFeature([Recipe, RecipeAllergen, RecipeDietType, RecipeMomentOfDay, RecipeNutritionalInfo, RecipeStep, RecipeIngredient]),
    forwardRef(() => BusinessModule),

  ],
  controllers: [RecipeController],
  providers: [RecipeService],
  exports: [RecipeService, TypeOrmModule],
})
export class RecipeModule {}
