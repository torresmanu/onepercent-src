import {BadRequestException, Body, Controller, Delete, Get, Param, Patch, Post, UseGuards} from '@nestjs/common';
import {JwtAuthGuard} from "../../common/guards/jwt-auth.guard";
import {RolesGuard} from "../../common/guards/role.guard";
import {Roles} from "../../common/decorators/role.decorator";
import {ApiBody, ApiOperation, ApiParam, ApiResponse} from "@nestjs/swagger";
import {ActivityCategoryService} from "./activity-category.service";
import {validate} from "class-validator";
import {CreateActivityCategoryDto} from "./dto/createActivityCategory.dto";
import {ActivityCategory} from "./entities/activity-category.entity";

@Controller('activity-category')
export class ActivityCategoryController {

    constructor(
        private readonly activityCategoryService: ActivityCategoryService,
    ) {
    }

    @Get()
    @UseGuards(JwtAuthGuard, RolesGuard)
    @ApiOperation({ summary: 'Find all activity categories' })
    @ApiResponse({ status: 200, description: 'List of all activity categories retrieved successfully.' })
    async findAll(): Promise<ActivityCategory[]> {
        return this.activityCategoryService.findAll();
    }

    @Get('findById/:userId')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @ApiOperation({ summary: 'Get user by Id' })
    @ApiParam({ name: 'userId', type: Number, description: 'ID of the activity category' })
    @ApiResponse({ status: 200, description: 'Activity category retrieved successfully.' })
    @ApiResponse({ status: 404, description: 'Activity category not found.' })

    async findById(@Param('userId') userId: number): Promise<ActivityCategory> {
        return this.activityCategoryService.findById(userId);
    }

    @Post()
    @UseGuards(JwtAuthGuard)
    @Roles('admin')
    @ApiOperation({ summary: 'Create ActivityCategory' })
    @ApiBody({ type: CreateActivityCategoryDto })
    @ApiResponse({ status: 201, description: 'Activity category created successfully.' })
    @ApiResponse({ status: 400, description: 'Validation errors.' })

    async create(@Body() activityCategoryData: Partial<ActivityCategory>): Promise<ActivityCategory> {
        // DTO Validation
        const createActivityCategoryDto = Object.assign(new CreateActivityCategoryDto(), activityCategoryData);
        const errors = await validate(createActivityCategoryDto);
        if (errors.length > 0) { throw new BadRequestException(errors.map((error: any) => error.constraints)); }

        return this.activityCategoryService.create(activityCategoryData);
    }

    @Patch()
    @UseGuards(JwtAuthGuard)
    @Roles('admin')
    @ApiOperation({ summary: 'Update ActivityCategory by id' })
    @ApiBody({ type: CreateActivityCategoryDto })
    @ApiResponse({ status: 200, description: 'Activity category updated successfully.' })
    @ApiResponse({ status: 400, description: 'Validation errors or missing ID.' })
    @ApiResponse({ status: 404, description: 'Activity category not found.' })

    async update(@Body() activityCategoryData: Partial<ActivityCategory>): Promise<ActivityCategory> {
        // DTO Validation
        const updateActivityCategoryDto = Object.assign(new CreateActivityCategoryDto(), activityCategoryData);
        const errors = await validate(updateActivityCategoryDto);
        if (errors.length > 0) { throw new BadRequestException(errors.map((error: any) => error.constraints)); }
        if (!activityCategoryData.id) { throw new BadRequestException('Activity Category ID is required'); }
        // activityCategory id validation
        const activityCategory = await this.activityCategoryService.findById(activityCategoryData.id);

        return this.activityCategoryService.update(activityCategory.id, activityCategoryData);
    }

    @Delete(':activityCategoryId')
    @UseGuards(JwtAuthGuard)
    @Roles('admin')
    @ApiOperation({ summary: 'Delete ActivityCategory' })
    @ApiParam({ name: 'activityCategoryId', type: Number, description: 'ID of the activity category to delete' })
    @ApiResponse({ status: 200, description: 'Activity category deleted successfully.' })
    @ApiResponse({ status: 404, description: 'Activity category not found.' })

    async delete(@Param('activityCategoryId') activityCategoryId: number): Promise<void> {
        return this.activityCategoryService.delete(activityCategoryId);
    }
}
