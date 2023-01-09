import { EntityDatabase } from '@xofttion/clean-architecture';
import { Injectable } from '@xofttion/dependency-injection';
import { QueryRunner } from 'typeorm';
import { CoopplinsTypeormSql } from './sql-manager';

type CallRunner = (runner: QueryRunner) => Promise<void>;

@Injectable()
export class TypeormEntityDatabase implements EntityDatabase {
  public async connect(): Promise<void> {
    const dataSource = CoopplinsTypeormSql.getDataSource();

    if (dataSource) {
      const runner = CoopplinsTypeormSql.getRunner();

      if (runner) {
        await runner.connect();
      }
    }
  }

  public async disconnect(_: boolean): Promise<void> {
    await CoopplinsTypeormSql.disconnectRunner();
  }

  public async transaction(): Promise<void> {
    await this._execute(async (runner) => {
      await runner.startTransaction();
    });
  }

  public async commit(): Promise<void> {
    await this._execute(async (runner) => {
      await runner.commitTransaction();
    });
  }

  public async rollback(): Promise<void> {
    await this._execute(async (runner) => {
      await runner.rollbackTransaction();
    });
  }

  private async _execute(call: CallRunner): Promise<void> {
    const runner = CoopplinsTypeormSql.getRunner();

    if (runner) {
      await call(runner);
    }
  }
}
