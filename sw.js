// متجر الأصالة — Service Worker
// وظيفته: يخلي التطبيق يفتح فورًا حتى بدون إنترنت (يعرض آخر نسخة محفوظة)،
// ولما يرجع الإنترنت يحدّث الملفات بهدوء بالخلفية.

const CACHE_NAME = 'alasala-shell-v1';
const APP_SHELL = [
  './',
  './index.html',
  './manifest.json',
  './assets/icon-192.png',
  './assets/icon-512.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_SHELL))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// استراتيجية: جرّب الشبكة أولًا، ولو ما فيه نت رجّع النسخة المخزّنة
self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;

  event.respondWith(
    fetch(event.request)
      .then((response) => {
        const copy = response.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy));
        return response;
      })
      .catch(() => caches.match(event.request).then((cached) => cached || caches.match('./index.html')))
  );
});

// ---------- استقبال إشعارات Firebase Cloud Messaging بالخلفية ----------
// يُفعَّل لاحقًا عند ربط مشروع Firebase الجديد بمفاتيحه الخاصة.
self.addEventListener('push', (event) => {
  if (!event.data) return;
  let payload = {};
  try { payload = event.data.json(); } catch (e) { payload = { title: 'متجر الأصالة', body: event.data.text() }; }
  const title = payload.title || 'متجر الأصالة';
  const options = {
    body: payload.body || '',
    icon: './assets/icon-192.png',
    badge: './assets/icon-192.png',
    dir: 'rtl',
    lang: 'ar'
  };
  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(
    clients.matchAll({ type: 'window' }).then((list) => {
      if (list.length > 0) return list[0].focus();
      return clients.openWindow('./index.html');
    })
  );
});
