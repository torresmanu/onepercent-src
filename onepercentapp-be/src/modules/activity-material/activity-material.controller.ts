import {BadRequestException, Body, Controller, Delete, Get, Param, Patch, Post, UseGuards} from '@nestjs/common';
import {JwtAuthGuard} from "../../common/guards/jwt-auth.guard";
import {RolesGuard} from "../../common/guards/role.guard";
import {Roles} from "../../common/decorators/role.decorator";
import {validate} from "class-validator";
import {ActivityMaterial} from "./entities/activity-material.entity";
import {CreateActivityMaterialDto} from "./dto/createActivityMaterial.dto";
import {ActivityMaterialService} from "./activity-material.service";
import {ApiOperation, ApiResponse, ApiTags, ApiBody, ApiParam} from "@nestjs/swagger";


@Controller('activity-material')
export class ActivityMaterialController {
    constructor(
        private readonly activityMaterialService: ActivityMaterialService,
    ) {
    }

    @Get()
    @UseGuards(JwtAuthGuard, RolesGuard)
    @ApiOperation({ summary: 'Find all ActivityMaterial' })
    @ApiResponse({ status: 200, description: 'List of all activity materials retrieved successfully.' })

    async findAll(): Promise<ActivityMaterial[]> {
        return this.activityMaterialService.findAll();
    }

    @Get('findById/:activityMaterialId')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @ApiOperation({ summary: 'Get ActivityMaterial by Id' })
    @ApiParam({ name: 'activityMaterialId', type: Number, description: 'ID of the activity material' })
    @ApiResponse({ status: 200, description: 'Activity material retrieved successfully.' })
    @ApiResponse({ status: 404, description: 'Activity material not found.' })

    async findById(@Param('activityMaterialId') activityMaterialId: number): Promise<ActivityMaterial> {
        return this.activityMaterialService.findById(activityMaterialId);
    }

    @Post()
    @UseGuards(JwtAuthGuard)
    @Roles('admin')
    @ApiOperation({ summary: 'Create ActivityMaterial' })
    @ApiBody({ type: CreateActivityMaterialDto })
    @ApiResponse({ status: 201, description: 'Activity material created successfully.' })
    @ApiResponse({ status: 400, description: 'Validation errors.' })

    async create(@Body() activityMaterialData: Partial<ActivityMaterial>): Promise<ActivityMaterial> {
        // DTO Validation
        const createActivityMaterialDto = Object.assign(new CreateActivityMaterialDto(), activityMaterialData);
        const errors = await validate(createActivityMaterialDto);
        if (errors.length > 0) { throw new BadRequestException(errors.map((error: any) => error.constraints)); }

        return this.activityMaterialService.create(activityMaterialData);
    }

    @Patch()
    @UseGuards(JwtAuthGuard)
    @Roles('admin')
    @ApiOperation({ summary: 'Update ActivityMaterial by id' })
    @ApiBody({ type: CreateActivityMaterialDto })
    @ApiResponse({ status: 200, description: 'Activity material updated successfully.' })
    @ApiResponse({ status: 400, description: 'Validation errors or missing ID.' })
    @ApiResponse({ status: 404, description: 'Activity material not found.' })

    async update(@Body() activityMaterialData: Partial<ActivityMaterial>): Promise<ActivityMaterial> {
        // DTO Validation
        const updateActivityMaterialDto = Object.assign(new CreateActivityMaterialDto(), activityMaterialData);
        const errors = await validate(updateActivityMaterialDto);
        if (errors.length > 0) { throw new BadRequestException(errors.map((error: any) => error.constraints)); }
        if (!activityMaterialData.id) { throw new BadRequestException('Activity Material ID is required'); }
        // ActivityMaterial id validation
        const activityMaterial = await this.activityMaterialService.findById(activityMaterialData.id);

        return this.activityMaterialService.update(activityMaterial.id, activityMaterialData);
    }

    @Delete(':activityMaterialId')
    @UseGuards(JwtAuthGuard)
    @Roles('admin')
    @ApiOperation({ summary: 'Delete ActivityMaterial' })
    @ApiParam({ name: 'activityMaterialId', type: Number, description: 'ID of the activity material to delete' })
    @ApiResponse({ status: 200, description: 'Activity material deleted successfully.' })
    @ApiResponse({ status: 404, description: 'Activity material not found.' })

    async delete(@Param('activityMaterialId') activityMaterialId: number): Promise<void> {
        return this.activityMaterialService.delete(activityMaterialId);
    }
    
}
