import {
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { UserRole } from 'src/core/enums/user-role.enum';
import { UserStatus } from 'src/core/enums/user-status.enum';
import { Order } from 'src/core/types/order.type';

export class createUserDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  surname: string;

  @IsNotEmpty()
  @IsString()
  email: string;

  @IsOptional()
  @IsString()
  image: string;

  @IsOptional()
  @IsString()
  schoolId: string;

  @IsNotEmpty()
  @IsEnum(UserRole)
  role: UserRole;

  @IsNotEmpty()
  @IsEnum(UserStatus)
  status: UserStatus;

  @IsOptional()
  @IsArray()
  orders: Order[];
}
