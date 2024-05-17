class LS {
  static getValue(key: string) {
    try {
      return localStorage.getItem(key)
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

  async getData<T, K>(args: K): Promise<T | null> {
    try {
      const response = await fetch(`${this.baseURL}/${args}`);

      return await response.json();
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
