import { IsOptional, IsString } from 'class-validator';

export class SearchUserDto {
  @IsOptional()
  @IsString()
  searchString?: string;

  @IsOptional()
  @IsString()
  plan?: string;
}
