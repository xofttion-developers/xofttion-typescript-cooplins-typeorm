import { EntityDatabase } from '@xofttion/clean-architecture';
import { QueryRunner } from 'typeorm';

export class TypeormEntityDatabase implements EntityDatabase {
  private _runner?: QueryRunner;

  public setRunner(runner: QueryRunner): void {
    this._runner = runner;
  }

  public async connect(): Promise<void> {
    await this._runner?.connect();
  }

  public async disconnect(_?: boolean): Promise<void> {
    await this._runner?.release();
  }

  public async transaction(): Promise<void> {
    await this._runner?.startTransaction();
  }

  public async commit(): Promise<void> {
    await this._runner?.commitTransaction();
  }

  public async rollback(): Promise<void> {
    await this._runner?.rollbackTransaction();
  }
}
