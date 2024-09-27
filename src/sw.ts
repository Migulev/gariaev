declare const self: ServiceWorkerGlobalScope & {
  __WB_MANIFEST: (string | PrecacheEntry)[]
  addEventListener: (type: string, listener: EventListener) => void
}

declare global {
  interface FetchEvent {
    respondWith(response: Response | Promise<Response>): void
  }
}

interface ServiceWorkerGlobalScope {
  skipWaiting: () => void
}

import { clientsClaim } from 'workbox-core'
import {
  cleanupOutdatedCaches,
  precacheAndRoute,
  PrecacheEntry,
} from 'workbox-precaching'
import { MatrixDTO } from './types'

const CACHE_VERSION = 'v1'
const CACHE_PREFIX = 'matrix-data-cache-'
const CACHE_NAME = `${CACHE_PREFIX}${CACHE_VERSION}`

self.skipWaiting()
clientsClaim()

cleanupOutdatedCaches()
precacheAndRoute(self.__WB_MANIFEST)

self.addEventListener('fetch', ((event: FetchEvent) => {
  if (event.request.url.includes(import.meta.env.VITE_SUPABASE_URL)) {
    event.respondWith(
      (async function () {
        try {
          const response = await fetch(event.request)
          const data: MatrixDTO[] = await response.clone().json()

          const cache = await caches.open(CACHE_NAME)
          await cache.put(event.request, new Response(JSON.stringify(data)))

          return response
        } catch (error) {
          const cache = await caches.open(CACHE_NAME)
          const cachedResponse = await cache.match(event.request)

          if (cachedResponse) {
            return cachedResponse
          }
          throw error
        }
      })()
    )
  }
}) as EventListener)
