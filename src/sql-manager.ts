import { DataSource, QueryRunner } from 'typeorm';

class TypeormSql {
  private dataSource?: DataSource;

  public setDataSource(datasource: DataSource): void {
    this.dataSource = datasource;
  }

  public getDataSource(): DataSource | undefined {
    return this.dataSource;
  }

  public createRunner(): QueryRunner | undefined {
    return this.dataSource?.createQueryRunner();
  }
}

export const typeormSql = new TypeormSql();
