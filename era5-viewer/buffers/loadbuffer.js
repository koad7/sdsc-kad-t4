// Utility function to open an IndexedDB connection
const openIndexedDB = (dbName, storeName) => {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(dbName, 1);
  
      request.onupgradeneeded = (event) => {
        const db = event.target.result;
        db.createObjectStore(storeName, { keyPath: 'id' });  
        console.log('Created Object Store');
      };
  
      request.onsuccess = (event) => {
        resolve(event.target.result);
      };
  
      request.onerror = (event) => {
        reject('Error opening IndexedDB:', event);
      };
    });
  };
  
  // Utility function to store data in IndexedDB
  const storeInIndexedDB = async (dbName, storeName, key, data) => {
    try {
      const db = await openIndexedDB(dbName, storeName);
      const transaction = db.transaction(storeName, 'readwrite');
      const store = transaction.objectStore(storeName);
      store.put({ id: key, data: data });
  
      transaction.oncomplete = () => {
        console.log(`Stored data with key '${key}' in IndexedDB.`);
      };
  
      transaction.onerror = (event) => {
        console.error('Transaction error:', event);
      };
    } catch (error) {
      console.error(error);
    }
  };
  
  // Utility function to retrieve data from IndexedDB
  const getFromIndexedDB = async (dbName, storeName, key) => {
    try {
      const db = await openIndexedDB(dbName, storeName);
      const transaction = db.transaction(storeName, 'readonly');
      const store = transaction.objectStore(storeName);
      const request = store.get(key);
  
      return new Promise((resolve, reject) => {
        request.onsuccess = () => {
          if (request.result) {
            resolve(request.result.data);
          } else {
            reject('No data found for key:', key);
          }
        };
  
        request.onerror = (event) => {
          reject('Error retrieving data from IndexedDB:', event);
        };
      });
    } catch (error) {
      console.error(error);
    }
  };
  
  // Utility function to delete data from IndexedDB
  const deleteFromIndexedDB = async (dbName, storeName, key) => {
    try {
      const db = await openIndexedDB(dbName, storeName);
      const transaction = db.transaction(storeName, 'readwrite');
      const store = transaction.objectStore(storeName);
      store.delete(key);
  
      transaction.oncomplete = () => {
        console.log(`Deleted data with key '${key}' from IndexedDB.`);
      };
  
      transaction.onerror = (event) => {
        console.error('Transaction error while deleting:', event);
      };
    } catch (error) {
      console.error(error);
    }
  };
  
  const arrayBuffer = new ArrayBuffer(8);
  const view = new Uint8Array(arrayBuffer);
  
  for (let i = 0; i < view.length; i++) {
    view[i] = i * 2;  
  }
  
  console.log('ArrayBuffer created:', view);
  
  storeInIndexedDB('GeoDataDB', 'GeoStore', 'myArrayBufferKey', arrayBuffer);
  
  getFromIndexedDB('GeoDataDB', 'GeoStore', 'myArrayBufferKey')
    .then((retrievedData) => {
      const retrievedView = new Uint8Array(retrievedData);
      console.log('Retrieved ArrayBuffer from IndexedDB:', retrievedView);
    })
    .catch((error) => {
      console.error(error);
    });
  
  deleteFromIndexedDB('GeoDataDB', 'GeoStore', 'myArrayBufferKey');
  