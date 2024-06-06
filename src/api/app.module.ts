import { MiddlewareConsumer, Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { SchoolsModule } from './schools/schools.module';
import { ConfigModule } from '@nestjs/config';
import { OrdersModule } from './orders/orders.module';
import { ItemsModule } from './items/items.module';
import { LoggerMiddleware } from './logger.middleware';

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
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
