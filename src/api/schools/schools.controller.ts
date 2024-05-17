import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { SchoolsService } from './schools.service';
import { createUserDto } from '../users/DTO';
import { createSchoolDto } from './DTO/create-school.dto';
import { ISchoolInfo } from 'src/core/types/school.type';

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

  @Patch()
  public async updateSchool(@Body() schoolInfo: ISchoolInfo) {
    return this.schoolsService.updateSchool(schoolInfo);
  }
}
