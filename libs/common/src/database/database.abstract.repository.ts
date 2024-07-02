import {
  Repository,
  DeepPartial,
  FindManyOptions,
  FindOneOptions,
  FindOptionsWhere,
} from 'typeorm';
import { BaseInterfaceRepository } from './database.interface';

export interface HasId {
  id: string | number;
}

export abstract class BaseAbstractRepository<T extends HasId>
  implements BaseInterfaceRepository<T>
{
  protected repository: Repository<T>; 

  constructor(repository: Repository<T>) {
    this.repository = repository;
  }

  public async save(data: DeepPartial<T>): Promise<T> {
    return await this.repository.save(data);
  }

  public async saveMany(data: DeepPartial<T>[]): Promise<T[]> {
    return this.repository.save(data);
  }

  public create(data: DeepPartial<T>): T {
    return this.repository.create(data);
  }

  public createMany(data: DeepPartial<T>[]): T[] {
    return this.repository.create(data);
  }

  public async findOneById(id: string): Promise<T> {
    const options: FindOptionsWhere<T> = { id } as FindOptionsWhere<T>;
    return await this.repository.findOneBy(options);
  }

  public async findByCondition(filterCondition: FindOneOptions<T>): Promise<T> {
    return await this.repository.findOne(filterCondition);
  }

  public async findWithRelations(relations: FindManyOptions<T>): Promise<T[]> {
    return await this.repository.find(relations);
  }

  public async findAll(options?: FindManyOptions<T>): Promise<T[]> {
    return await this.repository.find(options);
  }

  public async remover(data: T): Promise<T> {
    return await this.repository.remove(data);
  }

  public async preload(entityLike: DeepPartial<T>): Promise<T> {
    return await this.repository.preload(entityLike);
  }

  public async findOne(options: FindOneOptions<T>): Promise<T> {
    return await this.repository.findOne(options);
  }

  public removeMany(data: T[]): Promise<T[]> {
    return this.repository.remove(data);
  }


}
