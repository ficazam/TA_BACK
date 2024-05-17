import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class createSchoolDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  image?: string;
}
