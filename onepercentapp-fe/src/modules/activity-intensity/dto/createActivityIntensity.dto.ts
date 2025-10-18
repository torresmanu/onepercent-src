import { IsEmail, IsNotEmpty, IsString, Matches } from 'class-validator';
import {IsEmailUnique} from "../../../common/constraints/IsEmailUniqueConstraint";
import {IsInDatabase} from "../../../common/constraints/IsInDatabaseConstraint";
import {ApiProperty} from "@nestjs/swagger";

export class CreateActivityIntensityDto {

    @ApiProperty({
        description: 'Title of the activity intensity',
        example: 'High Intensity',
    })
    @IsNotEmpty()
    @IsString()
    title: string;

}