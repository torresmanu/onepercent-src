import {Body, Controller, Post, Req, UseGuards} from '@nestjs/common';
import {UserActivityService} from "./user-activity.service";
import {JwtAuthGuard} from "../../common/guards/jwt-auth.guard";
import {ApiBody, ApiOperation, ApiResponse} from "@nestjs/swagger";

import {User} from "../user/entities/user.entity";
import {AddStepsByDayDto} from "./dto/addStepsByDay.dto";
import {UserActivity} from "./entities/userActivity.entity";
import {AddStepsByDateArrayDto} from "./dto/addStepsByDateArray.dto";
import {RegisterUserActivityDto} from "./dto/registerUserActivity.dto";

@Controller('user-activity')
export class UserActivityController {

    constructor(
        private readonly userActivityService: UserActivityService,
    ) {
    }

    @Post('addUserStepsByDay')
    @UseGuards(JwtAuthGuard)
    @ApiOperation({ summary: 'Añadir pasos de un usuario y día en concreto' })
    @ApiBody({ type: AddStepsByDayDto })
    @ApiResponse({ status: 200, description: 'Pasos correctamente añadidos.' })
    async addUserStepsByDay(@Body() addStepsByDayDto: AddStepsByDayDto, @Req() req: any): Promise<UserActivity> {
        return await this.userActivityService.addUserStepsByDay(addStepsByDayDto, req.user.id);
    }

    @Post('addUserStepsByDateArray')
    @UseGuards(JwtAuthGuard)
    @ApiOperation({ summary: 'Añadir pasos de un usuario y día en concreto a partir de un array' })
    @ApiBody({ type: AddStepsByDateArrayDto })
    @ApiResponse({ status: 200, description: 'Pasos correctamente añadidos.' })
    async addUserStepsByDateArray(@Body() addStepsByDateArrayDto: AddStepsByDateArrayDto, @Req() req: any): Promise<UserActivity[]> {
        return await this.userActivityService.addUserStepsByDateArray(addStepsByDateArrayDto, req.user.id);
    }

    @Post('registerUserActivity')
    @UseGuards(JwtAuthGuard)
    @ApiOperation({ summary: 'Registrar actividad del usuario' })
    @ApiBody({ type: RegisterUserActivityDto })
    @ApiResponse({ status: 200, description: 'Actividad correctamente añadida.' })
    async registerUserActivity(@Body() registerUserActivityDto: RegisterUserActivityDto, @Req() req: any): Promise<UserActivity> {
        return await this.userActivityService.registerUserActivity(registerUserActivityDto, req.user.id);
    }


}
