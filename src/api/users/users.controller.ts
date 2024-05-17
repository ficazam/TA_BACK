import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { UsersService } from './users.service';
import { getAllUsersDto } from './DTO';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  public getUsers(@Body() { schoolId, userRole }: getAllUsersDto) {
    return this.usersService.getAllSchoolUsers(schoolId, userRole);
  }

  @Get(':userId')
  public getSingleUser(@Param('userId') id: string) {
    return this.usersService.getSingleUser(id);
  }
}
