import { EntityManager } from '@xofttion/clean-architecture';
import { QueryRunner } from 'typeorm';
import { TypeormEntityDataSource } from './entity-datasource';

export class TypeormEntityManager extends EntityManager {
  constructor(private _typeormEntityDataSource: TypeormEntityDataSource) {
    super(_typeormEntityDataSource);
  }

  public setRunner(runner: QueryRunner): void {
    this._typeormEntityDataSource.setRunner(runner);
  }
}
