import { XofttionEntityManager } from '@xofttion/clean-architecture';
import { QueryRunner } from 'typeorm';
import { TypeormEntityDataSource } from './entity-datasource';

export class TypeormEntityManager extends XofttionEntityManager {
  constructor(private typeormDataSource: TypeormEntityDataSource) {
    super(typeormDataSource);
  }

  public setRunner(runner: QueryRunner): void {
    this.typeormDataSource.setRunner(runner);
  }
}
