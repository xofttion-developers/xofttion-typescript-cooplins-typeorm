import {
  EntityDatabase,
  EntityManager,
  UnitOfWork
} from '@xofttion/clean-architecture';

export class TypeormUnitOfWork implements UnitOfWork {
  constructor(
    private _entityDatabase: EntityDatabase,
    private _entityManager: EntityManager
  ) {}

  public async flush(): Promise<void> {
    try {
      await this._entityDatabase.connect();
      await this._entityDatabase.transaction();

      await this._entityManager.flush();

      await this._entityDatabase.commit();
    } catch (ex) {
      await this._entityDatabase.rollback();

      throw ex;
    } finally {
      await this._entityDatabase.disconnect();
    }
  }
}
