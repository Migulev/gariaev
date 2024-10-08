import { Id, AudioFile } from '@/types'

const DB_NAME = 'MatrixAudioDB'
const STORE_NAME = 'audioFiles'

const openDB = async () => {
  return new Promise<IDBDatabase>((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, 1)
    request.onerror = () => reject(request.error)
    request.onsuccess = () => resolve(request.result)
    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result
      db.createObjectStore(STORE_NAME, { keyPath: 'id' })
    }
  })
}

export const indexDB = {
  saveAudio: async ({ id, audioBlob, title }: AudioFile) => {
    const db = await openDB()
    return new Promise<void>((resolve, reject) => {
      const transaction = db.transaction(STORE_NAME, 'readwrite')
      const store = transaction.objectStore(STORE_NAME)
      const request = store.put({ id, audioBlob, title })
      request.onerror = () => reject(request.error)
      request.onsuccess = () => resolve()
    })
  },

  getAllAudioFiles: async () => {
    const db = await openDB()
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(STORE_NAME, 'readonly')
      const store = transaction.objectStore(STORE_NAME)
      const request = store.getAll()
      request.onerror = () => reject(request.error)
      request.onsuccess = () => resolve(request.result)
    })
  },

  deleteAudio: async (id: Id) => {
    const db = await openDB()
    return new Promise<void>((resolve, reject) => {
      const transaction = db.transaction(STORE_NAME, 'readwrite')
      const store = transaction.objectStore(STORE_NAME)
      const request = store.delete(id)
      request.onerror = () => reject(request.error)
      request.onsuccess = () => resolve()
    })
  },

  getStorageEstimate: async () => {
    if ('storage' in navigator && 'estimate' in navigator.storage) {
      try {
        const estimate = await navigator.storage.estimate()
        const totalSpace = estimate.quota ?? 0
        const usedSpace = estimate.usage ?? 0
        const freeSpace = totalSpace - usedSpace
        return {
          totalSpace,
          usedSpace,
          freeSpace,
          percentageUsed: totalSpace ? (usedSpace / totalSpace) * 100 : 0,
        }
      } catch (error) {
        console.error('Error estimating storage:', error)
        throw error
      }
    } else {
      throw new Error('Storage estimation not supported in this browser')
    }
  },
}
