import {Body, Controller, Delete, Get, Param, Post, Query, Req, UseGuards} from '@nestjs/common';
import {UserMealService} from "./user-meal.service";
import {JwtAuthGuard} from "../../common/guards/jwt-auth.guard";
import {ApiBody, ApiOperation, ApiQuery, ApiResponse, ApiTags} from "@nestjs/swagger";
import {CreateUserMealDto} from "./dto/create-user-meal.dto";
import {UserMeal} from "./entities/user-meal.entity";

@ApiTags('user-meal')
@Controller('user-meal')
export class UserMealController {

    constructor(
        private readonly userMealService: UserMealService,
    ) {
    }

    @Post()
    @UseGuards(JwtAuthGuard)
    @ApiOperation({ summary: 'Registrar comida del usuario' })
    @ApiBody({ type: CreateUserMealDto })
    @ApiResponse({ status: 201, description: 'Registro de comida creado exitosamente.', type: UserMeal })
    async createMealRecord(@Body() createUserMealDto: CreateUserMealDto, @Req() req: any): Promise<UserMeal> {
        return await this.userMealService.createMealRecord(req.user.id, createUserMealDto);
    }

    @Get()
    @UseGuards(JwtAuthGuard)
    @ApiOperation({ summary: 'Obtener todos los registros de comida del usuario' })
    @ApiResponse({ status: 200, description: 'Lista de registros de comida.', type: [UserMeal] })
    async getUserMealRecords(@Req() req: any): Promise<UserMeal[]> {
        return await this.userMealService.getUserMealRecords(req.user.id);
    }

    @Get('today')
    @UseGuards(JwtAuthGuard)
    @ApiOperation({ summary: 'Obtener los registros de comida del día de hoy' })
    @ApiResponse({ status: 200, description: 'Lista de registros de comida del día.', type: [UserMeal] })
    async getTodayMealRecords(@Req() req: any): Promise<UserMeal[]> {
        return await this.userMealService.getTodayMealRecords(req.user.id);
    }

    @Get('by-date')
    @UseGuards(JwtAuthGuard)
    @ApiOperation({ summary: 'Obtener registros de comida por fecha específica' })
    @ApiQuery({ name: 'date', type: String, description: 'Fecha (YYYY-MM-DD)' })
    @ApiResponse({ status: 200, description: 'Lista de registros de comida para la fecha.', type: [UserMeal] })
    async getUserMealRecordsByDate(
        @Req() req: any,
        @Query('date') date: string
    ): Promise<UserMeal[]> {
        return await this.userMealService.getUserMealRecordsByDate(req.user.id, date);
    }

    @Get('date-range')
    @UseGuards(JwtAuthGuard)
    @ApiOperation({ summary: 'Obtener registros de comida por rango de fechas' })
    @ApiQuery({ name: 'startDate', type: String, description: 'Fecha de inicio (YYYY-MM-DD)' })
    @ApiQuery({ name: 'endDate', type: String, description: 'Fecha de fin (YYYY-MM-DD)' })
    @ApiResponse({ status: 200, description: 'Lista de registros de comida en el rango.', type: [UserMeal] })
    async getUserMealRecordsByDateRange(
        @Req() req: any,
        @Query('startDate') startDate: string,
        @Query('endDate') endDate: string
    ): Promise<UserMeal[]> {
        return await this.userMealService.getUserMealRecordsByDateRange(
            req.user.id,
            startDate,
            endDate
        );
    }

    @Get(':id')
    @UseGuards(JwtAuthGuard)
    @ApiOperation({ summary: 'Obtener un registro de comida específico' })
    @ApiResponse({ status: 200, description: 'Registro de comida encontrado.', type: UserMeal })
    @ApiResponse({ status: 404, description: 'Registro de comida no encontrado.' })
    async getMealRecordById(@Param('id') id: number, @Req() req: any): Promise<UserMeal> {
        return await this.userMealService.getMealRecordById(id, req.user.id);
    }

    @Delete(':id')
    @UseGuards(JwtAuthGuard)
    @ApiOperation({ summary: 'Eliminar un registro de comida' })
    @ApiResponse({ status: 200, description: 'Registro de comida eliminado exitosamente.' })
    @ApiResponse({ status: 404, description: 'Registro de comida no encontrado.' })
    async deleteMealRecord(@Param('id') id: number, @Req() req: any): Promise<void> {
        return await this.userMealService.deleteMealRecord(id, req.user.id);
    }

    @Get('fruits/today')
    @UseGuards(JwtAuthGuard)
    @ApiOperation({ summary: 'Obtener el conteo de frutas del día de hoy' })
    @ApiResponse({ status: 200, description: 'Conteo de frutas del día.', schema: { type: 'number', example: 2.5 } })
    async getTodayFruitsCount(@Req() req: any): Promise<number> {
        return await this.userMealService.getTodayFruitsCount(req.user.id);
    }

    @Get('fruits/date-range')
    @UseGuards(JwtAuthGuard)
    @ApiOperation({ summary: 'Obtener el conteo de frutas por rango de fechas' })
    @ApiQuery({ name: 'startDate', type: String, description: 'Fecha de inicio (YYYY-MM-DD)' })
    @ApiQuery({ name: 'endDate', type: String, description: 'Fecha de fin (YYYY-MM-DD)' })
    @ApiResponse({ status: 200, description: 'Conteo total de frutas en el rango.', schema: { type: 'number', example: 15.2 } })
    async getUserFruitsCountByDateRange(
        @Req() req: any,
        @Query('startDate') startDate: string,
        @Query('endDate') endDate: string
    ): Promise<number> {
        return await this.userMealService.getUserFruitsCountByDateRange(
            req.user.id,
            startDate,
            endDate
        );
    }
}

