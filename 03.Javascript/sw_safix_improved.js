/**
 * @version v20240315_001
 * @namespace sw_safix_improved
 * @description Service Worker mejorado para APEX_SAFIX con mejor manejo de caché y logging
 */

// Configuración de la aplicación
const CONFIG = {
    apexAppId: 105,
    version: 'v20240315_001',
    debug: true,
    // Páginas principales que deben estar siempre disponibles offline
    staticPages: [
        1,      // Página de inicio
        175,    // Página principal
        9999,   // Página de login
        100064  // Página de dashboard
    ],
    // Páginas de error
    errorPages: [404],
    // Recursos estáticos importantes
    staticResources: [
        '/i/libraries/apex/',
        '/i/css/',
        '/i/js/'
    ]
};

// Nombres de caché con versiones
const CACHE_NAMES = {
    static: `static-cache-${CONFIG.version}`,
    dynamic: `dynamic-cache-${CONFIG.version}`,
    error: `error-cache-${CONFIG.version}`
};

// URLs de las páginas
let apexPagesUrl = [];
let apexErrorPagesUrl = [];

/**
 * @function log
 * Sistema de logging mejorado
 */
function log(...args) {
    if (CONFIG.debug) {
        console.log(`[SW ${CONFIG.version}]`, ...args);
    }
}

/**
 * @function clearOldCaches
 * Limpia las cachés antiguas
 */
async function clearOldCaches() {
    const cacheNames = await caches.keys();
    const oldCaches = cacheNames.filter(name => 
        name.startsWith('static-cache-') || 
        name.startsWith('dynamic-cache-') || 
        name.startsWith('error-cache-')
    );
    
    for (const cacheName of oldCaches) {
        if (!Object.values(CACHE_NAMES).includes(cacheName)) {
            await caches.delete(cacheName);
            log('Cache eliminada:', cacheName);
        }
    }
}

/**
 * @function buildUrls
 * Construye las URLs para las páginas APEX
 */
function buildUrls(baseUrl, pageIds) {
    return pageIds.map(pageId => {
        const queryString = baseUrl.search.split(':');
        queryString[1] = pageId;
        return baseUrl.origin + baseUrl.pathname + queryString.join(':');
    });
}

/**
 * @function installSW
 * Instalación mejorada del Service Worker
 */
async function installSW() {
    try {
        // Obtener la URL base
        const clients = await self.clients.matchAll({ includeUncontrolled: true });
        const baseUrl = new URL(clients.find(client => 
            new URL(client.url).search.split(':')[0] === `?p=${CONFIG.apexAppId}`
        )?.url || '');

        if (!baseUrl) {
            throw new Error('No se pudo obtener la URL base');
        }

        // Construir URLs
        apexPagesUrl = buildUrls(baseUrl, CONFIG.staticPages);
        apexErrorPagesUrl = buildUrls(baseUrl, CONFIG.errorPages);

        // Inicializar cachés
        const [staticCache, errorCache] = await Promise.all([
            caches.open(CACHE_NAMES.static),
            caches.open(CACHE_NAMES.error)
        ]);

        // Cachear recursos estáticos
        await staticCache.addAll([
            ...apexPagesUrl,
            ...CONFIG.staticResources.map(resource => baseUrl.origin + resource)
        ]);
        log('Recursos estáticos cacheados');

        // Cachear páginas de error
        await errorCache.addAll(apexErrorPagesUrl);
        log('Páginas de error cacheadas');

    } catch (error) {
        log('Error durante la instalación:', error);
        throw error;
    }
}

/**
 * @function fetchSW
 * Manejo mejorado de peticiones
 */
async function fetchSW(event) {
    const request = event.request;
    log('Procesando petición:', request.url);

    try {
        // Intentar obtener respuesta del servidor
        const serverResponse = await fetch(request);
        
        // Si la respuesta es exitosa
        if (serverResponse.ok) {
            // Verificar si la respuesta está en caché
            const cachedResponse = await caches.match(request);
            
            if (!cachedResponse) {
                // Si no está en caché, guardar en caché dinámica
                const dynamicCache = await caches.open(CACHE_NAMES.dynamic);
                await dynamicCache.put(request, serverResponse.clone());
                log('Recurso guardado en caché dinámica:', request.url);
            }
            
            return serverResponse;
        }
        
        // Si la respuesta no es exitosa, buscar en caché
        const cachedResponse = await caches.match(request);
        if (cachedResponse) {
            return cachedResponse;
        }

        // Si es una petición HTML y no hay respuesta en caché, mostrar página de error
        if (request.headers.get('accept').includes('text/html')) {
            const errorCache = await caches.open(CACHE_NAMES.error);
            return errorCache.match(apexErrorPagesUrl[0]);
        }

        throw new Error('No se pudo obtener respuesta');

    } catch (error) {
        log('Error en fetch:', error);
        
        // Intentar obtener de caché
        const cachedResponse = await caches.match(request);
        if (cachedResponse) {
            return cachedResponse;
        }

        // Si es HTML, mostrar página de error
        if (request.headers.get('accept').includes('text/html')) {
            const errorCache = await caches.open(CACHE_NAMES.error);
            return errorCache.match(apexErrorPagesUrl[0]);
        }

        throw error;
    }
}

// Event Listeners
self.addEventListener('install', event => {
    log('Instalando Service Worker');
    event.waitUntil(installSW());
});

self.addEventListener('activate', event => {
    log('Activando Service Worker');
    event.waitUntil(Promise.all([
        clearOldCaches(),
        self.clients.claim()
    ]));
});

self.addEventListener('fetch', event => {
    event.respondWith(fetchSW(event));
}); 