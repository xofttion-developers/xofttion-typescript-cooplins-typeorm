import { DataSource, QueryRunner } from 'typeorm';

class TypeormSql {
  private _dataSource?: DataSource;
  private _runner?: QueryRunner;

  public setDataSource(datasource: DataSource): void {
    if (datasource) {
      this._dataSource = datasource;
    }
  }

  public getDataSource(): DataSource | undefined {
    return this._dataSource;
  }

  public getRunner(): QueryRunner | undefined {
    if (this._dataSource && !this._runner) {
      this._runner = this._dataSource.createQueryRunner();
    }

    return this._runner;
  }

  public async disconnectRunner(): Promise<void> {
    if (this._runner) {
      await this._runner?.release();

      this._runner = undefined;
    }
  }
}

export const CoopplinsTypeormSql = new TypeormSql();
