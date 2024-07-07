import {
  Repository,
  DeepPartial,
  FindManyOptions,
  FindOneOptions,
  FindOptionsWhere,
  UpdateResult,
  FindOneAndDeleteOptions,
  DataSource,
  DeleteResult,
  FindOptionsOrder,
} from 'typeorm';
import { BaseInterfaceRepository, Order } from './database.interface';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';

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

  public async findWithRelationsAndCount(
    whereCondition: FindOptionsWhere<T>,
    relations: string[],
    selectFields: string[],
    take: number,
    skip: number,
    orderField: keyof T,
    orderDirection: 'ASC' | 'DESC',
  ): Promise<[T[], number]> {
    const queryBuilder = this.repository.createQueryBuilder('entity');

    if (whereCondition) {
      queryBuilder.where(whereCondition);
    }

    relations.forEach((relation) => {
      queryBuilder.leftJoinAndSelect(`entity.${relation}`, relation);
    });

    if (selectFields.length > 0) {
      const formattedFields = selectFields.map((field) =>
        field.includes('.') ? field : `entity.${field}`,
      );
      queryBuilder.select(formattedFields);
    }

    if (take) {
      queryBuilder.take(take);
    }

    if (skip) {
      queryBuilder.skip(skip);
    }

    

    if (orderField) {
      queryBuilder.orderBy(`entity.${String(orderField)}`, orderDirection);
    }

    const [entities, count] = await queryBuilder.getManyAndCount();
    return [entities, count];
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

  public async update(
    id: string | number,
    userId: string | number,
    updateData: QueryDeepPartialEntity<T>,
  ): Promise<{ updatedEntity: T; affected: number }> {
    const result = await this.repository
      .createQueryBuilder()
      .update(this.repository.target)
      .set(updateData)
      .where('id = :id AND userId = :userId', { id, userId })
      .returning('*')
      .execute();

    return {
      updatedEntity: result.raw[0],
      affected: result.affected,
    };
  }

  public async findOneAndDelete(
    id: string | number,
    userId: string | number,
  ): Promise<DeleteResult> {
    const entity = await this.repository
      .createQueryBuilder()
      .delete()
      .from(this.repository.target)
      .where('id = :id AND userId = :userId', { id, userId })
      .execute();

    return entity;
  }
}
