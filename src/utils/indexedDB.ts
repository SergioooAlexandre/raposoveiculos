// Lightweight, zero-dependency IndexedDB storage helper to bypass 5MB localStorage limits
const DB_NAME = 'RaposoVeiculosDB';
const DB_VERSION = 1;
const VEHICLES_STORE = 'vehicles_store';
const SETTINGS_STORE = 'settings_store';
const MEDIA_STORE = 'media_blobs';

const openDB = (): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(VEHICLES_STORE)) {
        db.createObjectStore(VEHICLES_STORE, { keyPath: 'id' });
      }
      if (!db.objectStoreNames.contains(SETTINGS_STORE)) {
        db.createObjectStore(SETTINGS_STORE, { keyPath: 'id' });
      }
      if (!db.objectStoreNames.contains(MEDIA_STORE)) {
        db.createObjectStore(MEDIA_STORE, { keyPath: 'id' });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
};

export const idbStorage = {
  // Save all vehicles
  async saveVehicles(vehicles: any[]): Promise<void> {
    try {
      const db = await openDB();
      const tx = db.transaction(VEHICLES_STORE, 'readwrite');
      const store = tx.objectStore(VEHICLES_STORE);
      store.clear();
      vehicles.forEach(v => store.put(v));
      return new Promise((resolve, reject) => {
        tx.oncomplete = () => resolve();
        tx.onerror = () => reject(tx.error);
      });
    } catch (err) {
      console.error('Erro ao salvar no IndexedDB:', err);
    }
  },

  // Get all vehicles
  async getVehicles(): Promise<any[] | null> {
    try {
      const db = await openDB();
      const tx = db.transaction(VEHICLES_STORE, 'readonly');
      const store = tx.objectStore(VEHICLES_STORE);
      const request = store.getAll();
      return new Promise((resolve, reject) => {
        request.onsuccess = () => {
          const res = request.result;
          resolve(res && res.length > 0 ? res : null);
        };
        request.onerror = () => reject(request.error);
      });
    } catch (err) {
      console.error('Erro ao ler do IndexedDB:', err);
      return null;
    }
  },

  // Save Media File / Blob (e.g. video files up to hundreds of MBs)
  async saveMediaBlob(id: string, blob: Blob | File): Promise<string> {
    try {
      const db = await openDB();
      const tx = db.transaction(MEDIA_STORE, 'readwrite');
      const store = tx.objectStore(MEDIA_STORE);
      store.put({ id, blob, created_at: Date.now() });
      await new Promise((resolve, reject) => {
        tx.oncomplete = () => resolve(true);
        tx.onerror = () => reject(tx.error);
      });
      return URL.createObjectURL(blob);
    } catch (err) {
      console.error('Erro ao salvar blob no IndexedDB:', err);
      return URL.createObjectURL(blob);
    }
  },

  // Get Media Blob URL
  async getMediaBlobUrl(id: string): Promise<string | null> {
    try {
      const db = await openDB();
      const tx = db.transaction(MEDIA_STORE, 'readonly');
      const store = tx.objectStore(MEDIA_STORE);
      const request = store.get(id);
      return new Promise((resolve) => {
        request.onsuccess = () => {
          if (request.result && request.result.blob) {
            resolve(URL.createObjectURL(request.result.blob));
          } else {
            resolve(null);
          }
        };
        request.onerror = () => resolve(null);
      });
    } catch (err) {
      return null;
    }
  }
};
