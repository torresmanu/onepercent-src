import {Body, Controller, Post, UnauthorizedException, UseGuards,Request} from '@nestjs/common';
import {ApiBody, ApiOperation, ApiResponse, ApiTags} from "@nestjs/swagger";
import {LoginDto} from "../auth/dto/login.dto";
import {BackofficeService} from "./backoffice.service";
import {JwtAuthGuard} from "../../common/guards/jwt-auth.guard";
import {RolesGuard} from "../../common/guards/role.guard";
import {Roles} from "../../common/decorators/role.decorator";

@ApiTags('backoffice')
@Controller('backoffice')
export class BackofficeController {

    constructor(private backofficeService: BackofficeService) {}

    @Post('login')
    @ApiOperation({ summary: 'Login user into backoffice' })
    @ApiBody({ type: LoginDto })
    @ApiResponse({ status: 200, description: 'User logged in successfully.' })
    @ApiResponse({ status: 401, description: 'Unauthorized access.' })

    async login(@Body() loginDto: LoginDto ) {
        const {access_token, user} = await this.backofficeService.login(loginDto.email, loginDto.password);
        return {token: access_token, user};
    }

    @Post('logout')
    @ApiOperation({ summary: 'Logout user from backoffice' })
    @UseGuards(JwtAuthGuard)
    @ApiResponse({ status: 200, description: 'User logged out successfully.' })
    @ApiResponse({ status: 401, description: 'Unauthorized access.' })

    async logout(@Body() body: {}, @Request() req: any) {
        await this.backofficeService.logout(req.user.id);
        return { message: 'Logout done.' };
    }

}
