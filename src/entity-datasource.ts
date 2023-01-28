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

  public async insert(model: Model): Promise<void> {
    await this.runner?.manager.save(model);
  }

  public async update(model: Model, dirty: ModelDirty): Promise<void> {
    await this.runner?.manager.update(model.constructor, { id: model.id }, dirty);
  }

  public async delete(model: Model): Promise<void> {
    await this.runner?.manager.remove(model);
  }

  public async hidden(model: ModelHidden): Promise<void> {
    model.hiddenAt = new Date();
    model.hidden = true;

    await this.runner?.manager.update(model.constructor, { id: model.id }, model);
  }
}
