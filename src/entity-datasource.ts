import {
  EntityDataSource,
  ModelDirty,
  ModelHidden,
  Model
} from '@xofttion/clean-architecture';
import { QueryRunner } from 'typeorm';

export class TypeormEntityDataSource implements EntityDataSource {
  private runner?: QueryRunner;

  public setRunner(runner: QueryRunner): void {
    this.runner = runner;
  }

  public insert(model: Model): Promise<any> {
    return this.runner ? this.runner.manager.save(model) : Promise.resolve();
  }

  public update(model: Model, dirty: ModelDirty): Promise<any> {
    return this.runner
      ? this.runner.manager.update(model.constructor, { id: model.id }, dirty)
      : Promise.resolve();
  }

  public delete(model: Model): Promise<any> {
    return this.runner ? this.runner.manager.remove(model) : Promise.resolve();
  }

  public hidden(model: ModelHidden): Promise<any> {
    model.hiddenAt = new Date();
    model.hidden = true;

    return this.runner
      ? this.runner.manager.update(model.constructor, { id: model.id }, model)
      : Promise.resolve();
  }
}
