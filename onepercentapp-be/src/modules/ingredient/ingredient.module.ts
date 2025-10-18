import {forwardRef, Module} from '@nestjs/common';
import { IngredientController } from './ingredient.controller';
import { IngredientService } from './ingredient.service';
import {TypeOrmModule} from "@nestjs/typeorm";
import {User} from "../user/entities/user.entity";
import {UserToken} from "../user/entities/userToken.entity";
import {Role} from "../user/entities/role.entity";
import {ActivityMaterial} from "../activity-material/entities/activity-material.entity";
import {ActiveData} from "../plan/entities/activeData.entity";
import {HydrationDay} from "../plan/entities/hydrationDay.entity";
import {LunchDay} from "../plan/entities/lunchDay.entity";
import {VegetablesAndFruits} from "../plan/entities/vegetablesAndFruits.entity";
import {WorkoutWeek} from "../plan/entities/workoutWeek.entity";
import {Target} from "../target/entities/target.entity";
import {CardiovascularLevel} from "../plan/entities/cardiovascularLevel";
import {Allergy} from "../plan/entities/allergy";
import {Intolerance} from "../plan/entities/intolerance";
import {NutritionPreference} from "../plan/entities/nutritionPreference";
import {BusinessModule} from "../business.module";
import {Ingredient} from "./entities/ingredient.entity";
import {IngredientGroup} from "./entities/ingredientGroup.entity";

@Module({
  imports: [
    TypeOrmModule.forFeature([Ingredient, IngredientGroup, Allergy]),
    forwardRef(() => BusinessModule),

  ],
  controllers: [IngredientController],
  providers: [IngredientService],
  exports: [IngredientService, TypeOrmModule],
})
export class IngredientModule {}
