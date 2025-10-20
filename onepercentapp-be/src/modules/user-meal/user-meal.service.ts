import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserMeal } from './entities/user-meal.entity';
import { UserMealIngredient } from './entities/user-meal-ingredient.entity';
import { CreateUserMealDto } from './dto/create-user-meal.dto';
import { BaseService } from 'src/common/services/base.service';

@Injectable()
export class UserMealService extends BaseService<UserMeal> {
    constructor(
        @InjectRepository(UserMeal)
        private readonly userMealRepository: Repository<UserMeal>,
        @InjectRepository(UserMealIngredient)
        private readonly userMealIngredientRepository: Repository<UserMealIngredient>,
    ) {
        super(userMealRepository);
    }

    /**
     * Create a new meal record for a user
     */
    async createMealRecord(userId: number, createUserMealDto: CreateUserMealDto): Promise<UserMeal> {
        // Si no se proporciona fecha, usar la fecha actual
        const date = createUserMealDto.date || new Date().toISOString().split('T')[0];
        
        // Calcular el total de calorías
        const totalKcal = createUserMealDto.ingredients.reduce((sum, ing) => sum + ing.kcal, 0);

        // Crear el registro de comida
        const userMeal = this.userMealRepository.create({
            userId,
            mealType: createUserMealDto.mealType,
            date,
            totalKcal,
        });

        const savedMeal = await this.userMealRepository.save(userMeal);

        // Crear los ingredientes asociados
        const ingredients = createUserMealDto.ingredients.map(ing => 
            this.userMealIngredientRepository.create({
                userMealId: savedMeal.id,
                ingredientId: ing.id,
                quantity: ing.quantity,
                unit: ing.unit,
                kcal: ing.kcal,
            })
        );

        await this.userMealIngredientRepository.save(ingredients);

        // Retornar el meal con los ingredientes cargados
        const result = await this.userMealRepository.findOne({
            where: { id: savedMeal.id },
            relations: ['ingredients', 'ingredients.ingredient'],
        });

        if (!result) {
            throw new NotFoundException(`Meal record with ID ${savedMeal.id} not found after creation`);
        }

        return result;
    }

    /**
     * Get all meal records for a user
     */
    async getUserMealRecords(userId: number): Promise<UserMeal[]> {
        return await this.userMealRepository.find({
            where: { userId },
            relations: ['ingredients', 'ingredients.ingredient'],
            order: { date: 'DESC', createdAt: 'DESC' },
        });
    }

    /**
     * Get meal records for a user by date
     */
    async getUserMealRecordsByDate(userId: number, date: string): Promise<UserMeal[]> {
        return await this.userMealRepository.find({
            where: { userId, date },
            relations: ['ingredients', 'ingredients.ingredient'],
            order: { createdAt: 'DESC' },
        });
    }

    /**
     * Get today's meal records for a user
     */
    async getTodayMealRecords(userId: number): Promise<UserMeal[]> {
        const today = new Date().toISOString().split('T')[0];
        return await this.getUserMealRecordsByDate(userId, today);
    }

    /**
     * Get a single meal record by ID
     */
    async getMealRecordById(id: number, userId: number): Promise<UserMeal> {
        const record = await this.userMealRepository.findOne({
            where: { id, userId },
            relations: ['ingredients', 'ingredients.ingredient'],
        });

        if (!record) {
            throw new NotFoundException(`Meal record with ID ${id} not found`);
        }

        return record;
    }

    /**
     * Delete a meal record
     */
    async deleteMealRecord(id: number, userId: number): Promise<void> {
        const result = await this.userMealRepository.delete({ id, userId });

        if (result.affected === 0) {
            throw new NotFoundException(`Meal record with ID ${id} not found`);
        }
    }

    /**
     * Get meal records for a user by date range
     */
    async getUserMealRecordsByDateRange(
        userId: number,
        startDate: string,
        endDate: string
    ): Promise<UserMeal[]> {
        return await this.userMealRepository
            .createQueryBuilder('meal')
            .leftJoinAndSelect('meal.ingredients', 'ingredients')
            .leftJoinAndSelect('ingredients.ingredient', 'ingredient')
            .where('meal.userId = :userId', { userId })
            .andWhere('meal.date BETWEEN :startDate AND :endDate', { startDate, endDate })
            .orderBy('meal.date', 'DESC')
            .addOrderBy('meal.createdAt', 'DESC')
            .getMany();
    }
}

