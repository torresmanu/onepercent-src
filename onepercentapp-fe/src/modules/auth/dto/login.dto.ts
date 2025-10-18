import { IsEmail, IsNotEmpty, IsString, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
    @IsEmail()
    @IsNotEmpty()
    @ApiProperty({ description: 'User email address', example: 'user@example.com' })
    email: string;

    @IsString()
    @IsNotEmpty()
    @ApiProperty({ description: 'User password', example: 'Password123' })
    @Matches(/^(?=.*[a-z])(?=.*[A-Z]).{8,}$/, {
        message: 'Password must contain at least one lowercase letter, one uppercase letter and be at least 8 characters long',
    })
    password: string;
}