import { IsNotEmpty, IsString, Matches } from 'class-validator';
import {IsInDatabase} from "../../../common/constraints/IsInDatabaseConstraint";
import {ActivityCategory} from "../../activity-category/entities/activity-category.entity";
import {ActivityMaterial} from "../../activity-material/entities/activity-material.entity";
import {ActivityIntensity} from "../../activity-intensity/entities/activity-intensity.entity";
import {ActivityType} from "../../activity-type/entities/activity-type.entity";
import {ApiProperty} from "@nestjs/swagger";

export class CreateCapsuleDto {

    @ApiProperty({
        description: 'Title of the capsule',
        example: 'Morning Yoga Session',
    })
    @IsNotEmpty()
    @IsString()
    title: string;

    @ApiProperty({
        description: 'Publish date of the capsule',
        example: '2023-12-01T10:00:00Z',
    })
    @IsNotEmpty()
    @IsString()
    publishDate: Date;

    @ApiProperty({
        description: 'Duration of the capsule in minutes',
        example: 30,
    })
    @IsNotEmpty()
    @IsString()
    duration: number;

    @ApiProperty({
        description: 'ID of the associated activity category',
        example: '1',
    })
    @IsNotEmpty()
    @IsInDatabase(ActivityCategory, 'id')
    activityCategoryId: string;

    @ApiProperty({
        description: 'ID of the associated activity material',
        example: '2',
    })
    @IsNotEmpty()
    @IsInDatabase(ActivityMaterial, 'id')
    activityMaterialId: string;

    @ApiProperty({
        description: 'ID of the associated activity intensity',
        example: '3',
    })
    @IsNotEmpty()
    @IsInDatabase(ActivityIntensity, 'id')
    activityIntensityId: string;

    @ApiProperty({
        description: 'ID of the associated activity type',
        example: '4',
    })
    @IsNotEmpty()
    @IsInDatabase(ActivityType, 'id')
    activityTypeId: string;

}