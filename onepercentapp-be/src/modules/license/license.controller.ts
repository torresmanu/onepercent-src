import {Body, Controller, Get, Post, Req, UseGuards} from '@nestjs/common';
import {JwtAuthGuard} from "../../common/guards/jwt-auth.guard";
import {Roles} from "../../common/decorators/role.decorator";
import {ApiBody, ApiOperation, ApiResponse} from "@nestjs/swagger";
import {LicenseService} from "./license.service";
import {License} from "./entities/license.entity";
import {RolesGuard} from "../../common/guards/role.guard";
import {UserLicense} from "../user-license/entities/user-license.entity";

@Controller('license')
export class LicenseController {

    constructor(
        private readonly licenseService: LicenseService,
        ) {

    }

    @Get('getActiveLicense')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('admin', 'user')
    @ApiOperation({ summary: 'get active license to user' })
    @ApiResponse({ status: 200, description: 'Active license retrieved successfully.' })
    @ApiResponse({ status: 401, description: 'Unauthorized access.' })

    async getActiveLicense(@Req() req: any): Promise<UserLicense[]> {
        return this.licenseService.getActiveLicense(req.user.id);
    }

    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                userId: { type: 'number', description: 'ID of the user', example: 1 },
                licenseId: { type: 'number', description: 'ID of the license', example: 101 },
            },
        },
    })
    @ApiResponse({ status: 201, description: 'License assigned successfully.' })
    @ApiResponse({ status: 400, description: 'Validation errors.' })
    @ApiResponse({ status: 401, description: 'Unauthorized access.' })

    @Post('setAdminLicense')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('admin')
    @ApiOperation({ summary: 'Set license to user (admin)' })
    async setAdminLicense(@Body('userId') userId: number, @Body('licenseId') licenseId: number): Promise<License> {
        return this.licenseService.setAdminLicense(userId, licenseId);
    }

    @Post('setLicense')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('admin', 'user')
    @ApiOperation({ summary: 'Set License to user' })
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                licenseId: { type: 'number', description: 'ID of the license', example: 101 },
            },
        },
    })
    @ApiResponse({ status: 201, description: 'License assigned successfully.' })
    @ApiResponse({ status: 400, description: 'Validation errors.' })
    @ApiResponse({ status: 401, description: 'Unauthorized access.' })

    async setLicense(@Body('licenseId') licenseId: number, @Req() req: any): Promise<{user: any, errors: any}> {
        return this.licenseService.setLicense(req.user.id, licenseId);
    }
}
