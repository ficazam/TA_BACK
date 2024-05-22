import { Body, Controller, Get, Param, Post, Patch } from '@nestjs/common';
import { UsersService } from './users.service';
import { UserRole } from 'src/core/enums/user-role.enum';
import { createUserDto } from './DTO';
import { User } from 'src/core/types/user.type';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('school/:schoolId/:userRole')
  public getUsers(
    @Param('schoolId') schoolId: string,
    @Param('userRole') userRole: UserRole,
  ) {
    return this.usersService.getAllSchoolUsers(schoolId, userRole);
  }

  @Get('user/:userId')
  public getSingleUser(@Param('userId') id: string) {
    return this.usersService.getSingleUser(id);
  }

  @Post()
  public addNewUser(@Body() newUser: createUserDto) {
    return this.usersService.createNewUser(newUser);
  }

  @Patch()
  public updateUser(@Body() userInfo: Partial<User>) {
    return this.usersService.updateUser(userInfo);
  }

  @Post('login')
  public loginUser(@Body() { userId }: { userId: string }) {
    return this.usersService.userLogin(userId);
  }

  @Post('logout')
  public logoutUser(@Body() user: User) {
    return this.usersService.userLogout(user);
  }
}
