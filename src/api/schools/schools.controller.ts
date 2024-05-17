import { Controller, Get, Param } from '@nestjs/common';
import { SchoolsService } from './schools.service';

@Controller('schools')
export class SchoolsController {
  constructor(private readonly schoolsService: SchoolsService) {}

  @Get()
  public async getAllSchools() {
    return this.schoolsService.getAllSchools();
  }

  @Get(':id')
  public async getSingleSchool(@Param('id') schoolId: string) {
    return this.schoolsService.getSingleSchool(schoolId);
  }
}
