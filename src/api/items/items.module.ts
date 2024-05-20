import { Module } from '@nestjs/common';
import { ItemsController } from './items.controller';
import { ItemsService } from './items.service';
import { FirebaseService } from 'src/firebase/firebase.service';
import { SchoolsService } from '../schools/schools.service';
import { UsersService } from '../users/users.service';

@Module({
  controllers: [ItemsController],
  providers: [ItemsService, FirebaseService, SchoolsService, UsersService],
})
export class ItemsModule {}
