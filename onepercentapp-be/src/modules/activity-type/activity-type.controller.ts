import {BadRequestException, Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards} from '@nestjs/common';
import {JwtAuthGuard} from "../../common/guards/jwt-auth.guard";
import {RolesGuard} from "../../common/guards/role.guard";
import {Roles} from "../../common/decorators/role.decorator";
import {ApiBody, ApiOperation, ApiParam, ApiResponse} from "@nestjs/swagger";
import {validate} from "class-validator";
import {ActivityType} from "./entities/activity-type.entity";
import {CreateActivityTypeDto} from "./dto/createActivityType.dto";
import {ActivityTypeService} from "./activity-type.service";


@Controller('activity-type')
export class ActivityTypeController {
    constructor(
        private readonly activityTypeService: ActivityTypeService,
    ) {
    }

    @Get('search')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @ApiOperation({ summary: 'Search activity types by name' })
    @ApiResponse({ status: 200, description: 'List of matching activity types.' })
    async search(@Query('query') query: string): Promise<ActivityType[]> {
        return this.activityTypeService.search(query);
    }

    @Get()
    @UseGuards(JwtAuthGuard, RolesGuard)
    @ApiOperation({ summary: 'Find all ActivityType' })
    @ApiResponse({ status: 200, description: 'List of all activity types retrieved successfully.' })

    async findAll(): Promise<ActivityType[]> {
        return this.activityTypeService.findAll();
    }

    @Get('findById/:activityTypeId')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @ApiOperation({ summary: 'Get ActivityType by Id' })
    @ApiParam({ name: 'activityTypeId', type: Number, description: 'ID of the activity type' })
    @ApiResponse({ status: 200, description: 'Activity type retrieved successfully.' })
    @ApiResponse({ status: 404, description: 'Activity type not found.' })

    async findById(@Param('activityTypeId') activityTypeId: number): Promise<ActivityType> {
        return this.activityTypeService.findById(activityTypeId);
    }

    @Post()
    @UseGuards(JwtAuthGuard)
    @Roles('admin')
    @ApiOperation({ summary: 'Create ActivityType' })
    @ApiBody({ type: CreateActivityTypeDto })
    @ApiResponse({ status: 201, description: 'Activity type created successfully.' })
    @ApiResponse({ status: 400, description: 'Validation errors.' })

    async create(@Body() activityTypeData: Partial<ActivityType>): Promise<ActivityType> {
        // DTO Validation
        const createActivityTypeDto = Object.assign(new CreateActivityTypeDto(), activityTypeData);
        const errors = await validate(createActivityTypeDto);
        if (errors.length > 0) { throw new BadRequestException(errors.map((error: any) => error.constraints)); }

        return this.activityTypeService.create(activityTypeData);
    }

    @Patch()
    @UseGuards(JwtAuthGuard)
    @Roles('admin')
    @ApiOperation({ summary: 'Update ActivityType by id' })
    @ApiBody({ type: CreateActivityTypeDto })
    @ApiResponse({ status: 200, description: 'Activity type updated successfully.' })
    @ApiResponse({ status: 400, description: 'Validation errors or missing ID.' })
    @ApiResponse({ status: 404, description: 'Activity type not found.' })

    async update(@Body() activityTypeData: Partial<ActivityType>): Promise<ActivityType> {
        // DTO Validation
        const updateActivityTypeDto = Object.assign(new CreateActivityTypeDto(), activityTypeData);
        const errors = await validate(updateActivityTypeDto);
        if (errors.length > 0) { throw new BadRequestException(errors.map((error: any) => error.constraints)); }
        if (!activityTypeData.id) { throw new BadRequestException('Activity Type ID is required'); }
        // ActivityType id validation
        const activityType = await this.activityTypeService.findById(activityTypeData.id);

        return this.activityTypeService.update(activityType.id, activityTypeData);
    }

    @Delete(':activityTypeId')
    @UseGuards(JwtAuthGuard)
    @Roles('admin')
    @ApiOperation({ summary: 'Delete ActivityType' })
    @ApiParam({ name: 'activityTypeId', type: Number, description: 'ID of the activity type to delete' })
    @ApiResponse({ status: 200, description: 'Activity type deleted successfully.' })
    @ApiResponse({ status: 404, description: 'Activity type not found.' })

    async delete(@Param('activityTypeId') activityTypeId: number): Promise<void> {
        return this.activityTypeService.delete(activityTypeId);
    }
    
}
