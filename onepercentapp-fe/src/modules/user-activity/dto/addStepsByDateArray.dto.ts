import {IsArray, IsDate, IsNotEmpty, IsNumber, IsString, Matches, Min, ValidateNested} from 'class-validator';
import {IsInDatabase} from "../../../common/constraints/IsInDatabaseConstraint";
import {ActivityCategory} from "../../activity-category/entities/activity-category.entity";
import {ActivityMaterial} from "../../activity-material/entities/activity-material.entity";
import {ActivityIntensity} from "../../activity-intensity/entities/activity-intensity.entity";
import {ActivityType} from "../../activity-type/entities/activity-type.entity";
import {ApiProperty} from "@nestjs/swagger";
import {Type} from "class-transformer";

export class StepEntryDto {
    @ApiProperty({
        description: 'Date of the steps register',
        example: '2025-01-15 00:00:00',
    })
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

export class AddStepsByDateArrayDto {

    @ApiProperty({
        description: 'Date range of the steps register',
        example: '2025-01-15 00:00:00',
    })
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => StepEntryDto)
    data: StepEntryDto[];

}