const cacheName = 'faqs-v1.0.1'
const cacheFiles = [
  '/objectsfaq/index.html',
  '/objectsfaq/faqs.json',

  '/objectsfaq/favicon.ico',
  '/objectsfaq/favicon-16x16.png',
  '/objectsfaq/favicon-32x32.png',
  '/objectsfaq/android-chrome-192x192',
  '/objectsfaq/android-chrome-512x512',
  '/objectsfaq/apple-touch-icon.png',

  '/objectsfaq/site.webmanifest',

  'https://cdn.jsdelivr.net/npm/vue@2.6.12',
  'https://fonts.googleapis.com/css?family=Roboto:300,300italic,700,700italic',
  'https://cdnjs.cloudflare.com/ajax/libs/normalize/8.0.1/normalize.css',
  'https://cdnjs.cloudflare.com/ajax/libs/milligram/1.4.1/milligram.css',

  'https://cdnjs.cloudflare.com/ajax/libs/showdown/1.9.1/showdown.min.js'
]

self.addEventListener('install', evt => {
  evt.waitUntil(
    caches.open(cacheName).then(cache => {
      return cache.addAll(cacheFiles).catch(e => console.log(e))
    })
  )
  self.skipWaiting()
})

// delete old caches on open
self.addEventListener('activate', evt =>
  evt.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== cacheName) {
            return caches.delete(cacheName)
          }
        })
      )
    })
  )
)

const fromNetwork = (request, timeout) =>
  new Promise((resolve, reject) => {
    const timeoutId = setTimeout(reject, timeout)
    fetch(request).then(response => {
      clearTimeout(timeoutId)
      const cacheCopy = response.clone()
      resolve(response)
        caches
          .open(cacheName)
          .then(cache =>
            cache.put(request, cacheCopy)
          )
    }, reject)
  })

const fromCache = request =>
  new Promise((resolve, reject) => {
    caches
      .open(cacheName)
      .then(cache =>
        cache
          .match(request)
          .then(matching => {
            if (matching) {
              resolve(matching)
            } else {
              reject(new Error('not in cache'))
            }
          })
      )
  })

  self.addEventListener('fetch', evt => {
    evt.respondWith(fromNetwork(evt.request, 5000).catch(() => fromCache(evt.request)))
  })