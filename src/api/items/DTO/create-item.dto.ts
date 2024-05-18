import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class createItemDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  type: string;

  @IsNotEmpty()
  @IsString()
  schoolId: string;

  @IsOptional()
  @IsString()
  image: string;

  @IsNotEmpty()
  @IsNumber()
  inStock: number;

  @IsNotEmpty()
  @IsNumber()
  ordered: number;

  @IsNotEmpty()
  @IsBoolean()
  isTemporal: boolean;
}
