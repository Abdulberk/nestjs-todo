import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Todo } from './entities/todo.entity';
import { BaseAbstractRepository } from '@app/common/database/database.abstract.repository';
import { TodoRepositoryInterface } from './interfaces/todo.repository.interface';

export class TodoRepository
  extends BaseAbstractRepository<Todo>
  implements TodoRepositoryInterface
{
  constructor(
    @InjectRepository(Todo)
    private todoRepository: Repository<Todo>,
  ) {
    super(todoRepository);
  }
}
