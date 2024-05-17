import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { SchoolsModule } from './schools/schools.module';
import { ConfigModule } from '@nestjs/config';
import { OrdersModule } from './orders/orders.module';
import { ItemsModule } from './items/items.module';

@Module({
  imports: [
    UsersModule,
    SchoolsModule,
    OrdersModule,
    ItemsModule,
    ConfigModule.forRoot(),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
