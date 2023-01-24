import { EntityManager } from '@xofttion/clean-architecture';
import { QueryRunner } from 'typeorm';
import { TypeormEntityDataSource } from './entity-datasource';

export class TypeormEntityManager extends EntityManager {
  constructor(private typeormDataSource: TypeormEntityDataSource) {
    super(typeormDataSource);
  }

  public setRunner(runner: QueryRunner): void {
    this.typeormDataSource.setRunner(runner);
  }
}
