import {
  EntityDataSource,
  ModelDirty,
  ModelHidden,
  Model
} from '@xofttion/clean-architecture';
import { EntityManager, QueryRunner } from 'typeorm';

type ManagerCallback = (_: EntityManager) => Promise<void>;

export class TypeormEntityDataSource implements EntityDataSource {
  private runner?: QueryRunner;

  public setRunner(runner: QueryRunner): void {
    this.runner = runner;
  }

  public insert(model: Model): Promise<void> {
    return this.managerCallback((manager) =>
      manager.save(model).then(() => Promise.resolve())
    );
  }

  public update(model: Model, dirty: ModelDirty): Promise<void> {
    return this.managerCallback((manager) =>
      manager
        .update(model.constructor, { id: model.id }, dirty)
        .then(() => Promise.resolve())
    );
  }

  public delete(model: Model): Promise<void> {
    return this.managerCallback((manager) =>
      manager.remove(model).then(() => Promise.resolve())
    );
  }

  public hidden(model: ModelHidden): Promise<any> {
    return this.managerCallback((manager) => {
      model.hiddenAt = new Date();
      model.hidden = true;

      return manager
        .update(model.constructor, { id: model.id }, model)
        .then(() => Promise.resolve());
    });
  }

  private managerCallback(callback: ManagerCallback): Promise<void> {
    return this.runner ? callback(this.runner.manager) : Promise.resolve();
  }
}
