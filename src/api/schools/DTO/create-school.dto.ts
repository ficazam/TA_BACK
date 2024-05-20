import { IsDefined, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class createSchoolDto {
  @IsDefined()
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  image?: string;
}
