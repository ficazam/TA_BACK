import { Controller, Get, Param } from '@nestjs/common';
import { UsersService } from './users.service';
import { UserRole } from 'src/core/enums/user-role.enum';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get(':schoolId/:userRole')
  public getUsers(
    @Param('schoolId') schoolId: string,
    @Param('userRole') userRole: UserRole,
  ) {
    return this.usersService.getAllSchoolUsers(schoolId, userRole);
  }

  @Get(':userId')
  public getSingleUser(@Param('userId') id: string) {
    return this.usersService.getSingleUser(id);
  }
}
