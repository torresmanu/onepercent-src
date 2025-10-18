import { IsEmail, IsNotEmpty, IsString, Matches } from 'class-validator';
import {ApiProperty} from "@nestjs/swagger";

export class SendContactFormEmailDto {

    @ApiProperty({
        description: 'Message content of the contact form',
        example: 'Hello, I need assistance with my account.',
    })
    @IsNotEmpty()
    @IsString()
    message: string;
}