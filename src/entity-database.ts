import { EntityDatabase } from '@xofttion/clean-architecture';
import { QueryRunner } from 'typeorm';

export class TypeormEntityDatabase implements EntityDatabase {
  private runner?: QueryRunner;

  public setRunner(runner: QueryRunner): void {
    this.runner = runner;
  }

  public connect(): Promise<void> {
    return this.runner ? this.runner.connect() : Promise.resolve();
  }

  public disconnect(_?: boolean): Promise<void> {
    return this.runner ? this.runner.release() : Promise.resolve();
  }

  public transaction(): Promise<void> {
    return this.runner ? this.runner.startTransaction() : Promise.resolve();
  }

  public commit(): Promise<void> {
    return this.runner ? this.runner.commitTransaction() : Promise.resolve();
  }

  public rollback(): Promise<void> {
    return this.runner ? this.runner.rollbackTransaction() : Promise.resolve();
  }
}
