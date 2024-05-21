class LS {
  static getValue(key: string) {
    try {
      return localStorage.getItem(key) || null;
    } catch (e) {
      console.log(e)
    }
  }

  static setValue<T>(key: string, value: T) {
    localStorage.setItem(key, JSON.stringify(value))
  }
}

class API {
  constructor(public baseURL: string) {}

  async getData<T, K>(pathParam: K, cacheId?: number): Promise<T | null> {
    try {
      const cachedValue = LS.getValue(`${cacheId}`);

      if (cachedValue) {
        return JSON.parse(cachedValue)
      }

      const response = await fetch(`${this.baseURL}/${pathParam}`);
      const responseJson = await response.json();

      response && cacheId && LS.setValue<unknown>(`${cacheId}`, responseJson)

      return responseJson;
    } catch (error) {
      console.log(error);
      return null;
    }
  }
}

export {
  LS,
  API,
}
