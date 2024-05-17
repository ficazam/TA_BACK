import { Module } from '@nestjs/common';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';
import { FirebaseService } from 'src/firebase/firebase.service';
import { SchoolsService } from '../schools/schools.service';

@Module({
  controllers: [OrdersController],
  providers: [OrdersService, FirebaseService, SchoolsService],
})
export class OrdersModule {}
