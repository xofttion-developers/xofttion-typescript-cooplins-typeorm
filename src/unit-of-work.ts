import { UnitOfWork } from '@xofttion/clean-architecture';
import { TypeormEntityDatabase } from './entity-database';
import { TypeormEntityManager } from './entity-manager';
import { typeormSql } from './sql-manager';

export class TypeormUnitOfWork implements UnitOfWork {
  constructor(
    private database: TypeormEntityDatabase,
    public readonly manager: TypeormEntityManager
  ) {}

  public async flush(): Promise<void> {
    try {
      const runner = typeormSql.createRunner();

      if (runner) {
        this.database.setRunner(runner);
        this.manager.setRunner(runner);

        await this.database.connect();
        await this.database.transaction();
        await this.manager.flush();
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
