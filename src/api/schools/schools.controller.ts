import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { SchoolsService } from './schools.service';
import { createUserDto } from '../users/DTO';
import { createSchoolDto } from './DTO/create-school.dto';

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

  @Post()
  public async createNewSchool(
    @Body()
    {
      newUser,
      newSchool,
    }: {
      newUser: createUserDto;
      newSchool: createSchoolDto;
    },
  ) {
    return this.schoolsService.createNewSchool(newUser, newSchool);
  }
}
