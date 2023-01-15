import { UnitOfWork } from '@xofttion/clean-architecture';
import { TypeormEntityDatabase } from './entity-database';
import { TypeormEntityManager } from './entity-manager';
import { CoopplinsTypeormSql } from './sql-manager';

export class TypeormUnitOfWork implements UnitOfWork {
  constructor(
    private _database: TypeormEntityDatabase,
    public readonly manager: TypeormEntityManager
  ) {}

  public async flush(): Promise<void> {
    try {
      const runner = CoopplinsTypeormSql.createRunner();

      if (runner) {
        this._database.setRunner(runner);
        this.manager.setRunner(runner);

        await this._database.connect();

        await this._database.transaction();

        await this.manager.flush();

        await this._database.commit();
      }
    } catch (ex) {
      await this._database.rollback();

      throw ex;
    } finally {
      await this._database.disconnect();
    }
  }
}
