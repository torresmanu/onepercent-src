import {Body, Controller, Delete, Get, Param, Post, Query, Req, UseGuards} from '@nestjs/common';
import {UserHydrationService} from "./user-hydration.service";
import {JwtAuthGuard} from "../../common/guards/jwt-auth.guard";
import {ApiBody, ApiOperation, ApiQuery, ApiResponse, ApiTags} from "@nestjs/swagger";
import {CreateUserHydrationDto} from "./dto/createUserHydration.dto";
import {UserHydration} from "./entities/user-hydration.entity";

@ApiTags('user-hydration')
@Controller('user-hydration')
export class UserHydrationController {

    constructor(
        private readonly userHydrationService: UserHydrationService,
    ) {
    }

    @Post()
    @UseGuards(JwtAuthGuard)
    @ApiOperation({ summary: 'Registrar hidratación del usuario basado en color de orina' })
    @ApiBody({ type: CreateUserHydrationDto })
    @ApiResponse({ status: 201, description: 'Registro de hidratación creado exitosamente.', type: UserHydration })
    async createHydrationRecord(@Body() createUserHydrationDto: CreateUserHydrationDto, @Req() req: any): Promise<UserHydration> {
        return await this.userHydrationService.createHydrationRecord(req.user.id, createUserHydrationDto);
    }

    @Get()
    @UseGuards(JwtAuthGuard)
    @ApiOperation({ summary: 'Obtener todos los registros de hidratación del usuario' })
    @ApiResponse({ status: 200, description: 'Lista de registros de hidratación.', type: [UserHydration] })
    async getUserHydrationRecords(@Req() req: any): Promise<UserHydration[]> {
        return await this.userHydrationService.getUserHydrationRecords(req.user.id);
    }

    @Get('today')
    @UseGuards(JwtAuthGuard)
    @ApiOperation({ summary: 'Obtener los registros de hidratación del día de hoy' })
    @ApiResponse({ status: 200, description: 'Lista de registros de hidratación del día.', type: [UserHydration] })
    async getTodayHydrationRecords(@Req() req: any): Promise<UserHydration[]> {
        return await this.userHydrationService.getTodayHydrationRecords(req.user.id);
    }

    @Get('date-range')
    @UseGuards(JwtAuthGuard)
    @ApiOperation({ summary: 'Obtener registros de hidratación por rango de fechas' })
    @ApiQuery({ name: 'startDate', type: String, description: 'Fecha de inicio (ISO format)' })
    @ApiQuery({ name: 'endDate', type: String, description: 'Fecha de fin (ISO format)' })
    @ApiResponse({ status: 200, description: 'Lista de registros de hidratación en el rango.', type: [UserHydration] })
    async getUserHydrationRecordsByDateRange(
        @Req() req: any,
        @Query('startDate') startDate: string,
        @Query('endDate') endDate: string
    ): Promise<UserHydration[]> {
        return await this.userHydrationService.getUserHydrationRecordsByDateRange(
            req.user.id,
            new Date(startDate),
            new Date(endDate)
        );
    }

    @Get(':id')
    @UseGuards(JwtAuthGuard)
    @ApiOperation({ summary: 'Obtener un registro de hidratación específico' })
    @ApiResponse({ status: 200, description: 'Registro de hidratación encontrado.', type: UserHydration })
    @ApiResponse({ status: 404, description: 'Registro de hidratación no encontrado.' })
    async getHydrationRecordById(@Param('id') id: number, @Req() req: any): Promise<UserHydration> {
        return await this.userHydrationService.getHydrationRecordById(id, req.user.id);
    }

    @Delete(':id')
    @UseGuards(JwtAuthGuard)
    @ApiOperation({ summary: 'Eliminar un registro de hidratación' })
    @ApiResponse({ status: 200, description: 'Registro de hidratación eliminado exitosamente.' })
    @ApiResponse({ status: 404, description: 'Registro de hidratación no encontrado.' })
    async deleteHydrationRecord(@Param('id') id: number, @Req() req: any): Promise<void> {
        return await this.userHydrationService.deleteHydrationRecord(id, req.user.id);
    }
}

