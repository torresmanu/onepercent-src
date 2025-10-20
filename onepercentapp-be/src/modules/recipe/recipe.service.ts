import {BadRequestException, Injectable, NotFoundException} from '@nestjs/common';
import {BaseService} from "../../common/services/base.service";
import {Recipe} from "./entities/recipe.entity";
import {InjectRepository} from "@nestjs/typeorm";
import {ILike, Repository} from "typeorm";
import {CreateRecipeDto} from "./dto/createRecipe.dto";
import {RecipeStep} from "./entities/recipeStep.entity";
import {RecipeMomentOfDay} from "./entities/recipeMomentOfDay.entity";
import {RecipeDietType} from "./entities/recipeDietType.entity";
import {RecipeNutritionalInfo} from "./entities/recipeNutritionalInfo.entity";
import {RecipeIngredient} from "./entities/recipeIngredient.entity";
import {Ingredient} from "../ingredient/entities/ingredient.entity";
import {RecipeAllergen} from "../recipe-allergen/dto/recipe-allergen.entity";

@Injectable()
export class RecipeService extends BaseService<Recipe>{
    constructor(
        @InjectRepository(Recipe)
        private readonly recipeRepository: Repository<Recipe>,
        @InjectRepository(RecipeStep)
        private readonly recipeStepRepository: Repository<RecipeStep>,
        @InjectRepository(RecipeMomentOfDay)
        private readonly recipeMomentOfDayRepository: Repository<RecipeMomentOfDay>,
        @InjectRepository(RecipeDietType)
        private readonly recipeDietTypeRepository: Repository<RecipeDietType>,
        @InjectRepository(RecipeAllergen)
        private readonly recipeAllergenRepository: Repository<RecipeAllergen>,
        @InjectRepository(RecipeNutritionalInfo)
        private readonly recipeNutritionalInfoRepository: Repository<RecipeNutritionalInfo>,
        @InjectRepository(RecipeIngredient)
        private readonly recipeIngredientRepository: Repository<RecipeIngredient>,
        @InjectRepository(Ingredient)
        private readonly ingredientRepository: Repository<Ingredient>

    ) {
        super(recipeRepository);
    }

    async findAll(): Promise<Recipe[]> {
        return this.recipeRepository.find({
            relations: {
                recipeSteps: true,
                recipeAllergens: true,
                recipeDietTypes: true,
                recipeMomentsOfDay: true,
                recipeNutritionalInfos: true,
                recipeIngredients: {
                    ingredient: true
                }
            }
        });
    }

    async findById(id: number): Promise<Recipe> {
        const recipe = await this.recipeRepository.findOne({
            where: { id: id },
            relations: {
                recipeSteps: true,
                recipeAllergens: true,
                recipeDietTypes: true,
                recipeMomentsOfDay: true,
                recipeNutritionalInfos: true,
                recipeIngredients: {
                    ingredient: true
                }
            }
        });

        if (!recipe) {
            throw new NotFoundException(`Recipe with id ${id} not found`);
        }

        return recipe;
    }

