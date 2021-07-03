/*************************************************************/
/*                     ServiceWorker File.                   */
/*   Version-1.0.0||Stable version.||Author = Arif Sardar.   */
/*************************************************************/

console.log("Service Worker Loaded...");

// name for cache.
const cacheName = 'com.pwa.cache'; // change this name.
// An Array of files to be cached.
var staticAssets = [];

self.addEventListener('install', async e => {// execute when app is installed.
      return await self.addEventListener('message',async data=>{
            const cache = await caches.open(cacheName);// open cache.
            await cache.addAll(staticAssets);// add files in the cache.
            return self.skipWaiting();// skip wait and activate sw automatically.
      });
});

self.addEventListener('activate', async e => {
      // Console if sw loaded.
      console.log(`ServiceWorker is Successfully Registered.`);
      self.clients.claim();
});

// execute when app is featching from network.
self.addEventListener('fetch', async e => {
      const req = e.request;
      const url = new URL(req.url);
      
      e.respondWith(cacheFirst(req));
});
  
async function cacheFirst(req) {
      return caches.open(cacheName).then(function(cache) {
          return cache.match(req).then(function (response) {
              return response || fetch(req).then(function(response) {
                  cache.put(req, response.clone());
                  return response;
              });
          });
      })
}

self.addEventListener("push", e => {
      const data = e.data.json();
      console.log("Push Recieved...");
      self.registration.showNotification(data.title, {
            actions : data.actions || [],
            badge : data.badge || "",
            body : data.body,
            data : data.data || undefined,
            dir : data.dir || "auto",
            icon : data.icon,
            image : data.image || "",
            lang : data.lang || "",
            renotify : data.renotify || false,
            requireInteraction : data.requireInteraction || false,
            silent : data.silent || false,
            tag : data.tag || "",
            timestamp : data.timestamp,
            vibrate : data.vibrate || 1000
      });
});
