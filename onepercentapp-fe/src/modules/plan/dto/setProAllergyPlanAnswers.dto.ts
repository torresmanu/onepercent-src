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

export class SetProAllergyPlanAnswersDto{

    @ApiProperty({
        description: 'Array of Allergy IDs',
        example: [1, 3, 5],
        type: [Number]
    })
    @IsArray()
    @ArrayNotEmpty()
    @IsNumber({}, { each: true })
    allergiesIds: number[];

    @ApiProperty({
        description: 'Array of intolerance IDs',
        example: [1, 3, 5],
        type: [Number]
    })
    @IsArray()
    @ArrayNotEmpty()
    @IsNumber({}, { each: true })
    intolerancesIds: number[];

    @ApiProperty({
        description: 'Array of nutrition preference IDs',
        example: [1, 3, 5],
        type: [Number]
    })
    @IsArray()
    @ArrayNotEmpty()
    @IsNumber({}, { each: true })
    nutritionPreferencesIds: number[];

}