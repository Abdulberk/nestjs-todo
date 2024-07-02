import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
  Inject,
} from '@nestjs/common';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { TodoRepositoryInterface } from './interfaces/todo.repository.interface';

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

  async findAllByUser(userId: string) {
    try {
      return await this.todoRepository.findWithRelations({
        where: { user: { id: userId } as any },
        relations: ['user'],
        select: {
          id: true,
          title: true,
          description: true,
          status: true,
          user: {
            id: true,
            name: true,
            email: true,
          },
        },
      });
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
