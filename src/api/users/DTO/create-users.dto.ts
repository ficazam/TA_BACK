import {
  IsArray,
  IsDefined,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsStrongPassword,
} from 'class-validator';
import { UserRole } from 'src/core/enums/user-role.enum';
import { UserStatus } from 'src/core/enums/user-status.enum';

export class createUserDto {
  @IsDefined()
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsDefined()
  @IsNotEmpty()
  @IsString()
  surname: string;

  @IsDefined()
  @IsNotEmpty()
  @IsString()
  email: string;

  @IsDefined()
  @IsNotEmpty()
  @IsStrongPassword()
  password: string;

  @IsOptional()
  @IsString()
  image: string;

  @IsOptional()
  @IsString()
  schoolId: string;

  @IsDefined()
  @IsNotEmpty()
  @IsEnum(UserRole)
  role: UserRole;

  @IsDefined()
  @IsNotEmpty()
  @IsEnum(UserStatus)
  status: UserStatus;

  @IsOptional()
  @IsArray()
  orders: string[];
}
