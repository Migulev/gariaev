import { type AudioFile } from '@/types'

const DB_NAME = 'MatrixAudioDB'
const STORE_NAME = 'audioFiles'

export const indexDB = {
  openDB: async () => {
    console.log('Opening database')
    return new Promise<IDBDatabase>((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, 1)
      request.onerror = () => reject(request.error)
      request.onsuccess = () => resolve(request.result)
      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result
        db.createObjectStore(STORE_NAME, { keyPath: 'id' })
      }
    })
  },

  saveAudio: async ({ id, audioBlob, title }: AudioFile) => {
    console.log('Saving audio', id, title)
    const db = await indexDB.openDB()
    return new Promise<void>((resolve, reject) => {
      const transaction = db.transaction(STORE_NAME, 'readwrite')
      const store = transaction.objectStore(STORE_NAME)
      const request = store.put({ id, audioBlob, title })
      request.onerror = () => reject(request.error)
      request.onsuccess = () => resolve()
    })
  },

  getAllAudioFiles: async () => {
    console.log('Getting all audio files')
    const db = await indexDB.openDB()
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(STORE_NAME, 'readonly')
      const store = transaction.objectStore(STORE_NAME)
      const request = store.getAll()
      request.onerror = () => reject(request.error)
      request.onsuccess = () => resolve(request.result)
    })
  },
}
