import {Controller, Get, UseGuards} from '@nestjs/common';
import {ProvinceService} from "./province.service";
import {JwtAuthGuard} from "../../common/guards/jwt-auth.guard";
import {RolesGuard} from "../../common/guards/role.guard";
import {Roles} from "../../common/decorators/role.decorator";
import {ApiOperation, ApiResponse} from "@nestjs/swagger";
import {User} from "../user/entities/user.entity";
import {Province} from "./entities/province.entity";

@Controller('province')
export class ProvinceController {

    constructor(private readonly provinceService: ProvinceService) {
    }

    @Get('findAll')
    @UseGuards(JwtAuthGuard)
    @ApiOperation({ summary: 'Find all provinces' })
    @ApiResponse({ status: 200, description: 'List of provinces retrieved successfully.' })
    @ApiResponse({ status: 401, description: 'Unauthorized access.' })
    async findAll(): Promise<Province[]> {
        return this.provinceService.findAll();
    }
}
