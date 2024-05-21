import { ICache } from './providers';

/**
 * Временное храненние данных
 */
class TempStorage implements ICache {
  data: { [key: string]: any } = {};

  get(key: string) {
    return this.data[key];
  }

  set<T>(key: string, value: T) {
    this.data[key] = JSON.stringify(value);
  }
}

const tempStorage = new TempStorage();

export {
  tempStorage,
};
