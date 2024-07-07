import { IsOptional, IsInt, Min, IsIn, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class QueryOptionsDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit?: number = 10;

  @IsString()
  @IsOptional()
  orderField?: string;

  @IsIn(['ASC', 'DESC'])
  @IsOptional()
  orderDirection?: 'ASC' | 'DESC';
}
