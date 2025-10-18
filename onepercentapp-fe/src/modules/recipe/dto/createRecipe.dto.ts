import {ApiProperty} from "@nestjs/swagger";
import {IsArray, IsEmail, IsInt, IsNotEmpty, IsNumber, IsOptional, IsString, ValidateNested} from "class-validator";
import {IsEmailUnique} from "../../../common/constraints/IsEmailUniqueConstraint";
import {IsInDatabase} from "../../../common/constraints/IsInDatabaseConstraint";
import {User} from "../../user/entities/user.entity";

export class CreateRecipeDto{
    @ApiProperty({
        description: 'Name of the recipe',
        example: 'Chocolate Cake',
    })
    @IsNotEmpty()
    @IsString()
    name: string;

    @ApiProperty({
        description: 'Time of preparation',
        example: '10',
    })
    @IsNotEmpty()
    timeOfPreparation: number;

    @ApiProperty({
        description: 'Kilo calories of recipe',
        example: '250',
    })
    @IsNotEmpty()
    kcal: number;

    @ApiProperty({
        description: 'Nutritional quality of recipe',
        example: '5',
    })
    @IsNotEmpty()
    nutritionalQuality: number;


//     Relationships -----------------------------------------------------------
    @IsArray()
    // @ValidateNested({ each: true })
    recipeIngredients: {
        ingredientId: number;
        quantity: number;
        unit: string;
    }[];

    @IsArray()
    @IsOptional()
    recipeSteps?: {
        step: number;
        name: string;
    }[];

    @IsArray()
    @IsString({ each: true })
    @IsOptional()
    momentOfDays?: string[];

    @IsArray()
    @IsString({ each: true })
    @IsOptional()
    dietTypes?: string[];

    @IsArray()
    @IsString({ each: true })
    @IsOptional()
    allergens?: string[];

    @IsArray()
    @IsOptional()
    nutritionalInfos?: {
        name: string;
        value: number;
    }[];

}