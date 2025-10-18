import {forwardRef, Module} from '@nestjs/common';
import { RecipeAllergenController } from './recipe-allergen.controller';
import { RecipeAllergenService } from './recipe-allergen.service';
import {TypeOrmModule} from "@nestjs/typeorm";
import {Recipe} from "../recipe/entities/recipe.entity";
import {RecipeDietType} from "../recipe/entities/recipeDietType.entity";
import {RecipeMomentOfDay} from "../recipe/entities/recipeMomentOfDay.entity";
import {RecipeNutritionalInfo} from "../recipe/entities/recipeNutritionalInfo.entity";
import {RecipeStep} from "../recipe/entities/recipeStep.entity";
import {RecipeIngredient} from "../recipe/entities/recipeIngredient.entity";
import {BusinessModule} from "../business.module";
import {RecipeAllergen} from "./dto/recipe-allergen.entity";

@Module({
  imports: [
    TypeOrmModule.forFeature([RecipeAllergen]),
    forwardRef(() => BusinessModule),

  ],
  controllers: [RecipeAllergenController],
  providers: [RecipeAllergenService],
  exports: [RecipeAllergenService, TypeOrmModule],
})
export class RecipeAllergenModule {}
