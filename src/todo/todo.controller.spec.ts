import { Test, TestingModule } from '@nestjs/testing';
import { TodoController } from './todo.controller';
import { TodoService } from './todo.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RoleGuard } from '../auth/guards/role.guard';
import { TodoOwnershipGuard } from './guards/todo-ownership.guard';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { Status } from './entities/todo.entity';
import { Role } from '../auth/guards/role.guard';

describe('TodoController', () => {
  let controller: TodoController;
  let service: TodoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TodoController],
      providers: [
        {
          provide: TodoService,
          useValue: {
            create: jest.fn(),
            findAllByUser: jest.fn(),
            findOne: jest.fn(),
            update: jest.fn(),
            remove: jest.fn(),
          },
        },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: () => true })
      .overrideGuard(RoleGuard)
      .useValue({ canActivate: () => true })
      .overrideGuard(TodoOwnershipGuard)
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get<TodoController>(TodoController);
    service = module.get<TodoService>(TodoService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a todo', async () => {
      const createTodoDto: CreateTodoDto = {
        title: 'Test',
        description: 'Test',
      };
      const req = { user: { sub: '1' } };
      const result = {
        id: 1,
        title: 'Test',
        description: 'Test',
        status: Status.PENDING,
        user: {
          id: '1',
          email: 'test@test.com',
          password: 'password',
          name: 'Test User',
          role: Role.USER,
          todos: [],
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      jest.spyOn(service, 'create').mockResolvedValue(result);

      expect(await controller.create(createTodoDto, req)).toEqual(result);
    });
  });

  describe('findAll', () => {
    it('should return all todos for a user', async () => {
      const req = { user: { sub: '1' } };
      const result = [
        {
          id: 1,
          title: 'Test',
          description: 'Test',
          status: Status.PENDING,
          user: {
            id: '1',
            email: 'test@test.com',
            password: 'password',
            name: 'Test User',
            role: Role.USER,
            todos: [],
            createdAt: new Date(),
            updatedAt: new Date(),
          },
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];
      jest.spyOn(service, 'findAllByUser').mockResolvedValue(result);

      expect(await controller.findAll(req)).toEqual(result);
    });
  });

  describe('findOne', () => {
    it('should return a single todo', async () => {
      const result = {
        id: 1,
        title: 'Test',
        description: 'Test',
        status: Status.PENDING,
        user: {
          id: '1',
          email: 'test@test.com',
          password: 'password',
          name: 'Test User',
          role: Role.USER,
          todos: [],
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      jest.spyOn(service, 'findOne').mockResolvedValue(result);

      expect(await controller.findOne('1')).toEqual(result);
    });
  });

  describe('update', () => {
    it('should update a todo', async () => {
      const updateTodoDto: UpdateTodoDto = {
        title: 'Updated',
        description: 'Updated',
      };
      const req = { user: { sub: '1' } };
      const result = {
        id: 1,
        title: 'Updated',
        description: 'Updated',
        status: Status.PENDING,
        user: {
          id: '1',
          email: 'test@test.com',
          password: 'password',
          name: 'Test User',
          role: Role.USER,
          todos: [],
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      jest.spyOn(service, 'update').mockResolvedValue(result);

      expect(await controller.update('1', updateTodoDto, req)).toEqual(result);
    });
  });

  describe('remove', () => {
    it('should delete a todo', async () => {
      const req = { user: { sub: '1' } };
      const result = { message: 'Todo deleted', deletedCount: 1 };
      jest.spyOn(service, 'remove').mockResolvedValue(result);

      expect(await controller.remove('1', req)).toEqual(result);
    });
  });
});
