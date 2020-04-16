const staticCacheName = 'static-cache-v2';
const dynamicCacheName = 'dynamic-cache-v2';

const staticAssets = [
    './',
    './index.html',
    './images/icons/icon-128x128.png',
    './images/icons/icon-192x192.png',
    './css/main.css',
    './js/app.js',
    './js/main.js',
    './offline.html',
    './images/no-connection.png'
];



self.addEventListener('install', async event => {
    const cache = await caches.open(staticCacheName);
    await cache.addAll(staticAssets);
    console.log('Service  installed');
});


self.addEventListener('activate', async event => {
    const cachesKeys = await caches.keys();
    const checkKeys = cachesKeys.map(async key => {
        if (staticCacheName !== key) {
            await caches.delete(key);
        }
    });
    await Promise.all(checkKeys);

    console.log('Service  activated');
});

self.addEventListener('fetch', event => {
    console.log(`Trying fetch ${event.request.url}`);

    event.respondWith(checkCache(event.request));
});


async function checkCache(req) {
    const cachedResponse = await caches.match(req);
    return cachedResponse || checkOnline(req);
}


async function checkOnline(req) {
    const cache = await caches.open(dynamicCacheName);
    try {
        const res = await fetch(req);
        await cache.put(req, res.clone());
        return res;
    } catch (error) {
        const cachedRes = await cache.match(req);
        if (cachedRes) {
            return cachedRes;
        } else if (req.url.indexOf('.html') !== -1) {
            return caches.match('./offline.html');
        } else {
            return caches.match('./images/no-connection.png');
        }
    }
}