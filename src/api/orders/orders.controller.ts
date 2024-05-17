import { Controller, Get, Param } from '@nestjs/common';
import { OrdersService } from './orders.service';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Get(':schoolId')
  public async getAllSchoolOrders(@Param('schoolId') schoolId: string) {
    return this.ordersService.getAllOrders(schoolId);
  }

  @Get(':schoolId/teacher/:teacherId')
  public async getAllTeacherOrders(
    @Param('schoolId') schoolId: string,
    @Param('teacherId') teacherId: string,
  ) {
    return this.ordersService.getAllTeacherOrders(schoolId, teacherId);
  }

  @Get(':schoolId/order/:orderId')
  public async getSingleOrder(
    @Param('schoolId') schoolId: string,
    @Param('orderId') orderId: string,
  ) {
    return this.ordersService.getSingleOrder(schoolId, orderId);
  }
}
