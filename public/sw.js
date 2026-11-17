// Bukiaa service worker. Hand-written (no build step): bump VERSION when this
// file's caching behaviour changes, so old caches are dropped on activate.
//
// - Pages: network first (catalog HTML is ISR-cached on Vercel, so it's fast),
//   falling back to the last copy seen, then to /offline.
// - /_next/static: cache first (file names are content hashed).
// - Images and public assets: stale-while-revalidate, capped.
// - /api, RSC payloads, non-GET and cross-origin requests are never touched:
//   auth and favorites must always hit the network.

const VERSION = "v2";
const PAGES = `pages-${VERSION}`;
const STATIC = `static-${VERSION}`;
const IMAGES = `images-${VERSION}`;
const CURRENT = [PAGES, STATIC, IMAGES];

// Kinyarwanda pages are unprefixed, English ones under /en.
const OFFLINE_URLS = ["/offline", "/en/offline"];
const PRECACHE_PAGES = [...OFFLINE_URLS, "/", "/en"];
const PRECACHE_ASSETS = ["/icons/icon-192.png", "/brand/logo-mark.svg"];

const MAX_PAGES = 60;
const MAX_IMAGES = 250;
// After this long, show the saved copy instead of a blank screen.
const NETWORK_TIMEOUT_MS = 4000;

self.addEventListener("install", (event) => {
  event.waitUntil(precache());
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      const names = await caches.keys();
      await Promise.all(
        names
          .filter((name) => !CURRENT.includes(name))
          .map((name) => caches.delete(name)),
      );
      if (self.registration.navigationPreload) {
        await self.registration.navigationPreload.enable();
      }
      await self.clients.claim();
    })(),
  );
});

self.addEventListener("message", (event) => {
  if (event.data?.type === "SKIP_WAITING") self.skipWaiting();
});

self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET") return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;
  if (url.pathname.startsWith("/api/")) return;
  if (url.pathname === "/sw.js") return;
  // Client-side navigations and prefetches. If these fail offline, Next falls
  // back to a full page load, which the navigation handler below serves.
  if (request.headers.has("RSC") || url.searchParams.has("_rsc")) return;

  if (request.mode === "navigate") {
    event.respondWith(handleNavigation(event));
  } else if (url.pathname.startsWith("/_next/static/")) {
    event.respondWith(cacheFirst(request, STATIC));
  } else if (
    url.pathname.startsWith("/_next/image") ||
    request.destination === "image"
  ) {
    event.respondWith(staleWhileRevalidate(event, IMAGES, MAX_IMAGES));
  } else if (
    /^\/(icons|splash|brand|hero)\//.test(url.pathname) ||
    request.destination === "font"
  ) {
    event.respondWith(staleWhileRevalidate(event, STATIC));
  }
});

async function precache() {
  const pages = await caches.open(PAGES);
  const assets = await caches.open(STATIC);
  // The offline page must work with no network at all, so also cache the
  // scripts, styles and fonts it references. The home page is best effort.
  // One page at a time: they share chunks, and concurrent addAll() calls
  // writing the same entry reject the whole install.
  for (const path of PRECACHE_PAGES) {
    try {
      const response = await fetch(path, { cache: "reload" });
      if (!response.ok) throw new Error(`${path}: ${response.status}`);
      await pages.put(path, response.clone());
      const html = await response.text();
      const urls = [
        ...html.matchAll(/(?:href|src)="(\/_next\/static\/[^"]+)"/g),
      ].map((match) => match[1].replace(/&amp;/g, "&"));
      await assets.addAll([...new Set(urls)]);
    } catch (error) {
      if (OFFLINE_URLS.includes(path)) throw error;
    }
  }
  await assets.addAll(PRECACHE_ASSETS);
}

async function handleNavigation(event) {
  const { request } = event;
  const cache = await caches.open(PAGES);

  const network = (async () => {
    const response = (await event.preloadResponse) || (await fetch(request));
    if (response.ok && !response.redirected && response.type === "basic") {
      event.waitUntil(
        cache.put(request, response.clone()).then(() => trim(PAGES, MAX_PAGES)),
      );
    }
    return response;
  })();
  // Don't let a rejected network promise go unhandled while we race.
  network.catch(() => {});

  const timeout = new Promise((resolve) =>
    setTimeout(resolve, NETWORK_TIMEOUT_MS),
  );

  try {
    const winner = await Promise.race([network, timeout]);
    if (winner) return winner;
    // Slow network (e.g. the backend is waking up): show a saved copy if we
    // have one, otherwise keep waiting.
    return (await cachedPage(cache, request)) || (await network);
  } catch {
    return (
      (await cachedPage(cache, request)) ||
      (await cache.match(offlineUrl(request))) ||
      Response.error()
    );
  }
}

/** The offline page in the language of the page that couldn't load. */
function offlineUrl(request) {
  const { pathname } = new URL(request.url);
  return pathname === "/en" || pathname.startsWith("/en/")
    ? "/en/offline"
    : "/offline";
}

/** The saved copy of this page; for a filtered or variant URL, the plain page. */
async function cachedPage(cache, request) {
  return (
    (await cache.match(request)) ||
    (await cache.match(request, { ignoreSearch: true }))
  );
}

async function cacheFirst(request, cacheName) {
  const cache = await caches.open(cacheName);
  const cached = await cache.match(request);
  if (cached) return cached;
  const response = await fetch(request);
  if (response.ok) await cache.put(request, response.clone());
  return response;
}

async function staleWhileRevalidate(event, cacheName, maxEntries) {
  const { request } = event;
  const cache = await caches.open(cacheName);
  const cached = await cache.match(request);
  const network = fetch(request)
    .then(async (response) => {
      if (response.ok) {
        await cache.put(request, response.clone());
        if (maxEntries) await trim(cacheName, maxEntries);
      }
      return response;
    })
    .catch(() => undefined);

  if (cached) {
    event.waitUntil(network);
    return cached;
  }
  return (await network) || Response.error();
}

/** Drops the oldest entries (keys come back in insertion order). */
async function trim(cacheName, maxEntries) {
  const cache = await caches.open(cacheName);
  const keys = await cache.keys();
  await Promise.all(
    keys
      .slice(0, Math.max(0, keys.length - maxEntries))
      .map((key) => cache.delete(key)),
  );
}
