import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserMealController } from './user-meal.controller';
import { UserMealService } from './user-meal.service';
import { UserMeal } from './entities/user-meal.entity';
import { UserMealIngredient } from './entities/user-meal-ingredient.entity';
import { User } from '../user/entities/user.entity';
import { Ingredient } from '../ingredient/entities/ingredient.entity';
import { BusinessModule } from '../business.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([UserMeal, UserMealIngredient, User, Ingredient]),
        forwardRef(() => BusinessModule),
    ],
    controllers: [UserMealController],
    providers: [UserMealService],
    exports: [UserMealService],
})
export class UserMealModule {}

