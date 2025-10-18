import {
    IsArray,
    IsDate,
    IsDateString,
    IsInt,
    IsNotEmpty,
    IsNumber,
    IsString,
    Matches,
    Min,
    ValidateNested
} from 'class-validator';
import {IsInDatabase} from "../../../common/constraints/IsInDatabaseConstraint";
import {ActivityCategory} from "../../activity-category/entities/activity-category.entity";
import {ActivityMaterial} from "../../activity-material/entities/activity-material.entity";
import {ActivityIntensity} from "../../activity-intensity/entities/activity-intensity.entity";
import {ActivityType} from "../../activity-type/entities/activity-type.entity";
import {ApiProperty} from "@nestjs/swagger";
import {Type} from "class-transformer";

export class AddStepsByDayDto {

    @ApiProperty({
        description: 'Date of the steps register',
        example: '2025-01-15 00:00:00',
    })
    @IsNotEmpty()
    @IsDate()
    @Type(() => Date)
    date: string;

    @ApiProperty({
        description: 'Number of steps',
        example: '40',
    })
    @IsNotEmpty()
    @Type(() => Number)
    @IsNumber()
    @Min(0)
    steps: number;

}