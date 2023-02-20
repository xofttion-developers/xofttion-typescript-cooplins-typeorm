import {
  DataSource,
  EntityTarget,
  ObjectLiteral,
  QueryRunner,
  Repository
} from 'typeorm';

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

  public getRepository<T extends ObjectLiteral>(
    target: EntityTarget<T>
  ): Repository<T> | undefined {
    return this.dataSource?.getRepository<T>(target);
  }
}

export const typeormSql = new TypeormSql();
