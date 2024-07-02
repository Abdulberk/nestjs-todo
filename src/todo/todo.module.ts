import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Todo } from './entities/todo.entity';
import { TodoService } from './todo.service';
import { TodoController } from './todo.controller';
import { TodoRepository } from './todo.repository';
import { JwtService } from '@nestjs/jwt';
import { AccessModule } from '@app/common/access-control/access-control.module';
@Module({
  imports: [AccessModule, TypeOrmModule.forFeature([Todo])],
  providers: [
    {
      provide: 'TodoRepositoryInterface',
      useClass: TodoRepository,
    },
    TodoService,
    JwtService,
  ],
  controllers: [TodoController],
})
export class TodoModule {}
