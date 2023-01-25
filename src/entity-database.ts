import { EntityDatabase } from '@xofttion/clean-architecture';
import { QueryRunner } from 'typeorm';

export class TypeormEntityDatabase implements EntityDatabase {
  private runner?: QueryRunner;

  public setRunner(runner: QueryRunner): void {
    this.runner = runner;
  }

  public async connect(): Promise<void> {
    await this.runner?.connect();
  }

  public async disconnect(_?: boolean): Promise<void> {
    await this.runner?.release();
  }

  public async transaction(): Promise<void> {
    await this.runner?.startTransaction();
  }

  public async commit(): Promise<void> {
    await this.runner?.commitTransaction();
  }

  public async rollback(): Promise<void> {
    await this.runner?.rollbackTransaction();
  }
}
