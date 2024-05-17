import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { createOrderDto } from './DTO/create-order.dto';
import { Order } from 'src/core/types/order.type';

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

  @Post()
  public async createNewOrder(@Body() newOrder: createOrderDto) {
    return this.ordersService.createNewOrder(newOrder);
  }

  @Patch()
  public async updateOrder(@Body() orderInfo: Order) {
    return this.ordersService.updateOrder(orderInfo);
  }
}
