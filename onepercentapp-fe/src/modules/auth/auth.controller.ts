import {
  Controller,
  Post,
  Body,
  UnauthorizedException,
  Request,
  UseGuards,
  BadRequestException,
  Get, Param, Res, Query, HttpCode, Req
} from '@nestjs/common';
import { AuthService } from './auth.service';
import {LoginDto} from "./dto/login.dto";
import {ApiBody, ApiOperation, ApiQuery, ApiResponse, ApiTags} from "@nestjs/swagger";
import {APIException} from "../../common/exceptions/APIException";
import {JwtAuthGuard} from "../../common/guards/jwt-auth.guard";
import {validate} from "class-validator";
import {Roles} from "../../common/decorators/role.decorator";
import {User} from "../user/entities/user.entity";
import {CreateUserDto} from "../user/dto/createUser.dto";
import {UserService} from "../user/user.service";
import { Response } from 'express';
import {AuthGuard} from "@nestjs/passport";


@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private userService: UserService,
  ) {}

  @Post('emailExists')
  @HttpCode(200)
  @ApiOperation({ summary: 'Check if email exists in database' })
  @ApiResponse({ status: 200, description: 'Email existence checked successfully.' })
  async emailExists(@Body('email') email: string): Promise<boolean> {
    return await this.authService.emailExists(email);
  }

  @Post('login')
  @HttpCode(200)
  @ApiOperation({ summary: 'Login user' })
  @ApiBody({ type: LoginDto })
  @ApiResponse({ status: 200, description: 'User logged in successfully.' })
  @ApiResponse({ status: 400, description: 'Validation errors.' })
  async login(@Body() loginDto: LoginDto) {
    const errors = await validate(loginDto);
    if (errors.length > 0) {
      throw new BadRequestException(
        errors.map((error: any) => error.constraints),
      );
    }

    const { access_token, user } = await this.authService.login(
      loginDto.email,
      loginDto.password,
    );
    return { token: access_token, user };
  }

  @Post('googleLogin')
  @HttpCode(200)
  @ApiOperation({ summary: 'Login user with Google' })
  @ApiBody({ schema: { type: 'object', properties: { idToken: { type: 'string' }, email: { type: 'string' }, displayName: { type: 'string' }, imageProfile: { type: 'string' } } } })
  @ApiResponse({ status: 200, description: 'User logged in with Google successfully.' })
  async googleLogin(@Body('idToken') idToken: string, @Body('email') email: string, @Body('displayName') displayName: string, @Body('imageProfile') imageProfile: string) {
    const { access_token, user } = await this.authService.googleLogin(idToken, email, displayName, imageProfile);
    return { token: access_token, user };
  }

  @Post('appleLogin')
  @HttpCode(200)
  @ApiOperation({ summary: 'Login user with Apple' })
  @ApiBody({ schema: { type: 'object', properties: { idToken: { type: 'string' }, email: { type: 'string' }, displayName: { type: 'string' }, imageProfile: { type: 'string' } } } })
  @ApiResponse({ status: 200, description: 'User logged in with Apple successfully.' })

  async appleLogin(@Body('idToken') idToken: string, @Body('email') email: string, @Body('displayName') displayName: string, @Body('imageProfile') imageProfile: string) {
    const { access_token, user } = await this.authService.appleLogin(idToken, email, displayName, imageProfile);
    return { token: access_token, user };
  }

  @Post('metaLogin')
  @HttpCode(200)
  @ApiOperation({ summary: 'Login user with Meta' })
  @ApiBody({ schema: { type: 'object', properties: { idToken: { type: 'string' } } } })
  @ApiResponse({ status: 200, description: 'User logged in with Meta successfully.' })
  async metaLogin(@Body('idToken') idToken: string) {
    const { access_token, user } = await this.authService.metaLogin(idToken);
    return { token: access_token, user };
  }

  @Post('logout')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Logout user' })
  @ApiOperation({ summary: 'Logout user' })
  @ApiResponse({ status: 200, description: 'User logged out successfully.' })

  async logout(@Body() body: {}, @Request() req: any) {
    await this.authService.logout(req.user.id);
    return { message: 'Logout done.' };
  }

  @Post('resetPasswordEmail')
  @ApiOperation({ summary: 'resetPasswordEmail user' })
  @ApiBody({ schema: { type: 'object', properties: { email: { type: 'string' }, platform: { type: 'string' }, appScheme: { type: 'string' } } } })
  @ApiResponse({ status: 200, description: 'Reset password email sent successfully.' })

  async resetPasswordEmail(
    @Body()
    body: {
      email: string;
      platform: string;
      appScheme: string;
    },
  ) {
    await this.authService.resetPasswordEmail(
      body.email,
      body.platform,
      body.appScheme
    );
    return { message: 'Reset password sent successfully' };
  }

  @Post('setNewPassword')
  @ApiOperation({ summary: 'setNewPassword user' })
  @ApiBody({ schema: { type: 'object', properties: { token: { type: 'string' }, password: { type: 'string' } } } })
  @ApiResponse({ status: 200, description: 'Password reset successfully.' })

  async setNewPassword(@Body() body: { token: string; password: string }) {
    await this.authService.setNewPassword(body.token, body.password);
    return { message: 'Reset password done successfully' };
  }

  @Post('setNewOldPassword')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'setNewOldPassword user' })
  @ApiBody({ schema: { type: 'object', properties: { oldPassword: { type: 'string' }, password: { type: 'string' } } } })
  @ApiResponse({ status: 200, description: 'Password updated successfully.' })

  async setNewOldPassword(@Body() body: { oldPassword: string; password: string }, @Req() req: any) {
    await this.authService.setNewOldPassword(body.oldPassword, body.password, req.user.id);
    return { message: 'Reset password done successfully' };
  }



  @Get('validate-account')
  @ApiOperation({ summary: 'validate user account' })
  @ApiQuery({ name: 'token', type: 'string', required: true })
  @ApiResponse({ status: 200, description: 'Account validated successfully.' })
  @ApiResponse({ status: 400, description: 'Error validating account.' })

  async validateAccount(@Query('token') token: string, @Res() res: Response ) {
      console.log("token", token);
      try {
          await this.authService.validateAccount(token);
          return res.render('accountValidated', { message: 'Cuenta validada correctamente' });
      } catch (error) {
        console.log(error);
        return res.render('accountRejected', { message: 'Error al validar la cuenta' });
      }
  }

  @Post('register')
  @ApiOperation({ summary: 'Register new user' })
  @ApiBody({ type: CreateUserDto })
  @ApiResponse({ status: 201, description: 'User registered successfully.' })
  @ApiResponse({ status: 400, description: 'Validation errors.' })

  async create(@Body() userData: Partial<User>): Promise<User> {
    // Set default userId = 2 // User
    userData.roleId = 2;

    // DTO Validation
    const createUserDto = Object.assign(new CreateUserDto(), userData);
    const errors = await validate(createUserDto);
    if (errors.length > 0) {
      throw new BadRequestException(
        errors.map((error: any) => error.constraints),
      );
    }
    return this.userService.create(userData);
  }


  @Post('refreshToken')
  @ApiOperation({ summary: 'Refresh access token for user' })
  @ApiResponse({ status: 200, description: 'Access token renewed successfully' })
  @ApiResponse({ status: 401, description: 'Refresh token not valid' })
  async refreshToken(@Body() body: {refreshToken: string}) {
    return await this.authService.refreshToken(body.refreshToken);
  }
}