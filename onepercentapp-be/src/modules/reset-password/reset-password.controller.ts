import {Controller, Get, Post, Body, Patch, Param, Delete, Res} from '@nestjs/common';
import { ResetPasswordService } from './reset-password.service';
import { CreateResetPasswordDto } from './dto/create-reset-password.dto';
import { UpdateResetPasswordDto } from './dto/update-reset-password.dto';
import { Response } from 'express';
import {ApiBody, ApiOperation, ApiParam, ApiResponse} from "@nestjs/swagger";

@Controller('reset-password')
export class ResetPasswordController {
  constructor(private readonly resetPasswordService: ResetPasswordService) {}

  @Post()
  @ApiOperation({ summary: 'Create a reset password request' })
  @ApiBody({ type: CreateResetPasswordDto })
  @ApiResponse({ status: 201, description: 'Reset password request created successfully.' })
  @ApiResponse({ status: 400, description: 'Validation errors.' })

  create(@Body() createResetPasswordDto: CreateResetPasswordDto) {
    return this.resetPasswordService.create(createResetPasswordDto);
  }

  @Get()
  @ApiOperation({ summary: 'Retrieve all reset password requests' })
  @ApiResponse({ status: 200, description: 'List of reset password requests retrieved successfully.' })

  findAll() {
    return this.resetPasswordService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Retrieve a reset password request by ID' })
  @ApiParam({ name: 'id', description: 'ID of the reset password request', example: '1' })
  @ApiResponse({ status: 200, description: 'Reset password request retrieved successfully.' })
  @ApiResponse({ status: 404, description: 'Reset password request not found.' })

  findOne(@Param('id') id: string) {
    return this.resetPasswordService.findById(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a reset password request by ID' })
  @ApiParam({ name: 'id', description: 'ID of the reset password request', example: '1' })
  @ApiBody({ type: UpdateResetPasswordDto })
  @ApiResponse({ status: 200, description: 'Reset password request updated successfully.' })
  @ApiResponse({ status: 400, description: 'Validation errors.' })
  @ApiResponse({ status: 404, description: 'Reset password request not found.' })

  update(@Param('id') id: string, @Body() updateResetPasswordDto: UpdateResetPasswordDto) {
    return this.resetPasswordService.update(+id, updateResetPasswordDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a reset password request by ID' })
  @ApiParam({ name: 'id', description: 'ID of the reset password request', example: '1' })
  @ApiResponse({ status: 200, description: 'Reset password request deleted successfully.' })
  @ApiResponse({ status: 404, description: 'Reset password request not found.' })

  remove(@Param('id') id: string) {
    return this.resetPasswordService.delete(+id);
  }

  @Get('getResetPage/:token')
  @ApiOperation({ summary: 'Retrieve the reset password page by token' })
  @ApiParam({ name: 'token', description: 'Reset password token', example: 'abc123' })
  @ApiResponse({ status: 200, description: 'HTML page for resetting password retrieved successfully.' })

  getResetPage(@Param('token') token: string, @Res({ passthrough: false }) res: Response) {
    const html = `
    <!DOCTYPE html>
    <html lang="es">
    <head>
      <meta charset="UTF-8">
      <title>Abriendo la app...</title>
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <script>
        window.onload = function () {
          const deepLink = "onepercentapp://reset-password?token=${token}";
          console.log("Trying to open deep link:", deepLink);
          window.location.href = deepLink;
          setTimeout(() => {
            window.location.href = "https://onepercentapp.com/download";
          }, 3000);
        };
      </script>
    </head>
    <body>
      <p>Estamos intentando abrir la app...</p>
      <p>Si no se abre, <a href="https://onepercentapp.com/download">haz clic aquí</a> para instalarla.</p>
    </body>
    </html>
  `;

    res.setHeader('Content-Type', 'text/html');
    res.send(html);
  }
}
