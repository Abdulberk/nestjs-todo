import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  Req,
  Patch,
} from '@nestjs/common';
import { TodoService } from './todo.service';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RoleGuard } from 'src/auth/guards/role.guard';
import { Role } from 'src/auth/guards/role.guard';
import { Roles } from 'src/auth/decorators/role.decorator';
import { TodoOwnershipGuard } from './guards/todo-ownership.guard';

@Controller('todos')
export class TodoController {
  constructor(private readonly todoService: TodoService) {}

  @Post('/create')
  @Roles(Role.USER)
  @UseGuards(JwtAuthGuard, RoleGuard)
  async create(@Body() createTodoDto: CreateTodoDto, @Req() req: any) {
    const userId = req.user.sub;
    return await this.todoService.create(createTodoDto, userId);
  }

  @Get('/all')
  @Roles(Role.USER)
  @UseGuards(JwtAuthGuard, RoleGuard)
  async findAll(@Req() req: any) {
    const userId = req.user.sub;
    return await this.todoService.findAllByUser(userId);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard, RoleGuard, TodoOwnershipGuard)
  @Roles(Role.USER)
  async findOne(@Param('id') id: string) {
    return await this.todoService.findOne(id);
  }

  @Patch(':id')
  @Roles(Role.USER)
  @UseGuards(JwtAuthGuard, RoleGuard, TodoOwnershipGuard)
  async update(
    @Param('id') id: string,
    @Body() updateTodoDto: UpdateTodoDto,
    @Req() req: any,
  ) {
    const userId = req.user.sub;
    return await this.todoService.update(id, updateTodoDto, userId);
  }

  @Delete(':id')
  @Roles(Role.USER)
  @UseGuards(JwtAuthGuard, RoleGuard, TodoOwnershipGuard)
  async remove(@Param('id') id: string, @Req() req: any) {
    const userId = req.user.sub;
    return await this.todoService.remove(id, userId);
  }
}
