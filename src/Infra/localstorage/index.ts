interface ILocalStorage {
  read(key: string): Promise<any>;
  save(key: string, value: any): Promise<void>;
  hasData(key: string): Promise<boolean>;
  remove(key: string): Promise<void>;
}

class LocalStorage implements ILocalStorage {
  read(key: string): Promise<any> {
    return new Promise((resolve, reject) => {
      try {
        const data = localStorage.getItem(key);

        resolve(data ? JSON.parse(data) : null);
      } catch (error) {
        reject(error);
      }
    });
  }

  save(key: string, value: any): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        const data = JSON.stringify(value);
        localStorage.setItem(key, data);
        resolve();
      } catch (error) {
        reject(error);
      }
    });
  }

  hasData(key: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      try {
        const data = localStorage.getItem(key);
        resolve(data !== null);
      } catch (error) {
        reject(error);
      }
    });
  }

  remove(key: string): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        localStorage.removeItem(key);
        resolve();
      } catch (error) {
        reject(error);
      }
    });
  }
}
export const localdb: ILocalStorage = new LocalStorage();
