import { UnitOfWork } from '@xofttion/clean-architecture';
import { promisesZip } from '@xofttion/utils';
import { TypeormEntityDatabase } from './entity-database';
import { TypeormEntityManager } from './entity-manager';
import { typeormSql } from './sql-manager';

export class TypeormUnitOfWork implements UnitOfWork {
  constructor(
    private database: TypeormEntityDatabase,
    public readonly manager: TypeormEntityManager
  ) {}

  public async flush(): Promise<void> {
    const runner = typeormSql.createRunner();

    if (!runner) {
      return Promise.resolve();
    }

    this.database.setRunner(runner);
    this.manager.setRunner(runner);

    return promisesZip([
      () => this.database.connect(),
      () => this.database.transaction(),
      () => this.manager.flush(),
      () => this.database.commit()
    ])
      .then(() => Promise.resolve())
      .catch((ex) => {
        return this.database.rollback().finally(() => {
          throw ex;
        });
      })
      .finally(() => {
        this.database.disconnect();
      });
  }

  public async flushAsync(): Promise<void> {
    try {
      const runner = typeormSql.createRunner();

      if (runner) {
        this.database.setRunner(runner);
        this.manager.setRunner(runner);

        await this.database.connect();
        await this.database.transaction();
        await this.manager.flushAsync();
        await this.database.commit();
      }
    } catch (ex) {
      await this.database.rollback();

      throw ex;
    } finally {
      await this.database.disconnect();
    }
  }
}
