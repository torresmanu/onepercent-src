import {ApiProperty} from "@nestjs/swagger";
import {ArrayNotEmpty, IsArray, IsDate, IsEmail, IsNotEmpty, IsNumber, IsOptional, IsString} from "class-validator";
import {IsEmailUnique} from "../../../common/constraints/IsEmailUniqueConstraint";
import {IsInDatabase} from "../../../common/constraints/IsInDatabaseConstraint";
import {Gender} from "../entities/gender.entity";
import {Referral} from "../entities/referral.entity";
import {ActiveData} from "../entities/activeData.entity";
import {WorkoutWeek} from "../entities/workoutWeek.entity";
import {CardiovascularLevel} from "../entities/cardiovascularLevel";
import {Target} from "../../target/entities/target.entity";
import {Allergy} from "../entities/allergy";
import {Intolerance} from "../entities/intolerance";
import {HydrationDay} from "../entities/hydrationDay.entity";
import {LunchDay} from "../entities/lunchDay.entity";
import {VegetablesAndFruits} from "../entities/vegetablesAndFruits.entity";
import {Type} from "class-transformer";

export class SetInitialAnswersDto{

    @ApiProperty({
        description: 'Active data iD',
        example: '3',
    })
    @IsInDatabase(ActiveData, 'id')
    @IsNotEmpty()
    @IsNumber()
    @Type(() => Number)
    activeDataId: number;

    @ApiProperty({
        description: 'Workout week ID',
        example: '1',
    })
    @IsInDatabase(WorkoutWeek, 'id')
    @IsNotEmpty()
    @IsNumber()
    @Type(() => Number)
    workoutWeekId: number;

    @ApiProperty({
        description: 'Hydration ID',
        example: '1',
    })
    @IsInDatabase(HydrationDay, 'id')
    @IsNotEmpty()
    @IsNumber()
    @Type(() => Number)
    hydrationDayId: number;

    @ApiProperty({
        description: 'Lunch per day ID',
        example: '1',
    })
    @IsInDatabase(LunchDay, 'id')
    @IsNotEmpty()
    @IsNumber()
    @Type(() => Number)
    lunchDayId: number;

    @ApiProperty({
        description: 'Array of type of meals IDs',
        example: [1, 3, 5],
        type: [Number]
    })
    @IsArray()
    @ArrayNotEmpty()
    @IsOptional()
    @IsNumber({}, { each: true })
    mealTypesIds: number[];

    @ApiProperty({
        description: 'Vegetables and fruits per day ID',
        example: '1',
    })
    @IsInDatabase(VegetablesAndFruits, 'id')
    @IsNotEmpty()
    @IsNumber()
    @Type(() => Number)
    vegetablesAndFruitsId: number;
}