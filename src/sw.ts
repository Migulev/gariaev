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
          const clonedResponse = response.clone()
          const data: MatrixDTO[] = await clonedResponse.json()

          const cache = await caches.open(CACHE_NAME)
          await cache.put(event.request, new Response(JSON.stringify(data)))

          return new Response(JSON.stringify(data), {
            headers: clonedResponse.headers,
          })
        } catch {
          const cache = await caches.open(CACHE_NAME)
          const cachedResponses = await cache.matchAll()
          const allMatrixData: MatrixDTO[] = []

          for (const response of cachedResponses) {
            const data = await response.json()
            allMatrixData.push(...data)
          }

          return new Response(JSON.stringify(allMatrixData), {
            headers: { 'Content-Type': 'application/json' },
          })
        }
      })()
    )
  }
}) as EventListener)
