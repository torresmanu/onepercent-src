import {Controller, Get, Post, Body, UseGuards, Param, BadRequestException, Patch, Delete, Req} from '@nestjs/common';
import { User } from './entities/user.entity';
import { UserService } from './user.service';
import {JwtAuthGuard} from "../../common/guards/jwt-auth.guard";
import {Roles} from "../../common/decorators/role.decorator";
import {RolesGuard} from "../../common/guards/role.guard";
import {CreateUserDto} from "./dto/createUser.dto";
import {validate} from "class-validator";
import {UpdateUserDto} from "./dto/updateUser.dto";
import {ApiBody, ApiOperation, ApiParam, ApiResponse} from "@nestjs/swagger";
import {Recipe} from "../recipe/entities/recipe.entity";
import { SearchUserDto } from './dto/searchUser.dto';

@Controller('user')
export class UserController {

    constructor(private readonly userService: UserService) {}

    @Get('findAll')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('admin')
    @ApiOperation({ summary: 'Find all users' })
    @ApiResponse({ status: 200, description: 'List of users retrieved successfully.' })
    @ApiResponse({ status: 401, description: 'Unauthorized access.' })
    async findAll(): Promise<User[]> {
        return this.userService.findAll();
    }

    @Get('findById/:userId')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('admin')
    @ApiOperation({ summary: 'Get user by Id' })
    @ApiParam({ name: 'userId', description: 'ID of the user', example: 1 })
    @ApiResponse({ status: 200, description: 'User retrieved successfully.' })
    @ApiResponse({ status: 404, description: 'User not found.' })

    async findById(@Param('userId') userId: number): Promise<User> {
        return this.userService.findById(userId);
    }

    @Post()
    @UseGuards(JwtAuthGuard)
    @Roles('admin')
    @ApiOperation({ summary: 'Create user' })
    @ApiBody({ type: CreateUserDto })
    @ApiResponse({ status: 201, description: 'User created successfully.' })
    @ApiResponse({ status: 400, description: 'Validation errors.' })

    async create(@Body() userData: Partial<User>): Promise<User> {
        // DTO Validation
        const createUserDto = Object.assign(new CreateUserDto(), userData);
        const errors = await validate(createUserDto);
        if (errors.length > 0) { throw new BadRequestException(errors.map((error: any) => error.constraints)); }

        return this.userService.create(userData);
    }

    @Patch()
    @UseGuards(JwtAuthGuard)
    @Roles('admin')
    @ApiOperation({ summary: 'Update user by id' })
    @ApiBody({ type: UpdateUserDto })
    @ApiResponse({ status: 200, description: 'User updated successfully.' })
    @ApiResponse({ status: 400, description: 'Validation errors.' })
    @ApiResponse({ status: 404, description: 'User not found.' })

    async update(@Body() userData: Partial<User>): Promise<User> {
        // DTO Validation
        const updateUserDto = Object.assign(new UpdateUserDto(), userData);
        const errors = await validate(updateUserDto);
        if (errors.length > 0) { throw new BadRequestException(errors.map((error: any) => error.constraints)); }
        if (!userData.id) { throw new BadRequestException('User ID is required'); }
        // User id validation
        const user = await this.userService.findById(userData.id);

        return this.userService.update(user.id, userData);
    }

    @Delete(':userId')
    @UseGuards(JwtAuthGuard)
    @Roles('admin')
    @ApiParam({ name: 'userId', description: 'ID of the user', example: 1 })
    @ApiResponse({ status: 200, description: 'User deleted successfully.' })
    @ApiResponse({ status: 404, description: 'User not found.' })
    @ApiOperation({ summary: 'Delete user' })
    async delete(@Param('userId') userId: number): Promise<void> {
        return this.userService.delete(userId);
    }

//     Get my favorite recipes
    @Get('myFavoriteRecipes')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('user', 'admin')
    @ApiOperation({ summary: 'Get my favorite recipes' })
    @ApiResponse({ status: 200, description: 'List of favorite recipes retrieved successfully.' })
    async getMyFavoriteRecipes(@Req() req: any): Promise<Recipe[]> {
        return this.userService.getMyFavoriteRecipes(req.user.id);
    }

//     Set favourite recipe
    @Post('setFavouriteRecipe')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('user', 'admin')
    @ApiOperation({ summary: 'Set favourite recipe' })
    @ApiParam({ name: 'recipeId', description: 'ID of the recipe to set as favourite', example: 1 })
    @ApiResponse({ status: 200, description: 'Recipe set as favourite successfully.' })
    async setFavouriteRecipe(@Req() req: any, @Body('recipeId') recipeId: number): Promise<User> {
        return this.userService.setFavouriteRecipe(req.user.id, recipeId);
    }

    @Post('deleteFavouriteRecipe')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('user', 'admin')
    @ApiOperation({ summary: 'Delete favourite recipe' })
    @ApiParam({ name: 'recipeId', description: 'ID of the recipe to delete from favourites', example: 1 })
    @ApiResponse({ status: 200, description: 'Recipe deleted from favourites successfully.' })
    async deleteFavouriteRecipe(@Req() req: any, @Body('recipeId') recipeId: number): Promise<User> {
        return this.userService.deleteFavouriteRecipe(req.user.id, recipeId);
    }

    @Post('searchFiltered')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('admin')
    @ApiOperation({ summary: 'Buscar usuarios filtrados por searchString y plan' })
    @ApiBody({ type: SearchUserDto })
    @ApiResponse({ status: 200, description: 'Lista de usuarios filtrados.' })
    async searchFilteredUsers(@Body() filters: SearchUserDto): Promise<User[]> {
        return this.userService.searchFilteredUsers(filters);
    }


}
