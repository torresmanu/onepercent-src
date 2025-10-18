import {forwardRef, Module} from '@nestjs/common';
import { PlanController } from './plan.controller';
import { PlanService } from './plan.service';
import {TypeOrmModule} from "@nestjs/typeorm";
import {User} from "../user/entities/user.entity";
import {UserToken} from "../user/entities/userToken.entity";
import {Role} from "../user/entities/role.entity";
import {ActivityMaterial} from "../activity-material/entities/activity-material.entity";
import {AuthModule} from "../auth/auth.module";
import {ActiveData} from "./entities/activeData.entity";
import {WorkoutWeek} from "./entities/workoutWeek.entity";
import {VegetablesAndFruits} from "./entities/vegetablesAndFruits.entity";
import {LunchDay} from "./entities/lunchDay.entity";
import {HydrationDay} from "./entities/hydrationDay.entity";
import {TargetService} from "../target/target.service";
import {Target} from "../target/entities/target.entity";
import {CardiovascularLevel} from "./entities/cardiovascularLevel";
import {Allergy} from "./entities/allergy";
import {Intolerance} from "./entities/intolerance";
import {NutritionPreference} from "./entities/nutritionPreference";
import {BusinessModule} from "../business.module";
import {Gender} from "./entities/gender.entity";
import {Referral} from "./entities/referral.entity";

@Module({
  imports: [
    TypeOrmModule.forFeature([User, UserToken, Role, ActivityMaterial, ActiveData, HydrationDay, LunchDay, VegetablesAndFruits, WorkoutWeek, Target, CardiovascularLevel, Allergy, Intolerance, NutritionPreference, Gender, Referral]),
    // forwardRef(() => AuthModule),
    forwardRef(() => BusinessModule),

  ],
  controllers: [PlanController],
  providers: [PlanService],
  exports: [PlanService, TypeOrmModule],
})
export class PlanModule {}
