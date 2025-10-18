import { IsEmail, IsNotEmpty, IsString, Matches } from 'class-validator';
import {IsEmailUnique} from "../../../common/constraints/IsEmailUniqueConstraint";
import {IsInDatabase} from "../../../common/constraints/IsInDatabaseConstraint";
import {ApiProperty} from "@nestjs/swagger";

export class CreateActivityMaterialDto {

    @ApiProperty({
        description: 'Title of the activity material',
        example: 'Yoga Mat',
    })
    @IsNotEmpty()
    @IsString()
    title: string;

}