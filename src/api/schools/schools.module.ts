import { Module } from '@nestjs/common';
import { SchoolsController } from './schools.controller';
import { SchoolsService } from './schools.service';
import { FirebaseService } from 'src/firebase/firebase.service';

@Module({
  controllers: [SchoolsController],
  providers: [SchoolsService, FirebaseService],
})
export class SchoolsModule {}
