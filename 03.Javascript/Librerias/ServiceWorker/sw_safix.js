/**
 * @version 2.1.0
 * @author Jcardona-Jcastano
 * @module sw_safix
 * @Descripcion Se crea service worker para el funcionamiento de APEX_SAFIX, se solucionar problemas de session reportados 
 */
// La documentación y los archivos:
// https://github.com/vincentmorneau/apex-pwa/blob/master/doc/part2.md
// Id de la aplicacion en apex

const apexAppId = 100;
// Lista de páginas que se van a guardar en el servicio
// const apexPages = [9999, 175, 1, 100064];
const apexPages = [9999, 175, 1, 1004];

// En caso de no encontrar cualquier página se irá a la 404
const apex404Page = [404];

// Variables globales
const cacheStaticName = 'static-cache';
const cache404Name = '404-cache';
const cacheDynamicName = 'dynamic-cache';

const apexPagesUrl = [];
const apex404PagesUrl = [];


/**
 * @function log_sw
 * Intercepta los recursos, recursos en cache, recursos en el servidor
 **/
var debug_sw = true

function log_sw() {
	if (debug_sw) console.log(arguments);
}

/**
 * Todos los eventos del servicio
 **/
self.addEventListener('install', event => {
	log_sw('[SW] Instalando service worker:', event);
	event.waitUntil(installSW());
});

self.addEventListener('activate', event => {
	log_sw('[SW] Activando service worker:', event);
	return self.clients.claim();
});

self.addEventListener('fetch', event => {
	log_sw('[SW] Realizando fetch.', event)
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
			let queryString = clientUrl.search.split(':');
			queryString[1] = apexPage;
			log_sw(queryString)
			queryString = queryString.join(':');
			apexPagesUrl.push(clientUrl.origin + clientUrl.pathname + queryString);
		}
		// Guardar todas las páginas en la cache estatica "static-cache"
		const cacheStatic = await caches.open(cacheStaticName);
		cacheStatic.addAll(apexPagesUrl)
			.then(function () {
				log_sw('[SW] Agregando páginas a la cache ', apexPagesUrl);
			})
			.catch(function (err) {
				console.error(err);
			});

		// Guardar las urls en un array de las páginas (apex404Page)
		for (const apexPage of apex404Page) {
			let queryString = clientUrl.search.split(':');
			queryString[1] = apexPage;
			queryString = queryString.join(':');
			apex404PagesUrl.push(clientUrl.origin + clientUrl.pathname + queryString);
		}

		// Guardar la página de error en la cache 404
		const cache404 = await caches.open(cache404Name);

		cache404.addAll(apex404PagesUrl)
			.then(function () {
				log_sw('[SW] Agregando página 404 a la cache', apex404PagesUrl);
			})
			.catch(function (err) {
				log_sw('[SW] ', err);
			});
	}
}

/**
 * @function fetchSW
 * Intercepta los recursos, recursos en cache, recursos en el servidor
 **/

async function fetchSW(event) {
	try {
		log_sw("[SW]", event);

		const serverResponse = await fetch(event.request);

		if (serverResponse) {
			const cacheResponse = await caches.match(event.request);

			if (cacheResponse) {
				log_sw('[SW] Hay conexión. No requiere de la cache:', event.request.url);
			} else {
				log_sw('[SW] Hay conexión, pero hubo un error:', event.request.url);
				const cacheDynamic = await caches.open(cacheDynamicName);
				try {
					cacheDynamic.put(event.request.url, serverResponse.clone());
				} catch (ex) {
					log_sw(ex)
				}
			}
		}

		return serverResponse;
	} catch (serverErr) {
		const cacheResponse = await caches.match(event.request);

		if (cacheResponse) {
			log_sw('[SW] No hay conexión. Usando la cache:', event.request.url);
			return cacheResponse;
		} else {
			log_sw('[SW] No hay conexión & La cache ha fallado con su respuesta:', event.request.url);
			if (event.request.headers.get('accept').includes('text/html')) {
				const cache404 = await caches.open(cache404Name);
				return cache404.match(apex404PagesUrl);
			}
		}
	}
}