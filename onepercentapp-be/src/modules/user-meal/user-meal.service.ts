import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserMeal } from './entities/user-meal.entity';
import { UserMealIngredient } from './entities/user-meal-ingredient.entity';
import { CreateUserMealDto } from './dto/create-user-meal.dto';
import { BaseService } from 'src/common/services/base.service';
import { Ingredient } from '../ingredient/entities/ingredient.entity';

@Injectable()
export class UserMealService extends BaseService<UserMeal> {
    // Nutritional thresholds for considering a portion as "1 fruit/vegetable/legume/nut"
    private readonly FRUIT_VEGETABLE_THRESHOLD = 80; // grams - WHO recommendation
    private readonly LEGUME_THRESHOLD = 150; // grams - standard portion
    private readonly NUTS_THRESHOLD = 30; // grams - standard portion
    private readonly FRUITS_VEGETABLES_LEGUMES_NUTS_GROUP_ID = 2; // ID from ingredient groups

    constructor(
        @InjectRepository(UserMeal)
        private readonly userMealRepository: Repository<UserMeal>,
        @InjectRepository(UserMealIngredient)
        private readonly userMealIngredientRepository: Repository<UserMealIngredient>,
        @InjectRepository(Ingredient)
        private readonly ingredientRepository: Repository<Ingredient>,
    ) {
        super(userMealRepository);
    }

    /**
     * Calculate the number of fruit/vegetable portions from ingredients
     * Excludes legumes and nuts - only counts actual fruits and vegetables
     */
    private async calculateFruitsCount(ingredients: CreateUserMealDto['ingredients']): Promise<number> {
        let totalFruitsCount = 0;

        for (const ingredient of ingredients) {
            // Get ingredient details from database
            const ingredientDetails = await this.ingredientRepository.findOne({
                where: { id: ingredient.id },
                relations: ['ingredientGroup']
            });

            if (!ingredientDetails || !ingredientDetails.ingredientGroup) {
                continue;
            }

            // Check if ingredient belongs to fruits, vegetables, legumes and nuts group
            if (ingredientDetails.ingredientGroup.id === this.FRUITS_VEGETABLES_LEGUMES_NUTS_GROUP_ID) {
                // Skip legumes and nuts - only count fruits and vegetables
                if (this.isLegume(ingredientDetails.name) || this.isNut(ingredientDetails.name)) {
                    continue; // Skip this ingredient
                }

                // Convert quantity to grams if needed
                const quantityInGrams = this.convertToGrams(ingredient.quantity, ingredient.unit);
                
                // Use fruit/vegetable threshold for actual fruits and vegetables
                const threshold = this.FRUIT_VEGETABLE_THRESHOLD;

                // Calculate portions
                const portions = quantityInGrams / threshold;
                totalFruitsCount += portions;
            }
        }

        return Math.round(totalFruitsCount * 10) / 10; // Round to 1 decimal place
    }

    /**
     * Convert quantity to grams based on unit
     */
    private convertToGrams(quantity: number, unit: string): number {
        const unitLower = unit.toLowerCase();
        
        switch (unitLower) {
            case 'g':
            case 'gramos':
            case 'gram':
                return quantity;
            case 'kg':
            case 'kilogramos':
            case 'kilogram':
                return quantity * 1000;
            case 'ml':
            case 'mililitros':
                return quantity; // Assuming 1ml = 1g for most foods
            case 'l':
            case 'litros':
            case 'liter':
                return quantity * 1000;
            case 'oz':
            case 'onzas':
                return quantity * 28.35;
            case 'lb':
            case 'libras':
            case 'pound':
                return quantity * 453.59;
            default:
                return quantity; // Assume grams if unit is unknown
        }
    }

    /**
     * Check if ingredient is a legume (basic implementation)
     */
    private isLegume(ingredientName: string): boolean {
        const legumeKeywords = ['frijol', 'lenteja', 'garbanzo', 'alubia', 'judía', 'soja', 'soy', 'guisante', 'chícharo', 'haba', 'legumbre'];
        const nameLower = ingredientName.toLowerCase();
        return legumeKeywords.some(keyword => nameLower.includes(keyword));
    }

    /**
     * Check if ingredient is a nut (basic implementation)
     */
    private isNut(ingredientName: string): boolean {
        const nutKeywords = ['nuez', 'almendra', 'avellana', 'pistacho', 'anacardo', 'cacahuete', 'maní', 'castaña', 'piñón', 'macadamia', 'pecan', 'fruto seco'];
        const nameLower = ingredientName.toLowerCase();
        return nutKeywords.some(keyword => nameLower.includes(keyword));
    }

    /**
     * Create a new meal record for a user
     */
    async createMealRecord(userId: number, createUserMealDto: CreateUserMealDto): Promise<UserMeal> {
        // Si no se proporciona fecha, usar la fecha actual
        const date = createUserMealDto.date || new Date().toISOString().split('T')[0];
        
        // Calcular el total de calorías
        const totalKcal = createUserMealDto.ingredients.reduce((sum, ing) => sum + ing.kcal, 0);

        // Calculate fruits count from ingredients
        const fruitsCount = await this.calculateFruitsCount(createUserMealDto.ingredients);

        // Crear el registro de comida
        const userMeal = this.userMealRepository.create({
            userId,
            mealType: createUserMealDto.mealType,
            date,
            totalKcal,
            fruitsCount: createUserMealDto.fruitsCount || fruitsCount, // Use provided value or calculated
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

    /**
     * Get total fruits count for a user in a date range
     */
    async getUserFruitsCountByDateRange(
        userId: number,
        startDate: string,
        endDate: string
    ): Promise<number> {
        const result = await this.userMealRepository
            .createQueryBuilder('meal')
            .select('SUM(meal.fruitsCount)', 'totalFruits')
            .where('meal.userId = :userId', { userId })
            .andWhere('meal.date BETWEEN :startDate AND :endDate', { startDate, endDate })
            .getRawOne();

        return parseFloat(result?.totalFruits || '0');
    }

    /**
     * Get today's fruits count for a user
     */
    async getTodayFruitsCount(userId: number): Promise<number> {
        const today = new Date().toISOString().split('T')[0];
        return await this.getUserFruitsCountByDateRange(userId, today, today);
    }
}

