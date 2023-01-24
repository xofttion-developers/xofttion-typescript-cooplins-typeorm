import { EntityDatabase } from '@xofttion/clean-architecture';
import { QueryRunner } from 'typeorm';

export class TypeormEntityDatabase implements EntityDatabase {
  private runner?: QueryRunner;

  public setRunner(runner: QueryRunner): void {
    this.runner = runner;
  }

  public async connect(): Promise<void> {
    this.runner?.connect();
  }

  public async disconnect(_?: boolean): Promise<void> {
    this.runner?.release();
  }

  public async transaction(): Promise<void> {
    this.runner?.startTransaction();
  }

  public async commit(): Promise<void> {
    this.runner?.commitTransaction();
  }

  public async rollback(): Promise<void> {
    this.runner?.rollbackTransaction();
  }
}