    async processRecipeRelationships (recipeData: CreateRecipeDto, recipe: Recipe) {
        
        // Process ingredients
        if (recipeData.recipeIngredients && recipeData.recipeIngredients.length > 0) {
            await Promise.all(
              recipeData.recipeIngredients.map(
                async (recipeIngredient: any) => {
                    // Check if ingredientId is provided
                    if (!recipeIngredient.ingredientId) {
                        throw new BadRequestException('Ingredient ID is required for recipe ingredients');
                    }
                  //   Check if ingredient exists
                    const existingIngredient = await this.ingredientRepository.findOne({
                        where: { id: recipeIngredient.ingredientId }
                    });
                    if (!existingIngredient) {
                        throw new BadRequestException(`Ingredient with ID ${recipeIngredient.ingredientId} does not exist`);
                    }

                  return await this.recipeIngredientRepository.save({
                    ingredient: { id: recipeIngredient.ingredientId },
                    recipe: recipe,
                    quantity: recipeIngredient.quantity,
                    unit: recipeIngredient.unit || 'g' // Default unit to 'g' if not provided
                  });
                },
              ),
            );
        }

        // Process steps
        if (recipeData.recipeSteps && recipeData.recipeSteps.length > 0) {
            await Promise.all(recipeData.recipeSteps.map((step: any) => {
                this.recipeStepRepository.save({
                    name: step.name,
                    step: step.step,
                    recipe: recipe
                });
            }) );
        }

        // Process moments of day
        if (recipeData.momentOfDays && recipeData.momentOfDays.length > 0) {
            await Promise.all(recipeData.momentOfDays.map((moment: string) => {
                return this.recipeMomentOfDayRepository.save({
                    name: moment,
                    recipe: recipe
                });
            }));
        }

        // Process diet types
        if (recipeData.dietTypes && recipeData.dietTypes.length > 0) {
            await Promise.all(recipeData.dietTypes.map((dietType: string) => {
                return this.recipeDietTypeRepository.save({
                    name: dietType,
                    recipe: recipe
                });
            }));
        }

        // Process allergens
        if (recipeData.allergens && recipeData.allergens.length > 0) {
            await Promise.all(recipeData.allergens.map((allergen: string) => {
                return this.recipeAllergenRepository.save({
                    name: allergen,
                    recipe: recipe
                });
            }));
        }

        // Process nutritional info
        if (recipeData.nutritionalInfos && recipeData.nutritionalInfos.length > 0) {
            await Promise.all(recipeData.nutritionalInfos.map((nutritionalInfo: any) => {
                return this.recipeNutritionalInfoRepository.save({
                    name: nutritionalInfo.name,
                    value: nutritionalInfo.value,
                    recipe: recipe
                });
            }));
        }

    }

    async createWithDto(recipeData: CreateRecipeDto): Promise<Recipe> {
        const recipe = await this.recipeRepository.save({
            name: recipeData.name,
            timeOfPreparation: recipeData.timeOfPreparation,
            kcal: recipeData.kcal,
            nutritionalQuality: recipeData.nutritionalQuality,
        });

        await this.processRecipeRelationships(recipeData, recipe);

        return this.findById(recipe.id);
    }

    async updateWithDto(id: number, recipeData: CreateRecipeDto): Promise<Recipe> {
        const recipe = await this.findById(id);
        if (!recipe) {
            throw new NotFoundException(`Recipe with id ${id} not found`);
        }

        // Update basic recipe fields
        recipe.name = recipeData.name;
        recipe.timeOfPreparation = recipeData.timeOfPreparation;
        recipe.kcal = recipeData.kcal;
        recipe.nutritionalQuality = recipeData.nutritionalQuality;

        await this.recipeRepository.save(recipe);

        // Delete relationships before updating
        await this.recipeIngredientRepository.delete({ recipe: { id: recipe.id } });
        await this.recipeStepRepository.delete({ recipe: { id: recipe.id } });
        await this.recipeMomentOfDayRepository.delete({ recipe: { id: recipe.id } });
        await this.recipeDietTypeRepository.delete({ recipe: { id: recipe.id } });
        await this.recipeAllergenRepository.delete({ recipe: { id: recipe.id } });
        await this.recipeNutritionalInfoRepository.delete({ recipe: { id: recipe.id } });

        // Process relationships
        await this.processRecipeRelationships(recipeData, recipe);

        return this.findById(recipe.id);
    }

    // Search recipies by name
    async search(query: string){
        if (!query || query.trim() === '') {
            throw new BadRequestException('Search query cannot be empty');
        }

        const recipes = await this.recipeRepository.find({
            where: {
                name: ILike(`%${query}%`)
            },
            relations: {
                recipeSteps: true,
                recipeAllergens: true,
                recipeDietTypes: true,
                recipeMomentsOfDay: true,
                recipeNutritionalInfos: true
            }
        });

        if (recipes.length === 0) {
            throw new NotFoundException(`No recipes found for query "${query}"`);
        }

        return recipes;
    }

}
