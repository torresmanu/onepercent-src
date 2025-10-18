import {ApiProperty} from "@nestjs/swagger";
import {IsEmail, IsNotEmpty, IsString} from "class-validator";
import {IsEmailUnique} from "../../../common/constraints/IsEmailUniqueConstraint";

export class CreateIngredientDto{
    @ApiProperty({
        description: 'Name of the ingredient',
        example: 'Sugar',
    })
    @IsNotEmpty()
    @IsString()
    name: string;

    @ApiProperty({
        description: 'Tecnical name of the ingredient',
        example: 'Sucrose',
    })
    @IsNotEmpty()
    @IsString()
    technicalName: string;
}