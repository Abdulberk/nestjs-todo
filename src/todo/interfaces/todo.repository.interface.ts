import { BaseInterfaceRepository } from '@app/common/database/database.interface';
import { Todo } from '../entities/todo.entity';

export interface TodoRepositoryInterface
  extends BaseInterfaceRepository<Todo> {}
