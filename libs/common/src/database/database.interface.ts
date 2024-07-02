import {
  DeepPartial,
  DeleteResult,
  FindManyOptions,
  FindOneOptions,
  UpdateResult,
} from 'typeorm';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';

export interface BaseInterfaceRepository<T> {
  create(data: DeepPartial<T>): T;
  createMany(data: DeepPartial<T>[]): T[];
  save(data: DeepPartial<T>): Promise<T>;
  saveMany(data: DeepPartial<T>[]): Promise<T[]>;
  findOneById(id: string): Promise<T>;
  findByCondition(filterCondition: FindOneOptions<T>): Promise<T>;
  findAll(options?: FindManyOptions<T>): Promise<T[]>;
  remover(data: T): Promise<T>;
  findOneAndDelete(
    id: string | number,
    userId: string | number,
  ): Promise<DeleteResult>;
  findWithRelations(relations: FindManyOptions<T>): Promise<T[]>;
  preload(entityLike: DeepPartial<T>): Promise<T>;
  findOne(options: FindOneOptions<T>): Promise<T>;
  removeMany(data: T[]): Promise<T[]>;
  update(
    id: string | number,
    userId: string | number,
    updateData: QueryDeepPartialEntity<T>,
  ): Promise<{ updatedEntity: T; affected: number }>;
}
