import { Module } from '@nestjs/common';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';
import { FirebaseService } from 'src/firebase/firebase.service';
import { SchoolsService } from '../schools/schools.service';
import { UsersService } from '../users/users.service';
import { ItemsService } from '../items/items.service';
import { NotificationService } from './notifications/notifications.service';

@Module({
  controllers: [OrdersController],
  providers: [
    OrdersService,
    FirebaseService,
    SchoolsService,
    UsersService,
    ItemsService,
    NotificationService,
  ],
})
export class OrdersModule {}
