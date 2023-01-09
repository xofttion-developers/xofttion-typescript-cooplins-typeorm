import { DataSource, QueryRunner } from 'typeorm';

class TypeormSql {
  private _dataSource?: DataSource;

  public setDataSource(datasource: DataSource): void {
    this._dataSource = datasource;
  }

  public getDataSource(): DataSource | undefined {
    return this._dataSource;
  }

  public createRunner(): QueryRunner | undefined {
    return this._dataSource?.createQueryRunner();
  }
}

export const CoopplinsTypeormSql = new TypeormSql();
