// La documentación y los archivos:
// https://github.com/vincentmorneau/apex-pwa/blob/master/doc/part2.md
// Script para usar el IndexedDB
importScripts('/ords/xenco/r/105/files/static/v154/localforage.min.js');
// Lista de páginas que se van a guardar en el servicio
const apexAppId = 105; 
const apexPages = [9999, 175];

// En caso de no encontrar cualquier página se irá a la 404
const apex404Page = [404]; 

// Variables globales
const cacheStaticName = 'static-cache';
const cache404Name = '404-cache';
const cacheDynamicName = 'dynamic-cache';

const apexPagesUrl = [];
const apex404PagesUrl = [];

/**
 * Todos los eventos del servicio
 **/
self.addEventListener('install', event => {
	console.log('[SW] Instalando service worker:', event);
	event.waitUntil(installSW());
});

self.addEventListener('activate', event => {
	console.log('[SW] Activando service worker:', event);
	return self.clients.claim();
});

self.addEventListener('fetch', event => {
	console.log('[SW] Realizando fetch.', event)
	event.respondWith(fetchSW(event));
});

/**
 * @function installSW
 * Instala la app y registra las páginas
 **/
async function installSW() {
	let clientUrl;

	// Coger la url de la página como formato inicial
	await self.clients.matchAll({
		includeUncontrolled: true
	}).then(clients => {
		for (const client of clients) {
			if (new URL(client.url).search.split(':')[0] === '?p=' + apexAppId) {
				clientUrl = new URL(client.url);
			}
		}
	});

	if (clientUrl) {
		// Guardar las urls en un array de las páginas (apexPages)
		for (const apexPage of apexPages) {
			if(window.location.search.includes(`${apexAppId}:${apexPages[0]}`)){
				let queryString = clientUrl.search.split(':');
				queryString[1] = apexPage;
				console.log(queryString)
				queryString = queryString.join(':');
				apexPagesUrl.push(clientUrl.origin + clientUrl.pathname + queryString);
			}
		}

		// Guardar las urls en un array de las páginas (apex404Page)
		for (const apexPage of apex404Page) {
			let queryString = clientUrl.search.split(':');
			queryString[1] = apexPage;
			queryString = queryString.join(':');
			apex404PagesUrl.push(clientUrl.origin + clientUrl.pathname + queryString);
		}

		// Guardar todas las páginas en la cache estatica "static-cache"
		const cacheStatic = await caches.open(cacheStaticName);
		cacheStatic.addAll(apexPagesUrl)
			.then(function () {
				console.log('[SW] Agregando páginas a la cache ', apexPagesUrl);
			})
			.catch(function (err) {
				console.error(err);
			});

		// Guardar la página de error en la cache 404
		const cache404 = await caches.open(cache404Name);
		cache404.addAll(apex404PagesUrl)
			.then(function () {
				console.log('[SW] Agregando página 404 a la cache', apex404PagesUrl);
			})
			.catch(function (err) {
				console.error(err);
			});
	}
}

/**
 * @function fetchSW
 * Intercepta los recursos, recursos en cache, recursos en el servidor
 **/
async function fetchSW(event) {
	try {
		const serverResponse = await fetch(event.request);

		if (serverResponse) {
			const cacheResponse = await caches.match(event.request);

			if (cacheResponse) {
				console.log('[SW] Hay conexión. No requiere de la cache:', event.request.url);
			} else {
				console.log('[SW] Hay conexión, pero hubo un error:', event.request.url);
				const cacheDynamic = await caches.open(cacheDynamicName);
				cacheDynamic.put(event.request.url, serverResponse.clone());
			}
		}

		return serverResponse;
	} catch (serverErr) {
		const cacheResponse = await caches.match(event.request);

		if (cacheResponse) {
			console.log('[SW] No hay conexión. Usando la cache:', event.request.url);
			return cacheResponse;
		} else {
			console.log('[SW] No hay conexión & La cache ha fallado con su respuesta:', event.request.url);
			if (event.request.headers.get('accept').includes('text/html')) {
				const cache404 = await caches.open(cache404Name);
				return cache404.match(apex404PagesUrl);
			}
		}
	}
}
