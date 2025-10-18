import { IsEmail, IsNotEmpty, IsString, Matches } from 'class-validator';
import {IsEmailUnique} from "../../../common/constraints/IsEmailUniqueConstraint";
import {Role} from "../entities/role.entity";
import {IsInDatabase} from "../../../common/constraints/IsInDatabaseConstraint";
import {ApiProperty} from "@nestjs/swagger";

export class CreateUserDto {

    @ApiProperty({
        description: 'First name of the user',
        example: 'John',
    })
    @IsNotEmpty()
    firstname: string;

    @ApiProperty({
        description: 'Email address of the user',
        example: 'john.doe@example.com',
    })
    @IsEmail()
    @IsEmailUnique({ message: 'Email is already in use' })
    @IsNotEmpty()
    email: string;

    @ApiProperty({
        description: 'Password for the user account. Must contain at least one lowercase letter, one uppercase letter, and be at least 8 characters long.',
        example: 'Password123',
    })
    @IsString()
    @IsNotEmpty()
    @Matches(/^(?=.*[a-z])(?=.*[A-Z]).{8,}$/, {
        message: 'Password must contain at least one lowercase letter, one uppercase letter and be at least 8 characters long',
    })
    password: string;

    @ApiProperty({
        description: 'Role ID associated with the user',
        example: '1',
    })
    @IsNotEmpty()
    @IsInDatabase(Role, 'id')
    roleId: string;
}