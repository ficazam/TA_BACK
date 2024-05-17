import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { FirebaseService } from 'src/firebase/firebase.service';
import { SchoolsService } from '../schools/schools.service';

@Module({
  imports: [],
  controllers: [UsersController],
  providers: [UsersService, SchoolsService, FirebaseService],
})
export class UsersModule {}
