import { Module } from '@nestjs/common';
import { SchoolsController } from './schools.controller';
import { SchoolsService } from './schools.service';
import { FirebaseService } from 'src/firebase/firebase.service';
import { UsersService } from '../users/users.service';

@Module({
  controllers: [SchoolsController],
  providers: [SchoolsService, UsersService, FirebaseService],
})
export class SchoolsModule {}
