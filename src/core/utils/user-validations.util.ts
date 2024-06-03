import { createUserDto } from 'src/api/users/DTO';
import { UserRole } from '../enums/user-role.enum';

export const userValidations = (user: createUserDto) => {
  if (
    !user.email ||
    !user.password ||
    !user.name ||
    !user.surname ||
    !user.role ||
    !user.status ||
    (user.role !== UserRole.Admin &&
      user.role !== UserRole.Principal &&
      !user.schoolId)
  ) {
    return false;
  }

  return true;
};
