import { EntityDataSource, ModelORM } from '@xofttion/clean-architecture';
import { Injectable } from '@xofttion/dependency-injection';
import { QueryRunner } from 'typeorm';
import { CoopplinsTypeormSql } from './sql-manager';

type CallRunner = (runner: QueryRunner) => Promise<void>;

@Injectable()
export class TypeormEntityDataSource implements EntityDataSource {
  public async insert(model: ModelORM): Promise<void> {
    await this._execute(async (runner) => {
      await runner.manager.save(model);
    });
  }

  public async update(model: ModelORM): Promise<void> {
    await this._execute(async (runner) => {
      await runner.manager.save(model);
    });
  }

  public async delete(model: ModelORM): Promise<void> {
    await this._execute(async (runner) => {
      await runner.manager.remove(model);
    });
  }

  private async _execute(call: CallRunner): Promise<void> {
    const runner = CoopplinsTypeormSql.getRunner();

    if (runner && !runner.isReleased) {
      await call(runner);
    }
  }
}
