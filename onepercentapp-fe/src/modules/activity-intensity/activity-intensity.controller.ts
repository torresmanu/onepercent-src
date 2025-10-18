import {BadRequestException, Body, Controller, Delete, Get, Param, Patch, Post, UseGuards} from '@nestjs/common';
import {JwtAuthGuard} from "../../common/guards/jwt-auth.guard";
import {RolesGuard} from "../../common/guards/role.guard";
import {Roles} from "../../common/decorators/role.decorator";
import {ApiBody, ApiOperation, ApiParam, ApiResponse} from "@nestjs/swagger";
import {validate} from "class-validator";
import {ActivityIntensityService} from "./activity-intensity.service";
import {ActivityIntensity} from "./entities/activity-intensity.entity";
import {CreateActivityIntensityDto} from "./dto/createActivityIntensity.dto";

@Controller('activity-intensity')
export class ActivityIntensityController {
    
    constructor(
        private readonly activityIntensityService: ActivityIntensityService,
    ) {
    }

    @Get()
    @UseGuards(JwtAuthGuard, RolesGuard)
    @ApiOperation({ summary: 'Find all ActivityIntensity' })
    @ApiResponse({ status: 200, description: 'List of all activity intensities retrieved successfully.' })

    async findAll(): Promise<ActivityIntensity[]> {
        return this.activityIntensityService.findAll();
    }

    @Get('findById/:activityIntensityId')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @ApiOperation({ summary: 'Get activityIntensityId by Id' })
    @ApiParam({ name: 'activityIntensityId', type: Number, description: 'ID of the activity intensity' })
    @ApiResponse({ status: 200, description: 'Activity intensity retrieved successfully.' })
    @ApiResponse({ status: 404, description: 'Activity intensity not found.' })

    async findById(@Param('activityIntensityId') activityIntensityId: number): Promise<ActivityIntensity> {
        return this.activityIntensityService.findById(activityIntensityId);
    }

    @Post()
    @UseGuards(JwtAuthGuard)
    @Roles('admin')
    @ApiOperation({ summary: 'Create ActivityIntensity' })
    @ApiBody({ type: CreateActivityIntensityDto })
    @ApiResponse({ status: 201, description: 'Activity intensity created successfully.' })
    @ApiResponse({ status: 400, description: 'Validation errors.' })

    async create(@Body() activityIntensityData: Partial<ActivityIntensity>): Promise<ActivityIntensity> {
        // DTO Validation
        const createActivityIntensityDto = Object.assign(new CreateActivityIntensityDto(), activityIntensityData);
        const errors = await validate(createActivityIntensityDto);
        if (errors.length > 0) { throw new BadRequestException(errors.map((error: any) => error.constraints)); }

        return this.activityIntensityService.create(activityIntensityData);
    }

    @Patch()
    @UseGuards(JwtAuthGuard)
    @Roles('admin')
    @ApiOperation({ summary: 'Update ActivityIntensity by id' })
    @ApiBody({ type: CreateActivityIntensityDto })
    @ApiResponse({ status: 200, description: 'Activity intensity updated successfully.' })
    @ApiResponse({ status: 400, description: 'Validation errors or missing ID.' })
    @ApiResponse({ status: 404, description: 'Activity intensity not found.' })

    async update(@Body() activityIntensityData: Partial<ActivityIntensity>): Promise<ActivityIntensity> {
        // DTO Validation
        const updateActivityIntensityDto = Object.assign(new CreateActivityIntensityDto(), activityIntensityData);
        const errors = await validate(updateActivityIntensityDto);
        if (errors.length > 0) { throw new BadRequestException(errors.map((error: any) => error.constraints)); }
        if (!activityIntensityData.id) { throw new BadRequestException('Activity Intensity ID is required'); }
        // ActivityIntensity id validation
        const ActivityIntensity = await this.activityIntensityService.findById(activityIntensityData.id);

        return this.activityIntensityService.update(ActivityIntensity.id, activityIntensityData);
    }

    @Delete(':activityIntensityId')
    @UseGuards(JwtAuthGuard)
    @Roles('admin')
    @ApiOperation({ summary: 'Delete ActivityIntensity' })
    @ApiParam({ name: 'activityIntensityId', type: Number, description: 'ID of the activity intensity to delete' })
    @ApiResponse({ status: 200, description: 'Activity intensity deleted successfully.' })
    @ApiResponse({ status: 404, description: 'Activity intensity not found.' })

    async delete(@Param('activityIntensityId') activityIntensityId: number): Promise<void> {
        return this.activityIntensityService.delete(activityIntensityId);
    }
}
