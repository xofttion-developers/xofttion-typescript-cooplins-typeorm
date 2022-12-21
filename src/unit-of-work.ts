import {
  EntityDatabase,
  EntityManager,
  UnitOfWork
} from '@xofttion/clean-architecture';

export class TypeormUnitOfWork implements UnitOfWork {
  constructor(
    private entityDatabase: EntityDatabase,
    private entityManager: EntityManager
  ) {}

  public async flush(): Promise<void> {
    try {
      await this.entityDatabase.connect();
      await this.entityDatabase.transaction();

      await this.entityManager.flush();
      
      await this.entityDatabase.commit();
    } catch {
      await this.entityDatabase.rollback();
    } finally {
      await this.entityDatabase.disconnect();
    }
  }
}
