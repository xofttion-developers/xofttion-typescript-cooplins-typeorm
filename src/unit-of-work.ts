import { UnitOfWork } from '@xofttion/clean-architecture';
import { TypeormEntityDatabase } from './entity-database';
import { TypeormEntityManager } from './entity-manager';
import { CoopplinsTypeormSql } from './sql-manager';

export class TypeormUnitOfWork implements UnitOfWork {
  constructor(
    private _database: TypeormEntityDatabase,
    private _manager: TypeormEntityManager
  ) {}

  public async flush(): Promise<void> {
    const runner = CoopplinsTypeormSql.createRunner();

    if (runner) {
      try {
        this._database.setRunner(runner);
        this._manager.setRunner(runner);

        await this._database.connect();

        await this._database.transaction();

        await this._manager.flush();

        await this._database.commit();
      } catch (ex) {
        await this._database.rollback();

        throw ex;
      } finally {
        await this._database.disconnect();
      }
    }
  }
}
