import { promisesZip } from '@xofttion/utils';
import { typeormSql } from './sql-manager';

export function transaction<T = unknown>(
  callback: () => Promise<T | void>
): Promise<T | void> {
  const runner = typeormSql.createRunner();

  if (!runner) {
    return Promise.resolve();
  }

  return promisesZip([
    () => runner.connect(),
    () => runner.startTransaction(),
    () => callback(),
    () => runner.commitTransaction()
  ])
    .then(([_c, _t, result]) => {
      return result as T;
    })
    .catch((ex) => {
      return runner.rollbackTransaction().finally(() => {
        throw ex;
      });
    })
    .finally(() => {
      runner.release();
    });
}

export async function transactionAsync<T = unknown>(
  callback: () => Promise<T | void>
): Promise<T | void> {
  const runner = typeormSql.createRunner();

  if (!runner) {
    return Promise.resolve();
  }

  try {
    await runner.connect();
    await runner.startTransaction();

    const result = await callback();

    await runner.commitTransaction();

    return result;
  } catch (ex) {
    await runner.rollbackTransaction();

    throw ex;
  } finally {
    await runner.release();
  }
}
