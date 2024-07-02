import {
  IsNotEmpty,
  IsEnum,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';
import { Status } from '../entities/todo.entity';

export class CreateTodoDto {
  @IsNotEmpty({ message: 'Title is required' })
  @IsString({ message: 'Title must be a string' })
  @MinLength(3, { message: 'Title must be at least 3 characters long' })
  title: string;

  @IsOptional()
  description?: string;

  @IsOptional()
  @IsEnum(Status)
  status?: Status;
}
