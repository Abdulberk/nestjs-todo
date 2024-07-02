import { BaseInterfaceRepository } from '@app/common/database/database.interface';
import { User } from '../entities/user.entity';

export interface UserRepositoryInterface
  extends BaseInterfaceRepository<User> {}
