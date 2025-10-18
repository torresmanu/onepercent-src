import { IsEmail, IsNotEmpty, IsString, Matches } from 'class-validator';
import {IsEmailUnique} from "../../../common/constraints/IsEmailUniqueConstraint";
import {IsInDatabase} from "../../../common/constraints/IsInDatabaseConstraint";
import {ApiProperty} from "@nestjs/swagger";

export class CreateActivityTypeDto {

    @ApiProperty({
        description: 'Title of the activity type',
        example: 'Cardio',
    })
    @IsNotEmpty()
    @IsString()
    title: string;

}