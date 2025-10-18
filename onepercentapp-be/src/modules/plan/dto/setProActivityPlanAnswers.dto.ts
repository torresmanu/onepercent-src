import {ApiProperty} from "@nestjs/swagger";
import {IsDate, IsEmail, IsNotEmpty, IsNumber, IsOptional, IsString} from "class-validator";
import {IsEmailUnique} from "../../../common/constraints/IsEmailUniqueConstraint";
import {IsInDatabase} from "../../../common/constraints/IsInDatabaseConstraint";
import {Gender} from "../entities/gender.entity";
import {Referral} from "../entities/referral.entity";
import {ActiveData} from "../entities/activeData.entity";
import {WorkoutWeek} from "../entities/workoutWeek.entity";
import {CardiovascularLevel} from "../entities/cardiovascularLevel";
import {Target} from "../../target/entities/target.entity";
import {Type} from "class-transformer";

export class SetProActivityPlanAnswersDto{
    @ApiProperty({
        description: 'Date of birth of the user',
        example: '2000-01-01',
    })
    @IsNotEmpty()
    @Type(() => Date) // <-- Esto transforma el string a Date
    @IsDate()
    birthdate: string;

    @ApiProperty({
        description: 'Height of user (cms)',
        example: '173',
    })
    @IsNotEmpty()
    @IsNumber()
    @Type(() => Number) // <-- esto transforma "173" a 173
    height: number;

    @ApiProperty({
        description: 'Weight of user (kgs)',
        example: '70',
    })
    @IsNotEmpty()
    @IsNumber()
    @Type(() => Number) // <-- esto transforma "173" a 173
    weight: number;

    @ApiProperty({
        description: 'Gender ID of user',
        example: '1',
    })
    @IsInDatabase(Gender, 'id')
    @IsNumber()
    @Type(() => Number) // <-- esto transforma "173" a 173
    genderId: number;

    @ApiProperty({
        description: 'Other Gender of user',
        example: 'other',
    })
    @IsString()
    @IsOptional()
    gender: string;

    @ApiProperty({
        description: 'Referral ID',
        example: '6',
    })
    @IsInDatabase(Referral, 'id')
    @IsNumber()
    @Type(() => Number) // <-- esto transforma "173" a 173
    referralId: number;

    @ApiProperty({
        description: 'Active data iD',
        example: '3',
    })
    @IsInDatabase(ActiveData, 'id')
    @IsNumber()
    @Type(() => Number) // <-- esto transforma "173" a 173
    activeDataId: number;

    @ApiProperty({
        description: 'Workout week ID',
        example: '1',
    })
    @IsInDatabase(WorkoutWeek, 'id')
    @IsNumber()
    @Type(() => Number) // <-- esto transforma "173" a 173
    workoutWeekId: number;

    @ApiProperty({
        description: 'Cardiovascular level ID',
        example: '2',
    })
    @IsInDatabase(CardiovascularLevel, 'id')
    @IsNumber()
    @Type(() => Number) // <-- esto transforma "173" a 173
    cardiovascularLevelId: number;

    @ApiProperty({
        description: 'Personal target',
        example: '3',
    })
    @IsInDatabase(Target, 'id')
    @IsNumber()
    @Type(() => Number) // <-- esto transforma "173" a 173
    @IsOptional()
    targetId: number;


}