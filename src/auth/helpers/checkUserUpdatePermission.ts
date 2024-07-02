import { Role } from '../guards/role.guard';
import { User } from 'src/user/entities/user.entity';

export const checkUserUpdatePermission = (
  userToUpdate: User,
  authenticatedUser: any,
): boolean => {
  if (authenticatedUser.role === Role.ADMIN) {
    return true;
  }

  if (authenticatedUser?.sub === userToUpdate.id) {
    return true;
  }

  return false;
};
