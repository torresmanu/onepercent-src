import {Controller, Get, Req, UseGuards} from '@nestjs/common';
import {UserPointService} from "./user-point.service";
import {JwtAuthGuard} from "../../common/guards/jwt-auth.guard";
import {RolesGuard} from "../../common/guards/role.guard";
import {Roles} from "../../common/decorators/role.decorator";
import {ApiOperation, ApiResponse} from "@nestjs/swagger";
import {UserPoint} from "./entities/user-point.entity";

@Controller('user-point')
export class UserPointController {
    constructor(
        private readonly userPointService: UserPointService,
    ) {
        // Constructor logic can be added here if needed
    }

    @Get('getUserPoints')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('admin', 'user')
    @ApiOperation({ summary: 'get all user points' })
    @ApiOperation({ summary: 'Retrieve all user points' })
    @ApiResponse({ status: 200, description: 'User points retrieved successfully.', type: [UserPoint] })
    @ApiResponse({ status: 401, description: 'Unauthorized access.' })

    async getUserPoints(@Req() req: any): Promise<UserPoint[]> {
      return this.userPointService.getUserPoints(req.user.id);
    }
}
