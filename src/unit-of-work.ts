import { UnitOfWork } from '@xofttion/clean-architecture';
import { zip, firstValueFrom } from 'rxjs';
import { TypeormEntityDatabase } from './entity-database';
import { TypeormEntityManager } from './entity-manager';
import { CoopplinsTypeormSql } from './sql-manager';

export class TypeormUnitOfWork implements UnitOfWork {
  constructor(
    private database: TypeormEntityDatabase,
    public readonly manager: TypeormEntityManager
  ) {}

  public async flush(): Promise<void> {
    try {
      const runner = CoopplinsTypeormSql.createRunner();

      if (runner) {
        this.database.setRunner(runner);
        this.manager.setRunner(runner);

        firstValueFrom(
          zip(
            this.database.connect(),
            this.database.transaction(),
            this.manager.flush(),
            this.database.commit()
          )
        );
      }
    } catch (ex) {
      this.database.rollback().then(() => {
        throw ex;
      });
    } finally {
      this.database.disconnect();
    }
  }
}
