import {IsArray, IsNotEmpty, IsNumber, IsOptional, IsString, ValidateNested} from 'class-validator';
import {ApiProperty} from "@nestjs/swagger";
import {Type} from "class-transformer";

export class CreateUserMealIngredientDto {
    @ApiProperty({
        description: 'ID del ingrediente',
        example: 1
    })
    @IsNotEmpty()
    @IsNumber()
    id: number;

    @ApiProperty({
        description: 'Cantidad del ingrediente',
        example: 100
    })
    @IsNotEmpty()
    @IsNumber()
    quantity: number;

    @ApiProperty({
        description: 'Unidad de medida',
        example: 'gramos'
    })
    @IsNotEmpty()
    @IsString()
    unit: string;

    @ApiProperty({
        description: 'Calorías del ingrediente para la cantidad especificada',
        example: 350
    })
    @IsNotEmpty()
    @IsNumber()
    kcal: number;
}

export class CreateUserMealDto {
    @ApiProperty({
        description: 'Tipo de comida (desayuno, comida, cena, snack)',
        example: 'Desayuno'
    })
    @IsNotEmpty()
    @IsString()
    mealType: string;

    @ApiProperty({
        description: 'Fecha del registro de comida (formato YYYY-MM-DD)',
        example: '2025-10-20',
        required: false
    })
    @IsOptional()
    @IsString()
    date?: string;

    @ApiProperty({
        description: 'Lista de ingredientes',
        type: [CreateUserMealIngredientDto]
    })
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => CreateUserMealIngredientDto)
    ingredients: CreateUserMealIngredientDto[];

    @ApiProperty({
        description: 'Número de porciones de frutas/verduras/legumbres/frutos secos',
        example: 2.5,
        required: false
    })
    @IsOptional()
    @IsNumber()
    fruitsCount?: number;
}

