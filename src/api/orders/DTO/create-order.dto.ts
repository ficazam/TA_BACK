import {
  IsArray,
  IsBoolean,
  IsDate,
  IsEnum,
  IsNotEmpty,
  IsString,
} from 'class-validator';
import { OrderStatus } from 'src/core/enums/order-status.enum';

export class createOrderDto {
  @IsDate()
  @IsNotEmpty()
  deliveryDate: Date;

  @IsEnum(OrderStatus)
  @IsNotEmpty()
  status: OrderStatus;

  @IsString()
  @IsNotEmpty()
  schoolId: string;

  @IsString()
  @IsNotEmpty()
  teacherId: string;

  @IsBoolean()
  @IsNotEmpty()
  requiresApproval: boolean;

  @IsArray()
  items: { itemId: string; amount: number }[];
}
