import {
    IsArray,
    IsDate,
    IsDateString,
    IsInt,
    IsNotEmpty,
    IsNumber, IsOptional,
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
import {User} from "../../user/entities/user.entity";
import {UserActivityRegisterType} from "../entities/userActivity.entity";
import {Capsule} from "../../capsule/entities/capsule.entity";

export class RegisterUserActivityDto {

    @ApiProperty({
        description: 'Activity type between "steps" and "workout"',
        example: 'workout',
    })
    @IsString()
    @IsNotEmpty()
    userActivityRegisterType: UserActivityRegisterType;

    @ApiProperty({
        description: 'Title of the activity (optional)',
        example: 'press',
    })
    @IsString()
    @IsOptional()
    title: string;

    @ApiProperty({
        description: 'Activity ID (optional)',
        example: '3',
    })
    @IsInDatabase(ActivityType, 'id')
    @IsNumber()
    @Type(() => Number)
    activityTypeId: number;

    @ApiProperty({
        description: 'Capsule ID (optional)',
        example: '3',
    })
    @IsInDatabase(Capsule, 'id')
    @IsNumber()
    @IsOptional()
    @Type(() => Number)
    capsuleId: number;

    @ApiProperty({
        description: 'Duration in minutes (optional)',
        example: '45',
    })
    @IsNumber()
    @Type(() => Number)
    minutes: number;

    @ApiProperty({
        description: 'Number of steps (optional)',
        example: '5000',
    })
    @IsNumber()
    @IsOptional()
    @Type(() => Number)
    steps: number;

    @ApiProperty({
        description: 'Perceived effort (optional)',
        example: '7',
    })
    @IsNumber()
    @Type(() => Number)
    perceivedEffort: number;

    @ApiProperty({
        description: 'Distance in kilometers (optional)',
        example: '5.2',
    })
    @IsNumber()
    @IsOptional()
    @Type(() => Number)
    distanceInKms: number;
}