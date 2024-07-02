import { IsEnum, MinLength, IsString, IsOptional } from 'class-validator';
import { Status } from '../entities/todo.entity';

export class UpdateTodoDto {
  @IsOptional()
  @IsString({ message: 'title must be a string!' })
  @MinLength(3, { message: 'title must be at least 3 characters long!' })
  title?: string;

  @IsOptional()
  @IsString({ message: 'description must be a string!' })
  description?: string;

  @IsOptional()
  @IsEnum(Status, { message: 'status must be a valid enum value!' })
  status?: Status;
}
