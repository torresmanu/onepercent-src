import { HttpException, HttpStatus } from '@nestjs/common';
// import { BadRequestException, NotFoundException, UnauthorizedException } from '@nestjs/common';
//
// throw new BadRequestException('Datos inválidos');
// throw new NotFoundException('Recurso no encontrado');
// throw new UnauthorizedException('No autorizado');

export class MailException extends HttpException {
  constructor(message: string, status: HttpStatus) {
    super(message, status);
  }
}