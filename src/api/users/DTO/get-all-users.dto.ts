import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { UserRole } from 'src/core/enums/user-role.enum';

export class getAllUsersDto {
  @IsNotEmpty()
  @IsString()
  schoolId: string;

  @IsNotEmpty()
  @IsEnum(UserRole)
  userRole: UserRole;
}
