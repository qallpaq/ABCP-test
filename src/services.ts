import { PLACEHOLDER_API_URL } from './constants';
import { cachedHttpProvider } from './providers';

class UserService {
  baseURL = PLACEHOLDER_API_URL;

  /**
   * Получение пользователя
   */
  async getUser<T>(id: number, cacheId: number): Promise<T | null> {
    return cachedHttpProvider.get<T>(`${this.baseURL}/${id}`, cacheId);
  }
}

export {
  UserService,
};
