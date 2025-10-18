import {Body, Controller, Delete, Get, Param, Patch, Post, UseGuards} from '@nestjs/common';
import {RecipeService} from "./recipe.service";
import {ApiBody, ApiOperation, ApiResponse} from "@nestjs/swagger";
import {Recipe} from "./entities/recipe.entity";
import {JwtAuthGuard} from "../../common/guards/jwt-auth.guard";
import {RolesGuard} from "../../common/guards/role.guard";
import {Roles} from "../../common/decorators/role.decorator";
import {CreateRecipeDto} from "./dto/createRecipe.dto";

@Controller('recipe')
export class RecipeController {
    constructor(private readonly recipeService: RecipeService) {
    }

    // Find all recipes
    @Get('')
    // @UseGuards(JwtAuthGuard, RolesGuard)
    // @Roles('admin','user')
    @ApiOperation({ summary: 'Get all recipes' })
    @ApiResponse({ status: 200, description: 'List of all recipes.' })

    async findAll(): Promise<Recipe[]>{
        return this.recipeService.findAll();
    }

    // Get recipe by id
    @Get(':id')
    // @UseGuards(JwtAuthGuard, RolesGuard)
    // @Roles('admin','user')
    @ApiOperation({ summary: 'Get recipe by id' })
    @ApiResponse({ status: 200, description: 'Recipe retrieved successfully.' })
    async findById(@Param('id') id: number): Promise<Recipe> {
        return this.recipeService.findById(id);
    }

    // Create new recipe
    @Post()
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('admin')
    @ApiOperation({ summary: 'Create new recipe' })
    @ApiBody({ type: CreateRecipeDto })
    @ApiResponse({ status: 201, description: 'Recipe created successfully.' })
    async create(@Body() recipeData: CreateRecipeDto): Promise<Recipe> {
        return this.recipeService.createWithDto(recipeData);
    }

    // Update recipe
    @Patch(':id')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('admin')
    @ApiOperation({ summary: 'Update recipe by id' })
    @ApiBody({ type: CreateRecipeDto })
    @ApiResponse({ status: 200, description: 'Recipe updated successfully.' })
    async update(@Param('id') id: number, @Body() recipeData: CreateRecipeDto): Promise<Recipe> {
        return this.recipeService.updateWithDto(id, recipeData);
    }

    // Delete recipe
    @Delete(':id')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('admin')
    @ApiOperation({ summary: 'Delete recipe by id' })
    @ApiResponse({ status: 200, description: 'Recipe deleted successfully.' })
    async delete(@Param('id') id: number): Promise<void> {
        return this.recipeService.delete(id);
    }


    // Create new recipe
    @Post('search')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('admin', 'user')
    @ApiOperation({ summary: 'Search recipe by name' })
    @ApiBody({ type: String })
    @ApiResponse({ status: 201, description: 'Recipes found successfully.' })
    async search(@Body('query') query: string): Promise<Recipe[]> {
        return this.recipeService.search(query);
    }



}
