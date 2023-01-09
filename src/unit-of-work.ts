import { UnitOfWork } from '@xofttion/clean-architecture';
import { TypeormEntityDatabase } from './entity-database';
import { TypeormEntityDataSource } from './entity-datasource';
import { TypeormEntityManager } from './entity-manager';
import { CoopplinsTypeormSql } from './sql-manager';

export class TypeormUnitOfWork implements UnitOfWork {
  private _database: TypeormEntityDatabase;
  private _manager: TypeormEntityManager;

  constructor() {
    const dataSource = new TypeormEntityDataSource();

    this._database = new TypeormEntityDatabase();
    this._manager = new TypeormEntityManager(dataSource);
  }

  public get manager(): TypeormEntityManager {
    return this._manager;
  }

  public async flush(): Promise<void> {
    try {
      const runner = CoopplinsTypeormSql.createRunner();

      if (runner) {
        this._database.setRunner(runner);
        this._manager.setRunner(runner);

        await this._database.connect();

        await this._database.transaction();

        await this._manager.flush();

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
