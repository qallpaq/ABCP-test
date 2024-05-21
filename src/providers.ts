interface ICache {
  get(key: string): string | null | undefined;
  set<T>(key: string, value: T): void;
}

interface IHttpProvider {
  get<T>(path: string): Promise<T | null>
}

/**
 * Провайдер для localStorage
 */
class LSProvider implements ICache {
  get(key: string) {
    try {
      return localStorage.getItem(key);
    } catch (e) {
      console.log(e);
    }
  }

  set<T>(key: string, value: T) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      console.log(e);
    }
  }
}

const lsProvider = new LSProvider();

/**
 * Провайдер для HTTP
 */
class HttpProvider implements IHttpProvider {
  /**
   * @param path - путь (URL адрес)
   */
  async get<T>(path: string): Promise<T | null> {
    try {
      const response = await fetch(path);

      return await response.json();
    } catch (error) {
      console.log(error);
      return null;
    }
  }
}

const httpProvider = new HttpProvider();

/**
 * Провайдер для HTTP с кэшированием данных
 */
class CachedHttpProvider {
  constructor(
    private cache: ICache,
    private provider: IHttpProvider,
  ) {}

  /**
   * @param path - путь (URL адрес)
   * @param cacheId - идентификатор кэша
   */
  async get<T>(path: string, cacheId: number): Promise<T | null> {
    const cachedValue = this.cache.get(`${cacheId}`);

    if (cachedValue) {
      return JSON.parse(cachedValue);
    }

    const response = await this.provider.get<T>(path);

    response && this.cache.set<T>(`${cacheId}`, response);

    return response;
  }
}

const cachedHttpProvider = new CachedHttpProvider(lsProvider, httpProvider);

export {
  lsProvider,
  cachedHttpProvider,
};

export type {
  ICache,
};
