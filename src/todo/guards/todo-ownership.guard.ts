import {
  CanActivate,
  ExecutionContext,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { TodoService } from '../todo.service';
import { Role } from 'src/auth/guards/role.guard';
import { User } from 'src/user/entities/user.entity';
import { AuthenticatedRequest } from 'src/auth/interface/request.interface';

@Injectable()
export class TodoOwnershipGuard implements CanActivate {
  constructor(private todoService: TodoService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
    const userId = request.user?.sub;
    const todoId = request.params.id;

    if (!userId || !todoId) {
      throw new UnauthorizedException();
    }

    const todo = await this.todoService.findOne(todoId);

    if (!todo) {
      throw new NotFoundException('Todo not found');
    }

    if (todo.user.id !== userId) {
      throw new UnauthorizedException('You do not own this todo');
    }

    return true;
  }
}
