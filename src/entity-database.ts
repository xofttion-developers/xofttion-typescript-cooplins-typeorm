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

      if (!dataSource.isInitialized) {
        await dataSource.initialize();
      }

      if (runner) {
        await runner.connect();
      }
    }
  }

  public async disconnect(full?: boolean): Promise<void> {
    const dataSource = CoopplinsTypeormSql.getDataSource();
    const runner = CoopplinsTypeormSql.getRunner();

    if (!runner?.isReleased) {
      await runner?.release();
    }

    if (full && dataSource?.isInitialized) {
      await dataSource?.destroy();
    }
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

    if (runner && !runner.isReleased) {
      await call(runner);
    }
  }
}
