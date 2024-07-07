import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
  Inject,
} from '@nestjs/common';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { TodoRepositoryInterface } from './interfaces/todo.repository.interface';
import { QueryOptionsDto } from './dto/query-options.dto';
import { Order } from '@app/common/database/database.interface';
import { Todo } from './entities/todo.entity';

type TodoOrderField = keyof Todo;

@Injectable()
export class TodoService {
  constructor(
    @Inject('TodoRepositoryInterface')
    private readonly todoRepository: TodoRepositoryInterface,
  ) {}

  async create(createTodoDto: CreateTodoDto, userId: string) {
    try {
      const newTodo = this.todoRepository.create({
        ...createTodoDto,
        user: { id: userId },
      });
      return await this.todoRepository.save(newTodo);
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async findAllByUser(userId: string, queryOptions: QueryOptionsDto) {
    const { page, limit, orderDirection, orderField } = queryOptions;
    const offset = (page - 1) * limit;

    try {
      const [todos, total] =
        await this.todoRepository.findWithRelationsAndCount(
          { user: { id: userId } as any },
          ['user'],
          [
            'id',
            'title',
            'description',
            'status',
            'createdAt',
            'updatedAt',
            'user.id',
            'user.email',
          ],
          limit,
          offset,
          (orderField as TodoOrderField) || 'createdAt',
          orderDirection || 'ASC',
        );

      return {
        todos,
        count: todos.length,
        totalPages: Math.ceil(total / limit),
        currentPage: page,
      };
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async findByUser(userId: string) {
    try {
      return await this.todoRepository.findByCondition({
        where: { user: { id: userId } },
      });
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async findOne(id: string) {
    try {
      const todo = await this.todoRepository.findOne({
        where: { id: id } as any,
        relations: ['user'],
      });
      if (!todo) {
        throw new NotFoundException('Todo not found');
      }
      return todo;
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async update(id: string, updateTodoDto: UpdateTodoDto, userId: string) {
    try {
      const { updatedEntity, affected } = await this.todoRepository.update(
        id,
        userId,
        updateTodoDto,
      );

      if (affected === 0) {
        throw new NotFoundException(
          'Todo not found or you do not own this todo',
        );
      }

      return updatedEntity;
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async remove(
    id: string,
    userId: string,
  ): Promise<{ message: string; deletedCount: number }> {
    try {
      const { affected } = await this.todoRepository.findOneAndDelete(
        id,
        userId,
      );

      if (affected === 0) {
        throw new NotFoundException(
          'Todo not found or you do not own this todo',
        );
      }

      return { message: 'Todo deleted', deletedCount: affected };
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }
}
