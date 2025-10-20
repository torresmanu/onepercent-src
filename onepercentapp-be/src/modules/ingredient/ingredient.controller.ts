import {Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards} from '@nestjs/common';
import {IngredientService} from "./ingredient.service";
import {ApiBody, ApiOperation, ApiResponse} from "@nestjs/swagger";
import {JwtAuthGuard} from "../../common/guards/jwt-auth.guard";
import {RolesGuard} from "../../common/guards/role.guard";
import {Roles} from "../../common/decorators/role.decorator";
import {Ingredient} from "./entities/ingredient.entity";
import {CreateIngredientDto} from "./dto/createIngredient.dto";

@Controller('ingredient')
export class IngredientController {

    constructor(
        private readonly ingredientService: IngredientService
    ) {
    }

    // Search ingredients by query
    @Get('search')
    // @UseGuards(JwtAuthGuard, RolesGuard)
    // @Roles('admin','user')
    @ApiOperation({ summary: 'Search ingredients by name' })
    @ApiResponse({ status: 200, description: 'List of matching ingredients.' })
    async search(@Query('query') query: string): Promise<Ingredient[]> {
        return this.ingredientService.search(query);
    }

    // Get all ingredients
    @Get('')
    // @UseGuards(JwtAuthGuard, RolesGuard)
    // @Roles('admin','user')
    @ApiOperation({ summary: 'Get all ingredients' })
    @ApiResponse({ status: 200, description: 'List of all ingredients.' })

    async findAll(): Promise<Ingredient[]>{
        return this.ingredientService.findAll();
    }

//     Get ingredient by id
    @Get(':id')
    // @UseGuards(JwtAuthGuard, RolesGuard)
    // @Roles('admin','user')
    @ApiOperation({ summary: 'Get ingredient by id' })
    @ApiResponse({ status: 200, description: 'Ingredient retrieved successfully.' })

    async findById(@Param('id') id: number): Promise<Ingredient> {
        console.log("Finding ingredient by id:", id);
        return this.ingredientService.findById(id);
    }

    // Create new ingredient
    @Post()
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('admin')
    @ApiOperation({ summary: 'Create new ingredient' })
    @ApiBody({ type: CreateIngredientDto })
    @ApiResponse({ status: 201, description: 'Ingredient created successfully.' })
    async create(@Body() ingredientData: CreateIngredientDto): Promise<Ingredient> {
        return this.ingredientService.create(ingredientData);
    }

    // Update ingredient by id
    @Patch(':id')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('admin')
    @ApiOperation({ summary: 'Update ingredient by id' })
    @ApiBody({ type: CreateIngredientDto })
    @ApiResponse({ status: 200, description: 'Ingredient updated successfully.' })
    async update(@Param('id') id: number, @Body() ingredientData: CreateIngredientDto): Promise<Ingredient> {
        return this.ingredientService.update(id, ingredientData);
    }

    // Delete ingredient by id
    @Delete(':id')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('admin')
    @ApiOperation({ summary: 'Delete ingredient by id' })
    @ApiResponse({ status: 200, description: 'Ingredient deleted successfully.' })
    async delete(@Param('id') id: number): Promise<void> {
        return this.ingredientService.delete(id);
    }



}
