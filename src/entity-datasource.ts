import {
  EntityDataSource,
  ModelDirty,
  ModelORM
} from '@xofttion/clean-architecture';
import { QueryRunner } from 'typeorm';

export class TypeormEntityDataSource implements EntityDataSource {
  private _runner?: QueryRunner;

  public setRunner(runner: QueryRunner): void {
    this._runner = runner;
  }

  public async insert(model: ModelORM): Promise<void> {
    await this._runner?.manager.save(model);
  }

  public async update(model: ModelORM, dirty: ModelDirty): Promise<void> {
    await this._runner?.manager.update(model.constructor, { id: model.id }, dirty);
  }

  public async delete(model: ModelORM): Promise<void> {
    await this._runner?.manager.remove(model);
  }
}
