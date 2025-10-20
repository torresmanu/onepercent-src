import {IsNotEmpty, IsString} from 'class-validator';
import {ApiProperty} from "@nestjs/swagger";

export class CreateUserHydrationDto {
    @ApiProperty({
        description: 'Color of the urine (pee color)',
        example: '#E3EDFA'
    })
    @IsNotEmpty()
    @IsString()
    peeColor: string;
}

