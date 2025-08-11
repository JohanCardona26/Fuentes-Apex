
/**
 * Juan David Castaño Usuga
 * app.js for all functionality on the page and functions that can be reused in very common methods for the user experience
 */


/**
 * 
 * FUNCTIONS OFFLINE
 * 
 */


/**
 * 
 * recover_modules
 * 2023 
 * JUAN DAVID CASTAÑO USUGA
 * SANTIAGO RAMIREZ
 * 
 * 
 * @module recover_modules
 */


const recover_modules = {}

/**
 * 
 * Save Information
 * @function save_grid
 * 
 */

recover_modules.save_grid = (id_region) => {
    let grid = apex.region( id_region ).widget().interactiveGrid(`getViews`).grid
    const options_to_save = [`_aggregateRecs` ,`_aggregatedFields` ,`_breakEndIds` ,`_calculatedFields` ,`_changes` ,`_data` ,`_dependentFields` ,`_errors` ,`_haveAllData` ,`_identityKeys` ,`_index` ,`_metaKey` ,`_nextInsertId` ,`_numAggregateRecords` ,`_numDeletedRecords` ,`_numInsertedRecords` ,`_offset` ,`_options` ,`_requestsInProgress` ,`_selectAll` ,`_selectAllExcept` ,`_selectAnchor` ,`_selectRange` ,`_selection` ,`_staleAggFields` ,`_totalRecords` ,`_waitingPages` ,`dataOverflow` ,`instance` ,`name`]
    let _grid_config = {}
    Object.keys(grid.model).forEach((e) => {
        if(options_to_save.some(value => value === e)){
            _grid_config[e] = grid.model[e]
        }
    })
    localforage.setItem( id_region, _grid_config )
}

/**
 *
 *  Recover the grid
 *  @function save_grid
 * 
 */

recover_modules.load_grid = (id_region) => {    
    grid = apex.region(id_region).widget().interactiveGrid(`getViews`).grid
    localforage.getItem(id_region).then((data) => {
        Object.keys(data).forEach((e) => {
            grid.model[e] = data[e]
        })
        grid.refresh()
    })
}

/**
 * 
 * PROGRESIVE WEB APP (PWA)
 * 
 */
// https://redminexenco.com.co:4433/ords/xenco/r/105/files/static/v259/iconos

/**
 * @global variables
 **/

// For debug sw whe its fiail
// debug_sw = true

// Define el service worker
var apexServiceWorker = null;

// Valida y detecta si el usuario concedio el permiso de las notificaciones
var hasSubscribedNotifications = false;

// Objeto que instala el prompt
// var installPrompt;
var deferredPrompt = null;

// Llave publica del firebase
// CHANGE THIS VALUE
var firebaseVapidPublicKey = 'BOFoGrYiN1P70-UMcQ9vbfCJl9x5MXfxqCBbBqOVvim_s63i9xpM9P0PwqHvfNAs2D1rKYFOlMXhD3_Rtuybl2o';

// REST endpoint where we store requests for push notifications
// CHANGE THIS VALUE
var firebaseNotificationEndpoint = 'https://apex-pwa.firebaseio.com/notifications.json';

let icons_route = `https://redminexenco.com.co:8082/xtlims/xtlims/r/103/files/static/v1355/pwa_icons/`

const pages_to_save = [9999, 1]
const pages_disable_sw = [9999, 9997]

var manifest_pwa_app =  
`
{
	"name": "XTLIMS / Async XT A",
	"short_name": "XTLIMS / Async XT A",
	"description": "XTLIMS / Async XT A",
	"version": "1.0.1",
	"start_url": "https://redminexenco.com.co:8082/xtlims/f?p=103:9999",
	"display": "standalone",
	"background_color": "#fefefe",
	"theme_color": "#1A9395",
	"lang": "en-US",
	"icons": [
		{
			"src": "${icons_route}windows11/SmallTile.scale-100.png",
			"sizes": "71x71"
		},
		{
			"src": "${icons_route}windows11/SmallTile.scale-125.png",
			"sizes": "89x89"
		},
		{
			"src": "${icons_route}windows11/SmallTile.scale-150.png",
			"sizes": "107x107"
		},
		{
			"src": "${icons_route}windows11/SmallTile.scale-200.png",
			"sizes": "142x142"
		},
		{
			"src": "${icons_route}windows11/SmallTile.scale-400.png",
			"sizes": "284x284"
		},
		{
			"src": "${icons_route}windows11/Square150x150Logo.scale-100.png",
			"sizes": "150x150"
		},
		{
			"src": "${icons_route}windows11/Square150x150Logo.scale-125.png",
			"sizes": "188x188"
		},
		{
			"src": "${icons_route}windows11/Square150x150Logo.scale-150.png",
			"sizes": "225x225"
		},
		{
			"src": "${icons_route}windows11/Square150x150Logo.scale-200.png",
			"sizes": "300x300"
		},
		{
			"src": "${icons_route}windows11/Square150x150Logo.scale-400.png",
			"sizes": "600x600"
		},
		{
			"src": "${icons_route}windows11/Wide310x150Logo.scale-100.png",
			"sizes": "310x150"
		},
		{
			"src": "${icons_route}windows11/Wide310x150Logo.scale-125.png",
			"sizes": "388x188"
		},
		{
			"src": "${icons_route}windows11/Wide310x150Logo.scale-150.png",
			"sizes": "465x225"
		},
		{
			"src": "${icons_route}windows11/Wide310x150Logo.scale-200.png",
			"sizes": "620x300"
		},
		{
			"src": "${icons_route}windows11/Wide310x150Logo.scale-400.png",
			"sizes": "1240x600"
		},
		{
			"src": "${icons_route}windows11/LargeTile.scale-100.png",
			"sizes": "310x310"
		},
		{
			"src": "${icons_route}windows11/LargeTile.scale-125.png",
			"sizes": "388x388"
		},
		{
			"src": "${icons_route}windows11/LargeTile.scale-150.png",
			"sizes": "465x465"
		},
		{
			"src": "${icons_route}windows11/LargeTile.scale-200.png",
			"sizes": "620x620"
		},
		{
			"src": "${icons_route}windows11/LargeTile.scale-400.png",
			"sizes": "1240x1240"
		},
		{
			"src": "${icons_route}windows11/Square44x44Logo.scale-100.png",
			"sizes": "44x44"
		},
		{
			"src": "${icons_route}windows11/Square44x44Logo.scale-125.png",
			"sizes": "55x55"
		},
		{
			"src": "${icons_route}windows11/Square44x44Logo.scale-150.png",
			"sizes": "66x66"
		},
		{
			"src": "${icons_route}windows11/Square44x44Logo.scale-200.png",
			"sizes": "88x88"
		},
		{
			"src": "${icons_route}windows11/Square44x44Logo.scale-400.png",
			"sizes": "176x176"
		},
		{
			"src": "${icons_route}windows11/StoreLogo.scale-100.png",
			"sizes": "50x50"
		},
		{
			"src": "${icons_route}windows11/StoreLogo.scale-125.png",
			"sizes": "63x63"
		},
		{
			"src": "${icons_route}windows11/StoreLogo.scale-150.png",
			"sizes": "75x75"
		},
		{
			"src": "${icons_route}windows11/StoreLogo.scale-200.png",
			"sizes": "100x100"
		},
		{
			"src": "${icons_route}windows11/StoreLogo.scale-400.png",
			"sizes": "200x200"
		},
		{
			"src": "${icons_route}windows11/SplashScreen.scale-100.png",
			"sizes": "620x300"
		},
		{
			"src": "${icons_route}windows11/SplashScreen.scale-125.png",
			"sizes": "775x375"
		},
		{
			"src": "${icons_route}windows11/SplashScreen.scale-150.png",
			"sizes": "930x450"
		},
		{
			"src": "${icons_route}windows11/SplashScreen.scale-200.png",
			"sizes": "1240x600"
		},
		{
			"src": "${icons_route}windows11/SplashScreen.scale-400.png",
			"sizes": "2480x1200"
		},
		{
			"src": "${icons_route}windows11/Square44x44Logo.targetsize-16.png",
			"sizes": "16x16"
		},
		{
			"src": "${icons_route}windows11/Square44x44Logo.targetsize-20.png",
			"sizes": "20x20"
		},
		{
			"src": "${icons_route}windows11/Square44x44Logo.targetsize-24.png",
			"sizes": "24x24"
		},
		{
			"src": "${icons_route}windows11/Square44x44Logo.targetsize-30.png",
			"sizes": "30x30"
		},
		{
			"src": "${icons_route}windows11/Square44x44Logo.targetsize-32.png",
			"sizes": "32x32"
		},
		{
			"src": "${icons_route}windows11/Square44x44Logo.targetsize-36.png",
			"sizes": "36x36"
		},
		{
			"src": "${icons_route}windows11/Square44x44Logo.targetsize-40.png",
			"sizes": "40x40"
		},
		{
			"src": "${icons_route}windows11/Square44x44Logo.targetsize-44.png",
			"sizes": "44x44"
		},
		{
			"src": "${icons_route}windows11/Square44x44Logo.targetsize-48.png",
			"sizes": "48x48"
		},
		{
			"src": "${icons_route}windows11/Square44x44Logo.targetsize-60.png",
			"sizes": "60x60"
		},
		{
			"src": "${icons_route}windows11/Square44x44Logo.targetsize-64.png",
			"sizes": "64x64"
		},
		{
			"src": "${icons_route}windows11/Square44x44Logo.targetsize-72.png",
			"sizes": "72x72"
		},
		{
			"src": "${icons_route}windows11/Square44x44Logo.targetsize-80.png",
			"sizes": "80x80"
		},
		{
			"src": "${icons_route}windows11/Square44x44Logo.targetsize-96.png",
			"sizes": "96x96"
		},
		{
			"src": "${icons_route}windows11/Square44x44Logo.targetsize-256.png",
			"sizes": "256x256"
		},
		{
			"src": "${icons_route}windows11/Square44x44Logo.altform-unplated_targetsize-16.png",
			"sizes": "16x16"
		},
		{
			"src": "${icons_route}windows11/Square44x44Logo.altform-unplated_targetsize-20.png",
			"sizes": "20x20"
		},
		{
			"src": "${icons_route}windows11/Square44x44Logo.altform-unplated_targetsize-24.png",
			"sizes": "24x24"
		},
		{
			"src": "${icons_route}windows11/Square44x44Logo.altform-unplated_targetsize-30.png",
			"sizes": "30x30"
		},
		{
			"src": "${icons_route}windows11/Square44x44Logo.altform-unplated_targetsize-32.png",
			"sizes": "32x32"
		},
		{
			"src": "${icons_route}windows11/Square44x44Logo.altform-unplated_targetsize-36.png",
			"sizes": "36x36"
		},
		{
			"src": "${icons_route}windows11/Square44x44Logo.altform-unplated_targetsize-40.png",
			"sizes": "40x40"
		},
		{
			"src": "${icons_route}windows11/Square44x44Logo.altform-unplated_targetsize-44.png",
			"sizes": "44x44"
		},
		{
			"src": "${icons_route}windows11/Square44x44Logo.altform-unplated_targetsize-48.png",
			"sizes": "48x48"
		},
		{
			"src": "${icons_route}windows11/Square44x44Logo.altform-unplated_targetsize-60.png",
			"sizes": "60x60"
		},
		{
			"src": "${icons_route}windows11/Square44x44Logo.altform-unplated_targetsize-64.png",
			"sizes": "64x64"
		},
		{
			"src": "${icons_route}windows11/Square44x44Logo.altform-unplated_targetsize-72.png",
			"sizes": "72x72"
		},
		{
			"src": "${icons_route}windows11/Square44x44Logo.altform-unplated_targetsize-80.png",
			"sizes": "80x80"
		},
		{
			"src": "${icons_route}windows11/Square44x44Logo.altform-unplated_targetsize-96.png",
			"sizes": "96x96"
		},
		{
			"src": "${icons_route}windows11/Square44x44Logo.altform-unplated_targetsize-256.png",
			"sizes": "256x256"
		},
		{
			"src": "${icons_route}windows11/Square44x44Logo.altform-lightunplated_targetsize-16.png",
			"sizes": "16x16"
		},
		{
			"src": "${icons_route}windows11/Square44x44Logo.altform-lightunplated_targetsize-20.png",
			"sizes": "20x20"
		},
		{
			"src": "${icons_route}windows11/Square44x44Logo.altform-lightunplated_targetsize-24.png",
			"sizes": "24x24"
		},
		{
			"src": "${icons_route}windows11/Square44x44Logo.altform-lightunplated_targetsize-30.png",
			"sizes": "30x30"
		},
		{
			"src": "${icons_route}windows11/Square44x44Logo.altform-lightunplated_targetsize-32.png",
			"sizes": "32x32"
		},
		{
			"src": "${icons_route}windows11/Square44x44Logo.altform-lightunplated_targetsize-36.png",
			"sizes": "36x36"
		},
		{
			"src": "${icons_route}windows11/Square44x44Logo.altform-lightunplated_targetsize-40.png",
			"sizes": "40x40"
		},
		{
			"src": "${icons_route}windows11/Square44x44Logo.altform-lightunplated_targetsize-44.png",
			"sizes": "44x44"
		},
		{
			"src": "${icons_route}windows11/Square44x44Logo.altform-lightunplated_targetsize-48.png",
			"sizes": "48x48"
		},
		{
			"src": "${icons_route}windows11/Square44x44Logo.altform-lightunplated_targetsize-60.png",
			"sizes": "60x60"
		},
		{
			"src": "${icons_route}windows11/Square44x44Logo.altform-lightunplated_targetsize-64.png",
			"sizes": "64x64"
		},
		{
			"src": "${icons_route}windows11/Square44x44Logo.altform-lightunplated_targetsize-72.png",
			"sizes": "72x72"
		},
		{
			"src": "${icons_route}windows11/Square44x44Logo.altform-lightunplated_targetsize-80.png",
			"sizes": "80x80"
		},
		{
			"src": "${icons_route}windows11/Square44x44Logo.altform-lightunplated_targetsize-96.png",
			"sizes": "96x96"
		},
		{
			"src": "${icons_route}windows11/Square44x44Logo.altform-lightunplated_targetsize-256.png",
			"sizes": "256x256"
		},
		{
			"src": "${icons_route}android/android-launchericon-512-512.png",
			"sizes": "512x512"
		},
		{
			"src": "${icons_route}android/android-launchericon-192-192.png",
			"sizes": "192x192"
		},
		{
			"src": "${icons_route}android/android-launchericon-144-144.png",
			"sizes": "144x144"
		},
		{
			"src": "${icons_route}android/android-launchericon-96-96.png",
			"sizes": "96x96"
		},
		{
			"src": "${icons_route}android/android-launchericon-72-72.png",
			"sizes": "72x72"
		},
		{
			"src": "${icons_route}android/android-launchericon-48-48.png",
			"sizes": "48x48"
		},
		{
			"src": "${icons_route}ios/16.png",
			"sizes": "16x16"
		},
		{
			"src": "${icons_route}ios/20.png",
			"sizes": "20x20"
		},
		{
			"src": "${icons_route}ios/29.png",
			"sizes": "29x29"
		},
		{
			"src": "${icons_route}ios/32.png",
			"sizes": "32x32"
		},
		{
			"src": "${icons_route}ios/40.png",
			"sizes": "40x40"
		},
		{
			"src": "${icons_route}ios/50.png",
			"sizes": "50x50"
		},
		{
			"src": "${icons_route}ios/57.png",
			"sizes": "57x57"
		},
		{
			"src": "${icons_route}ios/58.png",
			"sizes": "58x58"
		},
		{
			"src": "${icons_route}ios/60.png",
			"sizes": "60x60"
		},
		{
			"src": "${icons_route}ios/64.png",
			"sizes": "64x64"
		},
		{
			"src": "${icons_route}ios/72.png",
			"sizes": "72x72"
		},
		{
			"src": "${icons_route}ios/76.png",
			"sizes": "76x76"
		},
		{
			"src": "${icons_route}ios/80.png",
			"sizes": "80x80"
		},
		{
			"src": "${icons_route}ios/87.png",
			"sizes": "87x87"
		},
		{
			"src": "${icons_route}ios/100.png",
			"sizes": "100x100"
		},
		{
			"src": "${icons_route}ios/114.png",
			"sizes": "114x114"
		},
		{
			"src": "${icons_route}ios/120.png",
			"sizes": "120x120"
		},
		{
			"src": "${icons_route}ios/128.png",
			"sizes": "128x128"
		},
		{
			"src": "${icons_route}ios/144.png",
			"sizes": "144x144"
		},
		{
			"src": "${icons_route}ios/152.png",
			"sizes": "152x152"
		},
		{
			"src": "${icons_route}ios/167.png",
			"sizes": "167x167"
		},
		{
			"src": "${icons_route}ios/180.png",
			"sizes": "180x180"
		},
		{
			"src": "${icons_route}ios/192.png",
			"sizes": "192x192"
		},
		{
			"src": "${icons_route}ios/256.png",
			"sizes": "256x256"
		},
		{
			"src": "${icons_route}ios/512.png",
			"sizes": "512x512"
		},
		{
			"src": "${icons_route}ios/1024.png",
			"sizes": "1024x1024"
		}
	]
}
`
const blob = new Blob([manifest_pwa_app], {type: 'application/json'});
const manifestURL = URL.createObjectURL(blob);

/**
 * @namespace pwa
 **/

var pwa = {}


/**
 * @module pwa.init
 * @example pwa.init();
 * Se llama cuando la página cargue.
 * Es usado para registrar el service worker.
 **/

pwa.init = () => {
	// Validar si el serviceWorker esta disponible en el navegador
	if ('serviceWorker' in navigator) {
		// Si esta disponible en el navegador, procede a registrar el sw(service worker)

		navigator.serviceWorker.register('/sw_xtlims.js').then( (registeredServiceWorker) => {
			console.log('[XTLIMS] Service worker registrado correctamente!');
			apexServiceWorker = registeredServiceWorker;

            /**
             * Funcionalidad offline
             */
			// Actualizar páginas en cache
            
			// if(navigator.onLine){

			// 	// Consulta ó creación de la cache estatica donde se guardan las páginas
			// 	// let cache_st = caches.open('static-cache')

			// 	// Obtener la cache de la siguiente forma
			// 	// cache_st.then( (c) => {

			// 	// 	// Obtener las páginas dentro de la cache
			// 	// 	c.keys().then( (r) => {

			// 	// 		// Obtener la sesión en la que el usuario se logueo
			// 	// 		localforage.getItem('session').then( (ses) => {
			// 	// 			// Números de las páginas que se guardan en cache
			// 	// 			let paginas = pages_to_save;
			// 	// 			/* Obtener la estructura que tienen las url () 
			// 	// 				origin: "https://ambulancias.metrosalud.gov.co:4433"
			// 	// 				pathname: "/apex/f"
			// 	// 				search: "?p=105:numero_pagina:7914834248933:::::"
			// 	// 			*/
			// 	// 			let pr = new URL(window.location.href)
			// 	// 			// Eliminar las páginas que se guardaron anteriormente
			// 	// 			r.map(e => {
			// 	// 				c.delete(e)
			// 	// 			})
			// 	// 			//Recorrer las páginas y guardarlas con la nueva sesión
			// 	// 			paginas.forEach(e => {

			// 	// 				let sear = pr.search.split(':')
								
			// 	// 				sear[1] = e
			// 	// 				sear[2] = ses
			// 	// 				sear[6] = ''
			// 	// 				sear[7] = ''

			// 	// 				c.add( pr.origin + pr.pathname + sear.join(':') )
																
			// 	// 			})

			// 	// 		})
			// 	// 	})
			// 	// })
			// }
			
		}).catch((err) => {
				console.error('[XTLIMS] Service worker fallo en el registro.', err);
		});

		// Recibe un mensaje del service worker en caso de alguna alerta
		navigator.serviceWorker.addEventListener('message', (event) => {
			if (event.data.refreshReportIds) {
				for (var key in event.data.refreshReportIds) {
					if (event.data.refreshReportIds.hasOwnProperty(key)) {X	
						apex.region(event.data.refreshReportIds[key]).refresh();
						console.log(event, key)
					}
				}
			}
		});

	} else {
		console.warn('Service workers no esta disponible en este navegador.');
		// pwa.ui.refresh();
	}
};

/**
 * @module pwa.install
 * @example pwa.install();
 **/
pwa.install = () => {
    // Install app for pwa
    if (deferredPrompt) {
        deferredPrompt.prompt();
        deferredPrompt.userChoice.then((choiceResult) => {
        if (choiceResult.outcome === 'accepted') {
            console.log('El usuario ha aceptado la instalación');
        } else {
            console.log('El usuario ha rechazado la instalación');
        }
        deferredPrompt = null;
        // document.getElementById('installBtn').style.display = 'none';
    });
  }
  
	// // Show the installation prompt, using the global variable previously set
	// installPrompt.prompt();
	// // Wait for the user to respond to the prompt
	// installPrompt.userChoice
	// 	.then( (choiceResult) => {
	// 		console.log('[Async XT] User instalando la aplicacion ' + choiceResult.outcome);
	// 		// Reset the install prompt
	// 		installPrompt = null;
	// 		// pwa.ui.refresh();
	// 	});
};

/**
 * @module pwa.event
 **/
pwa.event = {
	/**
	 * @function online
	 * @example pwa.event.online
	 * Show a message to the user that he's back online
	 **/
	online: () => {
		apex.message.showPageSuccess('Estas online!');
	},

	/**
	 * @function offline
	 * @example pwa.event.offline
	 * Show a message to the user that he's lost connection
	 **/
	offline: () => {
		$('#t_Alert_Success').remove();
		apex.message.clearErrors();
		apex.message.showErrors([{
			type: 'error',
			location: 'page',
			message: ' Conexión perdida'
		}]);
	},

	/**
	 * @function beforeinstallprompt
	 * @example pwa.event.beforeinstallprompt
	 * This event will be triggered after installation criteria are met
	 **/
	beforeinstallprompt: (event) => {
        event.preventDefault();
        deferredPrompt = event;
        $(`.hide_download_app`).removeClass('hide_download_app')
        // document.getElementById('installBtn').style.display = 'block';
        // console.log(`aa`)
		// // Stop the automatic installation prompt
		// event.preventDefault();
		// // Store the event in a global variable so it can be triggered later
		// installPrompt = event;
		// pwa.ui.refresh();
	},

	/**
	 * @function appinstalled
	 * @example pwa.event.appinstalled
	 * This event will be triggered after the app is installed
	 **/
	appinstalled: (event) => {
		console.log('[XTLIMS] Aplicacion instalada', event);
        $(`.hide_download_app`).removeClass('hide_download_app')
	}
};

(() => {
	window.addEventListener('online', pwa.event.online());
	window.addEventListener('offline', pwa.event.offline);
	window.addEventListener('beforeinstallprompt', pwa.event.beforeinstallprompt);
	window.addEventListener('appinstalled', pwa.event.appinstalled);
})();

/**
 * 
 * END PROGRESIVE WEB APP (PWA)
 * 
 */



/**
 * 
 * SECTION CONTEXT MENU
 * 
 */

let contextMenu = document.getElementById(`primary-context-menu`);
let scope = document.querySelector(`body`);
let file_input_modal

// Get the position for rigth click menu
let normalizePozition = (mouseX, mouseY) => {

    let {
    left: scopeOffsetX,
    top: scopeOffsetY,
    } = scope.getBoundingClientRect();

    scopeOffsetX = scopeOffsetX < 0 ? 0 : scopeOffsetX;
    scopeOffsetY = scopeOffsetY < 0 ? 0 : scopeOffsetY;

    let scopeX = mouseX - scopeOffsetX;
    let scopeY = mouseY - scopeOffsetY;

    let outOfBoundsOnX =
    scopeX + contextMenu.clientWidth > scope.clientWidth;

    let outOfBoundsOnY =
    scopeY + contextMenu.clientHeight > scope.clientHeight;

    let normalizedX = mouseX;
    let normalizedY = mouseY;

    if (outOfBoundsOnX) {
    normalizedX =
        scopeOffsetX + scope.clientWidth - contextMenu.clientWidth;
    }

    if (outOfBoundsOnY) {
    normalizedY =
        scopeOffsetY + scope.clientHeight - contextMenu.clientHeight;
    }

    return { normalizedX, normalizedY };
};

const ActionQuery = () =>{
    if(typeof(QueryOption) == 'function'){
        QueryOption()
    }else{
        if(query_data.query_prepared){
            query_data.cancelQuery()
        }else{
            query_data.prepareQuery()
        }
    }
}

var SaveOption = null
var DeleteOption = null
var ClearOption = null
var QueryOption = null
var NextButtonOption = null
var PrevButtonOption = null

// Validate Available function in the rigth click menu and show this options
const ValidateOptionForms = () =>{
    let Remove_options_form_separator = () => {
        $(`#options-form-separator`).removeClass(`hide_option`)
    }

    if(SaveOption){
        $(`#context-menu-action-Save`).parent().removeClass(`hide_option`)
        Remove_options_form_separator()
    }
        
    if(ClearOption){
        $(`#context-menu-action-Clear`).parent().removeClass(`hide_option`)
        Remove_options_form_separator()
    }
    
    if(QueryOption){
        $(`#context-menu-action-Query`).parent().removeClass(`hide_option`)
        Remove_options_form_separator()
    }

    if(DeleteOption){
        $(`#context-menu-action-Delete`).parent().removeClass(`hide_option`)
        Remove_options_form_separator()
    }
}

// Show cute menu when the user press alt or execute the rigth menu
scope.addEventListener(`contextmenu`, (event) => {
    // if (!$(contextMenu).hasClass(`visible`)){
        event.preventDefault();
        
        let { clientX: mouseX, clientY: mouseY } = event;

        let { normalizedX, normalizedY } = normalizePozition(mouseX, mouseY);

        contextMenu.classList.remove(`visible`);

        contextMenu.style.top = `${normalizedY}px`;
        contextMenu.style.left = `${normalizedX}px`;

        console.log(document.activeElement)
        
        if(document.activeElement.nodeName == `TEXTAREA` && !document.activeElement.readOnly){
            // console.log('show expand')
            field_expand_in_context = document.activeElement.id
            $(`#context-menu-action-EField`).parent().removeClass(`hide_option`)
            $(`#options-fields-separator`).removeClass(`hide_option`)
        }else{
            // console.log('hide expand')
            field_expand_in_context = ``
            $(`#context-menu-action-EField`).parent().addClass(`hide_option`)
            $(`#options-fields-separator`).addClass(`hide_option`)
        }

        contextMenu.classList.add(`visible`);
    // }
   
});

// hide cute menu when the user press rigth clisck
scope.addEventListener(`click`, (e) => {
    // ? close the menu if the user clicks outside of it
    if (e.target.offsetParent != contextMenu) {
        contextMenu.classList.remove(`visible`);
    }
});

$(`a`).click((e) => {
    if (e.target.offsetParent != contextMenu) {
        contextMenu.classList.remove(`visible`);
    }
})


// KeyShorts for more similar functions to oracle forms
document.addEventListener(`keydown`, (e) => {
    // console.log(`1`, e)
    if(e.ctrlKey){
        switch(e.code){
            case `KeyS`:
                if(SaveOption){
                    e.preventDefault();
                    SaveOption()
                }
                break;
            case `KeyD`:
                if(DeleteOption){
                    e.preventDefault();
                    DeleteOption()
                }
                break;
            case `ArrowLeft`:
                if(PrevButtonOption){
                    if (!new RegExp(`INPUT|TEXTAREA`).test(document.activeElement.tagName)) {
                        e.preventDefault();
                        PrevButtonOption()
                    }
                }
                break;
            case `ArrowRight`:
                if(NextButtonOption){
                    if (!new RegExp(`INPUT|TEXTAREA`).test(document.activeElement.tagName)) {
                        e.preventDefault();
                        NextButtonOption()
                    }
                }
                break;
        }
    }else if(e.altKey){
        switch(e.code){
            case `KeyE`:
                if(document.activeElement.nodeName == `TEXTAREA` && !document.activeElement.readOnly){
                    e.preventDefault();
                    if(field_expand.style.display == "block"){
                        CloseFieldExpand()
                    }else{
                        OpenFieldExpand(document.activeElement.id)
                    }
                }
                break;
            case `KeyF`:
                if($(`#t_Button_rightControlButton`).length){
                    e.preventDefault();
                    $(`#t_Button_rightControlButton`).click()
                }
                break;
            case `KeyC`:
                if($(`#t_Button_navControl`).length){
                    e.preventDefault();
                    $(`#t_Button_navControl`).click()
                }
                break;
        }
    }else{
        switch(e.code){
            case `F8`:
                if(ClearOption){
                    e.preventDefault();
                    ClearOption()
                }
                break;
            case `F12`:
                console.log(`Execute query`)
                // if(){
                //     e.preventDefault();
                //     ClearOption()
                // }
                break;
            case `F11`:
                if(QueryOption){
                    e.preventDefault();
                    ActionQuery()
                }
                break;
            case `Escape`:
                if(limsservice_file_browser.style.display == `block` || field_expand.style.display == `block`){
                    e.preventDefault();
                    limsservice_file_browser.style.display = `none`
                    field_expand.style.display = `none`
                }
                break;
        }
    }
});

// Open Full Screeen
const OpenFullscreen = () => {
  var elem = document.documentElement;

  if (elem.requestFullscreen) {
    elem.requestFullscreen();
  } else if (elem.webkitRequestFullscreen) { /* Safari */
    elem.webkitRequestFullscreen();
  } else if (elem.msRequestFullscreen) { /* IE11 */
    elem.msRequestFullscreen();
  }
}

// Open Close FullScreen
const CloseFullscreen = () => {
  if (document.exitFullscreen) {
    document.exitFullscreen();
  } else if (document.webkitExitFullscreen) { /* Safari */
    document.webkitExitFullscreen();
  } else if (document.msExitFullscreen) { /* IE11 */
    document.msExitFullscreen();
  }
}

// Validate and clos or open the full screen
const Execute_Fullscreen = () => {
    if (!window.screenTop && !window.screenY) {
        OpenFullscreen()
    }else{
        CloseFullscreen()
    }

}

// Execute any buttons with a cute alert 
const execute_function = (show, title, text, confirm, cancel,button) => {
    
    if(show){
        Swal.fire({
            title: title,
            html: text,
            icon: `warning`,
            showCancelButton: true,
            confirmButtonColor: `#3085d6`,
            cancelButtonColor: `#d33`,
            confirmButtonText: confirm,
            cancelButtonText: cancel
        }).then((result) => {
            if (result.isConfirmed) {
                if( $(`#${button}`).length){
                    $(`#${button}`).click()
                }else{
                    console.log(`error`)
                }
            }else{
                Swal.close()
            }
        })
    }else{

    }
}

// Set functionality when the context menu is clicked
$(`#primary-context-menu .item`).click((e) => {

    let action_target = e.target
    let action_context_id = $(action_target).hasClass(`item`) ? $(action_target).children(`.context-menu-option`).attr(`id`) : action_target.id
    // Validate when click in the rigth click menu the option and execute the function
    switch(action_context_id){
        case `context-menu-action-Home`     :   $(`#HOME_BUTTON`).click(); break;
        case `context-menu-action-Save`     :   SaveOption(); break;
        case `context-menu-action-Clear`    :   ClearOption(); break;
        case `context-menu-action-Query`    :   ActionQuery(); break;
        case `context-menu-action-EField`    :  OpenFieldExpand(field_expand_in_context); break;
        case `context-menu-action-Delete`   :   DeleteOption(); break;
        case `context-menu-action-Back`     :   history.back(); break;
        case `context-menu-action-Forward`  :   history.forward(); break;
        case `context-menu-action-Refresh`  :   location.reload(); break;
        case `context-menu-action-Full`     :   Execute_Fullscreen(); break;
        case `context-menu-action-Print`    :   window.print(); break;
        case `context-menu-action-Copy`     :   document.execCommand(`copy`); break;
        case `context-menu-action-Paste`    :   document.execCommand(`paste`); break;
    }
    contextMenu.classList.remove(`visible`);
})

/**
 * 
 * END SECTION CONTEXT MENU
 * 
 */


/**
 * 
 * SECTION ALERTS AND NOTIFICATIONS
 * 
 */
// ---
// Replace Apex Message :

// Style for nofification in the letf zone
const _left_alert = Swal.mixin({
    toast: true,
    position: `top-end`,
    showConfirmButton: false,
    timerProgressBar: true,
    timer: 3000,
    didOpen: (toast) => {
        toast.addEventListener(`mouseenter`, Swal.stopTimer)
        toast.addEventListener(`mouseleave`, Swal.resumeTimer)
    }
})

// Style for nofification in the rigth zone
const _rigth_alert = Swal.mixin({
    toast: true,
    position: `bottom-end`,
    showConfirmButton: false,
    didOpen: (toast) => {
        toast.addEventListener(`mouseenter`, Swal.stopTimer)
        toast.addEventListener(`mouseleave`, Swal.resumeTimer)
    }
})

// Style for question nofification when first need validate 
const _question_alert = Swal.mixin({
    icon: `warning`,
    showCancelButton: true,
    confirmButtonColor: `#1A984F`,
    cancelButtonColor: `#981818`,
})

// Style for succes notification
const ShowAlertPageSuccess = (mensaje) => {
    _left_alert.fire({
        icon: `success`,
        title: mensaje,
        width: CalculateWithAlert(mensaje)
    })
}

//Back to after page of the current page
const ResetPage = () =>{
    let urlSplit = location.href.split(`:`)
    urlSplit.splice(7, 10)
    location.replace(urlSplit.join(`:`) + `:::::`)
}

// Nofication with timer for user wait
var _finalTimer = ``
const AlertWaitTimer = (title, action) => {

    Swal.close()
    _finalTimer = ``
    let totalTimer = 0
    let timerInterval = null
    let points = []
    
    Swal.fire({
        title: title,
        html: `<p style="font-size: 24px">${action}<b id="points_loading"></b><br>Timer: <b id="timer_count"></b></p>`,
        timer: 1100,
        allowOutsideClick: false,
        didOpen: () => {
            Swal.showLoading()
            const b = Swal.getHtmlContainer().querySelector(`b`)
            timerInterval = setInterval(() => {
                Swal.increaseTimer(2000)  
                totalTimer = Swal.getTimerLeft()
                let timerFormat = new Date(`January 01, 0000 00:00:00:00`)
                timerFormat.setMilliseconds(totalTimer - 1000)
                _finalTimer = `${twoCharactersNumber(timerFormat.getHours())}:${twoCharactersNumber(timerFormat.getMinutes())}:${twoCharactersNumber(timerFormat.getSeconds())}` 
                if(points.length == 3){
                    points = [`.`]
                }else{
                    points.push(`.`)
                }
                try{
                    $(timer_count).text(_finalTimer)
                    $(points_loading).text(points.join(``))
                }catch{

                }
            }, 1000)
        },
        willClose: () => {
            clearInterval(timerInterval)
        }
    })

    return _finalTimer
}

// Close  All notifications in the screen
const CloseAllMessages = () => {
    Swal.close()
    apex.message.clearErrors()
}

// Refresh Materialize View in the db when the user need refresh the data
const RefreshMaterializeView = (view, ignore = false) => {

    view = view.toUpperCase()
    apex.server.process(`Refresh Materialize View`, { x01: view, x02: ignore ? `Y` : `N` }).then( (e) => {
        if(!e.refresh){
            Swal.fire({
                title: `Are you sure?`,
                text: `Estimated Time: ` + e.duration.replace(`+000000000 `, ``),
                icon: `warning`,
                showCancelButton: true,
                reverseButtons: true,
                confirmButtonText: `Yes, refresh now!`,
                cancelButtonText: `No, cancel!`
            }).then((r) => {
                // console.log(r)
                if (r.isConfirmed) {
                    
                    _finalTimer = ``
                    let totalTimer = 0
                    let timerInterval = null
                    let points = []
                    Swal.fire({
                        title: `Please Wait`,
                        html: `<p style="font-size: 24px">Refreshing<b id="points_loading"></b><br>Timer: <b id="timer_count"></b></p>`,
                        timer: 1100,
                        allowOutsideClick: false,
                        didOpen: () => {
                            Swal.showLoading()
                            const b = Swal.getHtmlContainer().querySelector(`b`)
                            timerInterval = setInterval(() => {
                                Swal.increaseTimer(2000)  
                                totalTimer = Swal.getTimerLeft()
                                let timerFormat = new Date(`January 01, 0000 00:00:00:00`)
                                timerFormat.setMilliseconds(totalTimer - 1000)
                                _finalTimer = `${twoCharactersNumber(timerFormat.getHours())}:${twoCharactersNumber(timerFormat.getMinutes())}:${twoCharactersNumber(timerFormat.getSeconds())}` 
                                if(points.length == 3){
                                    points = [`.`]
                                }else{
                                    points.push(`.`)
                                }
                                $(timer_count).text(_finalTimer)
                                $(points_loading).text(points.join(``))
                            }, 1000)
                        },
                        willClose: () => {
                            clearInterval(timerInterval)
                        }
                    }).then((result) => {
                    if (result.dismiss === Swal.DismissReason.timer) {
                        // console.log(`finish`)
                    }
                    })

                    apex.server.process(`Refresh Materialize View`, { x01: view, x02: `Y` }).then( (f) => {
                        Swal.close()
                        // console.log(f)
                        if(f.refresh){
                            Swal.fire( `Successful`, `The view ` + f.view + ` has been Refreshed!<br>total time: ${_finalTimer}`, `success` )
                        }else{
                            Swal.fire( `Error!`, `The view ` + f.view + ` has not been Refreshed!`, `success` )
                        }
                    })
                }else{
                    
                }
            })
        }else{
             Swal.fire(
                `Successful`,
                `The view ` + view + ` Has Been Refreshed!`,
                `success`
            )
        }
        
    }).fail((e) => {
        apex.message.clearErrors()
        // console.log(e.responseText)
          Swal.fire(
                `Error!`,
                `The view ` + view + ` not found!`,
                `error`
            )
    })
}

// Calculate the alert with for dynamic notifications 
const CalculateWithAlert = (text) => {
    return (text.length * 4.5) + 400
}

// Replace Apex Alert for custom alert
apex.message.alert = (text, title) => {
    console.log("[ERROR] apex.message.alert:", text, title)
    if(text.includes(`Server-Side Code`)) text = text.substr(text.indexOf(`ORA-`) ).replace(`for Execute Server-Side Code.`, ``);
    Swal.fire(title, text)
}

/**
 * 
 * END SECTION ALERTS AND NOTIFICATIONS
 * 
 */

/**
 * 
 * SECTION FUNCTIONS AND FORMATS
 * 
 */

// Return any number for format ##
const twoCharactersNumber = (d) => {
    return (d < 10) ? `0` + d.toString() : d.toString();
}

// Get the network ip for audit
let client_ip
const GetCurrentIp = () =>{
    // $.ajax({
    //     url: `https://api.ipify.org/?format=json`
    // }).then((e)=>{
    //     client_ip = e.ip
    // })
}

// Get specific parameter in the url by &
const GetUrlParameter = (sParam) => {
    var sPageURL = window.location.search.substring(1),
        sURLVariables = sPageURL.split(`&`),
        sParameterName,
        i;

    for (i = 0; i < sURLVariables.length; i++) {
        sParameterName = sURLVariables[i].split(`=`);

        if (sParameterName[0] === sParam) {
            return sParameterName[1] === undefined ? true : decodeURIComponent(sParameterName[1]);
        }
    }
    return false;
};

// Get Parameters in Url with &
const GetUrlParameters = () => {
    return window.location.search.substring(1).split(`&`);
};

// Convert a base64 to pdf file for generate oracle reports from oracle apex
const DownloadBase64PDF = (pdf, fileName) => {
    const linkSource = `data:application/pdf;base64,${pdf}`;
    const downloadLink = document.createElement(`a`);
    downloadLink.href = linkSource;
    downloadLink.download = fileName;
    downloadLink.click();
}

// Convert a base64 to any file type and download to client 
const DownloadBase64 = (base64_file, fileName) => {
    let data_type = `application/pdf`
    let extension = fileName.split(`.`).pop()
    switch(extension){
        case `aac`    : data_type = `audio/aac`; break;
        case `abw`    : data_type = `application/x-abiword`; break;
        case `arc`    : data_type = `application/x-freearc`; break;
        case `avif`   : data_type = `image/avif`; break;
        case `avi`    : data_type = `video/x-msvideo`; break;
        case `azw`    : data_type = `application/vnd.amazon.ebook`; break;
        case `bin`    : data_type = `application/octet-stream`; break;
        case `bmp`    : data_type = `image/bmp`; break;
        case `bz`     : data_type = `application/x-bzip`; break;
        case `bz2`    : data_type = `application/x-bzip2`; break;
        case `cda`    : data_type = `application/x-cdf`; break;
        case `csh`    : data_type = `application/x-csh`; break;
        case `css`    : data_type = `text/css`; break;
        case `csv`    : data_type = `text/csv`; break;
        case `doc`    : data_type = `application/msword`; break;
        case `docx`   : data_type = `application/vnd.openxmlformats-officedocument.wordprocessingml.document`; break;
        case `eot`    : data_type = `application/vnd.ms-fontobject`; break;
        case `epub`   : data_type = `application/epub+zip`; break;
        case `gz`     : data_type = `application/gzip`; break;
        case `gif`    : data_type = `image/gif`; break;
        case `htm`    : data_type = `text/html`; break;
        case `ico`    : data_type = `image/vnd.microsoft.icon`; break;
        case `ics`    : data_type = `text/calendar`; break;
        case `jar`    : data_type = `application/java-archive`; break;
        case `jpeg`   : data_type = `image/jpeg`; break;
        case `js`     : data_type = `text/javascript`; break;
        case `json`   : data_type = `application/json`; break;
        case `jsonld` : data_type = `application/ld+json`; break;
        case `mid`    : data_type = `audio/x-midi`; break;
        case `mjs`    : data_type = `text/javascript`; break;
        case `mp3`    : data_type = `audio/mpeg`; break;
        case `mp4`    : data_type = `video/mp4`; break;
        case `mpeg`   : data_type = `video/mpeg`; break;
        case `mpkg`   : data_type = `application/vnd.apple.installer+xml`; break;
        case `odp`    : data_type = `application/vnd.oasis.opendocument.presentation`; break;
        case `ods`    : data_type = `application/vnd.oasis.opendocument.spreadsheet`; break;
        case `odt`    : data_type = `application/vnd.oasis.opendocument.text`; break;
        case `oga`    : data_type = `audio/ogg`; break;
        case `ogv`    : data_type = `video/ogg`; break;
        case `ogx`    : data_type = `application/ogg`; break;
        case `opus`   : data_type = `audio/opus`; break;
        case `otf`    : data_type = `font/otf`; break;
        case `png`    : data_type = `image/png`; break;
        case `pdf`    : data_type = `application/pdf`; break;
        case `php`    : data_type = `application/x-httpd-php`; break;
        case `ppt`    : data_type = `application/vnd.ms-powerpoint`; break;
        case `pptx`   : data_type = `application/vnd.openxmlformats-officedocument.presentationml.presentation`; break;
        case `rar`    : data_type = `application/vnd.rar`; break;
        case `rtf`    : data_type = `application/rtf`; break;
        case `sh`     : data_type = `application/x-sh`; break;
        case `svg`    : data_type = `image/svg+xml`; break;
        case `tar`    : data_type = `application/x-tar`; break;
        case `tif`    : data_type = `image/tiff`; break;
        case `ts`     : data_type = `video/mp2t`; break;
        case `ttf`    : data_type = `font/ttf`; break;
        case `txt`    : data_type = `text/plain`; break;
        case `vsd`    : data_type = `application/vnd.visio`; break;
        case `wav`    : data_type = `audio/wav`; break;
        case `weba`   : data_type = `audio/webm`; break;
        case `webm`   : data_type = `video/webm`; break;
        case `webp`   : data_type = `image/webp`; break;
        case `woff`   : data_type = `font/woff`; break;
        case `woff2`  : data_type = `font/woff2`; break;
        case `xhtml`  : data_type = `application/xhtml+xml`; break;
        case `xls`    : data_type = `application/vnd`; break;
        case `xlsx`   : data_type = `application/vnd`; break;
        case `xml`    : data_type = `application/xml`; break;
        case `xul`    : data_type = `application/vnd.mozilla.xul+xml`; break;
        case `zip`    : data_type = `application/zip`; break;
        case `3gp`    : data_type = `audio/3gpp`; break;
        case `3g2`    : data_type = `audio/3gpp2`; break;
        case `7z`     : data_type = `application/x-7z-compressed`; break;
    }
    const linkSource = `data:${data_type};base64,${base64_file}`;
    const downloadLink = document.createElement(`a`);
    downloadLink.href = linkSource;
    downloadLink.download = fileName;
    downloadLink.click();
}

// Validate items and show error message 
var valid_items = true
const ValidateItem = (item, message) => {
    if(!$v(item) && valid_items) {
        valid_items = false
        Swal.close()
        Swal.fire(``, message);  
        $(`#${item}`).focus()
    } else {
        valid_items = true
    }
}

// Get the format currency in EN/US
const formatter_currency = new Intl.NumberFormat(`en-US`, {
  style: `currency`,
  currency: `USD`,
});

// Repeat many times a function
const ExecuteMultipleFunction = (fun, exc = false) => {    
    setTimeout(fun(), 100)
    setTimeout(fun(), 200)
    setTimeout(fun(), 300)
    setTimeout(fun(), 400)
    setTimeout(fun(), 500)
    setTimeout(fun(), 600)
    setTimeout(fun(), 700)
    setTimeout(fun(), 800)
    setTimeout(fun(), 900)
    setTimeout(fun(), 1000)
    setTimeout(fun(), 1500)
    setTimeout(fun(), 2000)
    setTimeout(fun(), 2500)
    if(exc){
        setTimeout(fun(), 2500)
        setTimeout(fun(), 2600)
        setTimeout(fun(), 2700)
        setTimeout(fun(), 2800)
        setTimeout(fun(), 2900)
        setTimeout(fun(), 3000)
        setTimeout(fun(), 3100)
        setTimeout(fun(), 3200)
        setTimeout(fun(), 3300)
        setTimeout(fun(), 3400)
        setTimeout(fun(), 3500)
    }
    // setTimeout(fun(), 4000)
}

//Open Modal Page With Parameters
const OpenModalPage = (id, parameters) => {
    apex.server.process(`Prepare Url`, {x01: id, x02: parameters}).then((e) =>{
        eval(e.url)
    })
}

// Set an input expanded for text 

let field_expand_to_submit = ``
let field_expand_in_context = ``
let field_file_manager_to_submit = ``

// Open field textarea for expand in a big window 
const OpenFieldExpand = (item) => {
    apex.item(`FIELD_EXPAND`).node.focus()
    let max_length = $(`#${item}`).attr(`maxlength`)
    $(`textarea.FIELD_EXPAND`).attr(`maxlength`, max_length)
    $(`textarea.FIELD_EXPAND`).attr(`data-max-char`, max_length)
    $(`#FIELD_EXPAND_CHAR_COUNT .apex-item-textarea-counter--size`).text(max_length)
    $(`textarea.FIELD_EXPAND`).val(apex.item(item).getValue())
    field_expand_to_submit = item
    field_expand.style.display = `block`
    apex.item(`FIELD_EXPAND`).node.focus()
}

// Close field expanded textarea and return in the normal field
const CloseFieldExpand = () => {
    field_expand.style.display = `none`;
    apex.item(field_expand_to_submit).setValue(apex.item(`FIELD_EXPAND`).getValue())
    apex.item(field_expand_to_submit).node.focus()
    apex.item('FIELD_EXPAND').setValue(``)
    field_expand_to_submit = ``
}

/**
 * 
 * END SECTION FUNCTIONS AND FORMATS
 * 
 */

/**
 * 
 * SECTION REPORTS AND GRIDS MANAGER
 * 
 */

let id_grid = ``
let prefix_grid = ``

class Option_refresh_query {
  constructor(view) {
    this.id = `refresh_query`,
    this.label = `Refresh Query`,
    this.type = `action`,
    this.hide = false,
    this.icon = `fa fa-refresh fa-anim-spin`,
    this.action = () => { RefreshMaterializeView(view, false) }
  }

  introduce() {
    console.log(`Hello, my name is ${this.name}`);
  }
}

const option_separator = {
    "type": "separator"
}

const option_template = {
    "id": "template_option",
    "type": "action",
    "label": "template option",
    "hide": false,
    "icon": "fa fa-emoji-love fa-anim-spin",
    "action" : () => { console.log('this is a template option xd') }
}

const SetCtrlBreak = (id, value) => {    
    try{
        // Filtro de control break en interactive grid
        if(!$(`#${id} a[data-setting="controlBreak"]:contains("${value}")`).length){
            apex.region(id).widget().interactiveGrid("getActions").invoke(`show-control-break-dialog`)
            apex.item(`${id}_ig_CBD_COLUMN`).setValue(
                apex.item(`${id}_ig_CBD_COLUMN`).element.children().filter((i, e) => e.label == value).val()
            )
            $(`#${id}_ig_control_break_dialog`).parent().children().children().children(`button:contains("Save")`).click()
        }
    }catch{
        try{
            // Filtro de control break en interactive reports
            if(!$(`#control_text_${value}`).length){
                $(`#${id}_actions_menu`).menu("find", "irCtrlBreak").action();
                setTimeout(() =>{
                    apex.item(`${id}_column_01`).setValue(value)
                    $(`.a-IRR-dialog--controlBreak[aria-describedby="${id}_dialog_js"] button:contains("Apply")`)
                    .click()
                }, 2500)
            }
        }catch{
            alert('Error en el filtro')
        }
    }
}

const SetYearFilter = (id) => {
    //Se necesita un check box group para llamado P###_YEARS_REPLACE con el LOV de los años
    //Y un escondido llamado P###_YEAR

    let menuY = $(apex.item(`P${$v('pFlowStepId')}_YEARS_REPLACE`).node).children().find('input').map((i, e) => {
        return { type:"action", icon: `fa ${$v(`P${$v('pFlowStepId')}_YEAR`) == e.value ? 'fa-angle-double-right' : ''}`, label: e.value, action: () => {
                apex.item(`P${$v('pFlowStepId')}_YEAR`).setValue(e.value)
            }
        }
    })

    Array.prototype.reverse.call(menuY)

    try{
        $(`#${id}_ig_toolbar_actions_button_menu`).menu("option").items.splice(3,0,
        { type:"subMenu", id: 'years_submenu', labelKey: 'Year filter', icon: 'fa fa-calendar-search', menu :  { items: menuY } })
    }catch{
        $(`#${id}_actions_menu`).menu("option").items.splice(3,0,
        { type:"subMenu", id: 'years_submenu', labelKey: 'Year filter', icon: 'fa fa-calendar-search', menu :  { items: menuY } })
    }
    

}

const SetExtraCtrlBreak = (id, value) => {
    if(!$(`#${id} a[data-setting="controlBreak"]:contains("${value}")`).length){ 
        apex.region(id).widget().interactiveGrid("getActions").invoke(`show-control-break-dialog`)
        $(`#${id}_ig_control_break_dialog button[data-action="insert-record"]`).click()
        apex.item(`${id}_ig_CBD_COLUMN`).setValue(
            apex.item(`${id}_ig_CBD_COLUMN`).element.children().filter((i, e) => e.label == value).val()
        )
        $(`#${id}_ig_control_break_dialog`).parent().children().children().children(`button:contains("Save")`).click()
    }
}

/**
 *
 * 
 * let option = option_template

    option.id = 'refresh_query'
    option.label = 'Refresh Query'
    option.icon = 'fa fa-refresh fa-anim-spin'

    let id_report = ``

    id_report = `STD_REPORT`
    option.action = () => { RefreshMaterializeView('mVlc_On_Ti_De_Quarter', false) }
    AddOptionToMenu('IR', id_report, 9, option_template )
    AddOptionToMenu('IR', id_report, 9, option_separator )
 * 
 *   */

const AddOptionToMenu = (type, id, ubi, option, parent) => {
    if(type == 'IR'){
        $(`#${id}_actions_menu`).menu("option").items.splice(ubi, 0, option)
    }else if(type == 'IG'){
        $(`#${id}_ig_toolbar_actions_button_menu`).menu("option").items.splice(ubi, 0, option)
    }
    
    // console.log(id, type, parent, ubi, option, this)
}

const Calculate_Totals = (id) => {
    let data_report = apex.region(id).widget().interactiveGrid(`getViews`, `grid`).model._data
    let totals = []
    for (let r = 0; r < data_report.length; r++) {
        for (let i = 0; i < data_report[r].length; i++) {
            if(data_report[r][i]){
                try {
                    let total_row = parseFloat(data_report[r][i].trim().replaceAll(',', ''))
                    if(total_row){
                        if(!totals[i]) totals[i] = 0;
                        totals[i] += total_row 
                    }else{
                        
                    }
                }catch{}
            }
        }
    }
    for (let i = 1; i < totals.length; i++) {
        if(totals[i]){
            $(`#${id} tr[data-rownum="${data_report.length}"] td`).eq(i).text(formatter_currency.format(totals[i]).replace('$', ''))
        }else{
            $(`#${id} tr[data-rownum="${data_report.length}"] td`).eq(i).text('-')
        }
    }
}

// When page rezise or is initialized the grid set dynamic pagination
const  RezisePaginationGrid = (id, h, e) => {
    let records_count = Math.round(( (window.innerHeight - h - e) / $(`.a-GV-cell`).eq(0).parent().height() ) ) // Calulate the size of the grids and
    let grid = apex.region(id).widget().interactiveGrid(`getActions`).lookup(`change-rows-per-page`) // get the option row per page for change the value calculated
    // if(records_count != grid.get()){ // validate if the records count is already the value calulated
        grid.set( records_count ) // Set the new rows per page
    // }
}

// Automatic reset pagination in interactive grid
const ResetPaginationGrid = () => {
    let ResetPaginationGridFunction = () =>{
        if(!$(`.a-IRR-pagination-reset`).length){
            $(`.a-IRR-pagination-reset`).click()
        }
    }
    setTimeout(ResetPaginationGridFunction(), 100)
    setTimeout(ResetPaginationGridFunction(), 200)
    setTimeout(ResetPaginationGridFunction(), 300)
    setTimeout(ResetPaginationGridFunction(), 400)
    setTimeout(ResetPaginationGridFunction(), 500)
    setTimeout(ResetPaginationGridFunction(), 600)
    setTimeout(ResetPaginationGridFunction(), 700)
    setTimeout(ResetPaginationGridFunction(), 800)
    setTimeout(ResetPaginationGridFunction(), 900)
    setTimeout(ResetPaginationGridFunction(), 1000)
    setTimeout(ResetPaginationGridFunction(), 1500)
    setTimeout(ResetPaginationGridFunction(), 2000)
    setTimeout(ResetPaginationGridFunction(), 2500)
}

// Set data details to interactive grid for combine forms and grids
const SetDataDetails = (grid, prefix) => {

    let grid_details = apex.region(grid).widget().interactiveGrid(`getViews`, `grid`).getSelectedRecords()
    let grid_details_columns = apex.region(grid).widget().interactiveGrid(`getViews`, `grid`).getColumns()

    if(!grid_details.length) grid_details.push( grid_details_columns.map((e) => { return '' } ) )
    console.log(grid_details)
    grid_details_columns.forEach((e, i) => {
        try{
            if($(`#P${$v(`pFlowStepId`)}_${prefix}_${e.property}`).length){
                if(grid_details[0][e.index].v){
                    apex.item(`P${$v(`pFlowStepId`)}_${prefix}_${e.property}`).setValue(grid_details[0][e.index].v)    
                }else{
                    apex.item(`P${$v(`pFlowStepId`)}_${prefix}_${e.property}`).setValue(grid_details[0][e.index])    
                }
            }
        }catch{
        }
    })
}

const SetDetailsData = (item) => {
    let model = apex.region(id_grid).widget().interactiveGrid(`getViews`, `grid`).model
    if(model.getSelectedRecords().length) model.setValue(model.getSelectedRecords()[0],item.currentTarget.id.replaceAll(`P${$v('pFlowStepId')}_${prefix_grid}_`, ''), item.currentTarget.value)
}

const ClearAllFields = () => {
     Object.entries(apex.items).filter(e => 
        Object.entries(e)[0][1].startsWith(`P${$v(`pFlowStepId`)}`)
        && !Object.entries(e)[0][1].startsWith(`P${$v(`pFlowStepId`)}_TITLE`)
    ).forEach(([key, value]) => {
        try{
            // console.log(`${key}`)
            apex.item(`${key}`).setValue('')
        }catch{
            // console.log(`${key}`)
        }
    });
}

const ClearInteractiveGrid = (id) => {
    let grid = apex.region(id).widget().interactiveGrid(`getViews`).grid
    grid.model._data = []
    grid.refresh()
}

/**
 * 
 * END SECTION REPORTS MANAGER
 * 
 */


/**
 * 
 * SECTION API LIMSSERVICE
 * 
 */

// Global Variables
const lims_web_service = `http://10.1.1.7:55/limsservice/`
const db_url = '10.1.1.196'
const db_sid = 'xtlims'
// const lims_web_service = ``
// const db_url = ''
// const db_sid = ''

var limsservice_file_browser
var close_limsservice_modal

limsApi = {}
limsApi.login = {}
limsApi.fileManager = {}

// Login web service for get the token
limsApi.login.getToken = (cred) => {
    // $.ajax({
    //     url: `${lims_web_service}/api/login/authenticate`,
    //     type: `post`,
    //     data: cred
    // }).then((t) =>{
    //     localforage.setItem('token', t)
    // }).fail((message) => {
    //     console.log(message)
    // })
}

// consume web service for get all files in and specific directory, it's used for file browser with files in the web service
limsApi.fileManager.getContentPath = (path) => {
    // localforage.getItem('token').then((t) => {
    //     $.ajax({
    //         url: `${lims_web_service}/api/transfer/getAllDirectories`,
    //         type: `post`,
    //         headers: {"Authorization": t},
    //         data: {
    //             "FinalPath" : path
    //         }
    //     }).then((files) => {
    //         limsApi.fileManager.files = files
    //     }).fail((message) => {
    //         console.log(message)
    //     })
    // })
}

// consume limsservice for deleteing files
limsApi.fileManager.deleteFile = (path) => {
    // Swal.fire({
    //     title: `Are you sure?`,
    //     text: `Delete file ${path}`,
    //     icon: `warning`,
    //     showCancelButton: true,
    //     reverseButtons: true,
    //     confirmButtonText: `Yes, delete now!`,
    //     cancelButtonText: `No, cancel!`
    // }).then((r) => {
    //     // console.log(r)
    //     if (r.isConfirmed) {    
    //         localforage.getItem('token').then((t) => {
    //             $.ajax({
    //                 url: `${lims_web_service}/api/transfer/deletefile`,
    //                 type: `post`,
    //                 headers: {"Authorization": t},
    //                 data: {
    //                     "FullPath" : path
    //                 }
    //             }).then((response) => {
    //                 limsApi.fileManager.getContentPath(`C:\\Temp\\`)
    //                 Swal.fire(response == `true` ? `File deleted` : response, ``, response == `true` ? `success` : `warning` )
    //             }).fail((message) => {
    //                 console.log(message)
    //             })
    //         })
    //     }else{
    //         Swal.file('operation cancelled')
    //     }
    // })
   

}

// consume limsservice for return base64 file and download file with js
limsApi.fileManager.download = (finalPath) => {
    // fileName = finalPath.replace(/^.*[\\\/]/, '')
    // localforage.getItem('token').then((t) => {
    //     $.ajax({
    //         url: `${lims_web_service}/api/transfer/getFile`,
    //         type: `post`,
    //         headers: {"Authorization": t},
    //         data: {
    //             "FinalPath": finalPath
    //         }
    //     }).then((b64) => {
    //         if(b64.includes(`The file `)){
    //             Swal.fire("Error", b64, "warning")
    //         }else{
    //             // console.log(`downloading... `, b64, fileName)
    //             DownloadBase64(b64, fileName);
    //             // switch(fileName.split(`.`).pop()){
    //             //     case `pdf`: 
    //             //         DownloadBase64PDF(b64, fileName)
    //             //         break;
    //             // }
    //         }
    //     }).fail((message) => {
    //         console.log(message)
    //     })    
    // })
}

// Invoce the file browser with files in the wel service
limsApi.fileManager.invoke = (path, item_value) => {
    
    if(!path) path = `C:\\Temp\\`
    file_input_modal.val(path)
    let current_files = limsApi.fileManager.files
    let search_path = path.split(`\\`).filter((item_path) => item_path != ``)
    for(i = 0; i <= search_path.length - 1; i++){
        current_files = current_files.filter((file) => file.split(`\\`)[i] == search_path[i]  )
    }

    let files_filtered = (current_files.map((file) => {
        let file_split = file.split(`\\`)
        if(file_split.length == search_path.length + 1)
        return file;
    })).filter(e => e != undefined)

    $(`#limsservice-file-browser .modal-content`).html(``)

    $(`#limsservice-file-browser .modal-content`).html(``)
    console.log(`files_filtered`, files_filtered)
    /* let file_elements =  */
    files_filtered.map((file) => {
        let extension_file = file.split(`.`).pop().toLowerCase()
        // console.log(extension_file, file)
        if (extension_file == file.toLowerCase()) icon_file = `fa-folders` 
        switch(extension_file){
            case `aac`    : icon_file = `fa-file-audio-o`; break;
            case `abw`    : icon_file = ``; break;
            case `arc`    : icon_file = ``; break;
            case `avif`   : icon_file = `fa-file-image-o`; break;
            case `avi`    : icon_file = `fa-file-video-o`; break;
            case `azw`    : icon_file = ``; break;
            case `bin`    : icon_file = ``; break;
            case `bmp`    : icon_file = `fa-file-image-o`; break;
            case `bz`     : icon_file = `fa-file-archive-o`; break;
            case `bz2`    : icon_file = `fa-file-archive-o`; break;
            case `cda`    : icon_file = ``; break;
            case `csh`    : icon_file = ``; break;
            case `css`    : icon_file = `fa-file-code-o`; break;
            case `csv`    : icon_file = `fa-file-csv-o`; break;
            case `doc`    : icon_file = `fa-file-word-o`; break;
            case `docx`   : icon_file = `fa-file-word-o`; break;
            case `eot`    : icon_file = ``; break;
            case `epub`   : icon_file = `fa-file-archive-o`; break;
            case `gz`     : icon_file = `fa-file-archive-o`; break;
            case `gif`    : icon_file = `fa-file-image-o`; break;
            case `htm`    : icon_file = `fa-file-code-o`; break;
            case `ico`    : icon_file = `fa-file-image-o.microsoft.icon`; break;
            case `ics`    : icon_file = ``; break;
            case `jar`    : icon_file = `fa-file-code-o`; break;
            case `jpeg`   : icon_file = `fa-file-image-o`; break;
            case `js`     : icon_file = `fa-file-code-o`; break;
            case `json`   : icon_file = `fa-file-json-o`; break;
            case `jsonld` : icon_file = `fa-file-json-o`; break;
            case `mid`    : icon_file = `fa-file-audio-o-midi`; break;
            case `mjs`    : icon_file = `fa-file-code-o`; break;
            case `mp3`    : icon_file = `fa-file-audio-o`; break;
            case `mp4`    : icon_file = `fa-file-video-o`; break;
            case `mpeg`   : icon_file = `fa-file-video-o`; break;
            case `mpkg`   : icon_file = ``; break;
            case `odp`    : icon_file = ``; break;
            case `ods`    : icon_file = ``; break;
            case `odt`    : icon_file = ``; break;
            case `oga`    : icon_file = `fa-file-audio-o`; break;
            case `ogv`    : icon_file = `fa-file-video-o`; break;
            case `ogx`    : icon_file = ``; break;
            case `opus`   : icon_file = `fa-file-audio-o`; break;
            case `otf`    : icon_file = ``; break;
            case `png`    : icon_file = `fa-file-image-o`; break;
            case `pdf`    : icon_file = `fa-file-pdf-o`; break;
            case `php`    : icon_file = `fa-file-powerpoint-o`; break;
            case `ppt`    : icon_file = `fa-file-powerpoint-o`; break;
            case `pptx`   : icon_file = `fa-file-powerpoint-o`; break;
            case `rar`    : icon_file = `fa-file-archive-o`; break;
            case `rtf`    : icon_file = ``; break;
            case `sh`     : icon_file = ``; break;
            case `svg`    : icon_file = `fa-file-image-o`; break;
            case `tar`    : icon_file = ``; break;
            case `tif`    : icon_file = `fa-file-image-o`; break;
            case `ts`     : icon_file = `fa-file-video-o`; break;
            case `ttf`    : icon_file = ``; break;
            case `txt`    : icon_file = `fa-file-text-o`; break;
            case `vsd`    : icon_file = ``; break;
            case `wav`    : icon_file = `fa-file-audio-o`; break;
            case `weba`   : icon_file = `fa-file-audio-o`; break;
            case `webm`   : icon_file = `fa-file-video-o`; break;
            case `webp`   : icon_file = `fa-file-image-o`; break;
            case `woff`   : icon_file = ``; break;
            case `woff2`  : icon_file = ``; break;
            case `xhtml`  : icon_file = `fa-file-code-o`; break;
            case `xls`    : icon_file = `fa-file-excel-o`; break;
            case `xlsx`   : icon_file = `fa-file-excel-o`; break;
            case `xml`    : icon_file = `fa-file-code-o`; break;
            case `xul`    : icon_file = `fa-file-code-o`; break;
            case `zip`    : icon_file = `fa-file-archive-o`; break;
            case `3gp`    : icon_file = `fa-file-audio-o`; break;
            case `3g2`    : icon_file = `fa-file-audio-o`; break;
            case `7z`     : icon_file = `fa-file-archive-o`; break;
            case `sql`    : icon_file = `fa-file-sql-o`; break;
        }
        file_path = file.split(`\\`)
        $(`#limsservice-file-browser .modal-content`).append(`
            <div class="modal-file" file-path="${file}" >
                <div class="modal-icon-file" >
                    <center>
                    <span aria-hidden="true" class="fa ${icon_file ? icon_file : `fa-file-o`} fa-4x"></span>
                    </center>
                </div>
                <div class="modal-file-name" >
                    <center>
                    <b class="modal-file-text">
                        ${file_path[file_path.length - 1]}
                    </b>
                    </center>
                </div>
            </div>
            
            
        `)
    })

    if(item_value) {
        field_file_manager_to_submit = item_value;
        $(`#btnSetItemToSubmitFileBrowser`).attr(`disabled`, false)
    }else{
        $(`#btnSetItemToSubmitFileBrowser`).attr(`disabled`, true)
    }

    limsservice_file_browser.style.display = `block`;

}

// Selector files in the file browser
const SelectFilePath = (card_file, open) => {
    if(card_file.length){
        path = card_file.attr('file-path')
        file_input_modal.val(path)
        if( open && !/(\.[a-z0-9]{2,5})$/i.test(path) ) limsApi.fileManager.invoke(path)
    }
}

const BeforePath = () => {
    let path = file_input_modal.val().split('\\')
    path.pop()
    limsApi.fileManager.invoke(path.join('\\'))
}

// function modal file browser download the file selected
const DownloadFileByPath = () => {
    let path = file_input_modal.val()
    // Validate if the path is ok
    if(/(\.[a-z0-9]{2,5})$/i.test(path))
        limsApi.fileManager.download(path)
}

// Set new value when press ok button in file browser
const SetItemToSubmitFileBrowser = () => {
    if(field_file_manager_to_submit) apex.item(field_file_manager_to_submit).setValue(file_input_modal.val())
    limsservice_file_browser.style.display = `none`;
    field_file_manager_to_submit = ``
}

$('.modal-content').click((e) => {
    console.log(e)
    SelectFilePath($(e.target).parents('.modal-file'), false )
})

$('.modal-content').dblclick((e) => {
    SelectFilePath($(e.target).parents('.modal-file'), true )
})


// limsApi.email.sendEmail = () => {
    
// }


/**
 * 
 * END SECTION API LIMSSERVICE
 * 
 */

// Juan David Castaño Usuga 2022


/**
 * 
 * SECTION QUERY DATA
 * 
 */

// Return any number for format ##
const xmlQueryToJson = (query) => {
    return new X2JS().xml2json(new X2JS().parseXmlString(query)).ROWSET
}


const query_data = {}

query_data.query_prepared = false

query_data.execute_query = (query_script, function_query) => {
    apex.server.process(`Execute Query`, {x01: query_script}).then((query_reponse) =>{
        function_query(xmlQueryToJson(query_reponse.query_result).query_result)
    })
}

query_data.query_items_to_upload = () => {
    return new Promise((resolve, reject) => {
        query_data.execute_query(`
            Select Name, Source, Data_Type, Query_Table, Edit_Operations From Apex_Pages_Regions_Items, Apex_Pages_Regions 
            Where  Item_Source_Plug_Id = Apex_Pages_Regions.Id And Apex_Pages_Regions_Items.Flow_Step_Id = ${$v(`pFlowStepId`)} And Apex_Pages_Regions_Items.Flow_Id = ${$v(`pFlowId`)}`
            , (data) => {
            resolve(data.filter(e => Object.keys(apex.items).map( item_page => item_page).indexOf(e.NAME) != -1 ))
        })
    })
}

query_data.get_operations_by_source = () => {
    return new Promise((resolve, reject) => {
        query_data.execute_query(`
            Select Query_Table, Edit_Operations From Apex_Pages_Regions 
            Where  Apex_Pages_Regions.Flow_Step_Id = ${$v(`pFlowStepId`)} And Apex_Pages_Regions.Flow_Id = ${$v(`pFlowId`)}`
            , (data) => {
            resolve(data.filter(e => Object.keys(apex.items).map( item_page => item_page).indexOf(e.NAME) != -1 ))
        })
    })
}

query_data.prepareQuery = () => {
    /*
    SINGLE_CHECKBOX
    OJ-INPUT-DATE
    NUMBER
    TEXT
    TEXTAREA
    HIDDEN
    DISPLAY_SAVES_STATE
    RADIO_GROUP
    POPUP_LOV
    */

    _question_alert.fire({
        title: "Are you sure to prepare query?",
        // html: "prepare",
        icon: `warning`,
        confirmButtonText: "Prepare Query",
        cancelButtonText: "Cancel"
    }).then((result) => {
        if (result.isConfirmed) {
            apex.model.list().forEach((r) => {
                ClearInteractiveGrid(r.replace(`_grid`, ``))
            })

            Object.keys(apex.items).forEach((e, i) => {
                let div_item = $(apex.items[e].node).parent()
                if(div_item.children(`div:not(.itemContainer)`).length && apex.item(e).getValue()){
                    apex.item(e).setValue(``)
                }
            })

            Object.keys(apex.items).forEach((e, i) => {
                // let item_type = (apex.items[e].node).parent().children(`div:not(.itemContainer)`)
                // if(item_type.length){
                
                // }
                let div_item = $(apex.items[e].node).parent()
                if(div_item.children(`div:not(.itemContainer)`).length){
                    // apex.item(e).setValue()
                    let find_enchaced_lov = div_item.find(`.pretius--enhancedLovItem`)
                    if(find_enchaced_lov.length == 1){
                        // $(find_enchaced_lov).addClass(`apex-item-lov-modal-prepare-query`)
                        // $(find_enchaced_lov).removeClass(`pretius--enhancedLovItem`)
                        // $(find_enchaced_lov).attr(`contenteditable`, true)
                        // $(find_enchaced_lov).attr(`item-query`, e)
                        // div_item.find(`.a-Button.a-Button--popupLOV`).hide()
                    }
                }else{
                    $(`#${e}`).val(``)
                    console.log(div_item.find(`input`))
                }
            })

            $(`div:has(.apex-item-lov-modal-prepare-query) .a-Button.a-Button--popupLOV`).hide()
            ExecuteMultipleFunction(() => {
                $(`div:has(.apex-item-lov-modal-prepare-query) .a-Button.a-Button--popupLOV`).hide()
            })
            $(`input[readonly]`).addClass(`readonly-item-prepare-query`)
            $(`input[readonly]`).attr(`readonly`, false)
            $(`#context-menu-action-Query`).html(`<span class="context-menu-icon fa fa-database-ban" aria-hidden="true"></span>Cancel Query` )
            query_data.query_prepared = true
        }else{
            Swal.close()
        }
    })

}

query_data.cancelQuery = () => {
    ClearAllFields()
    apex.model.list().forEach((r) => {
        ClearInteractiveGrid(r.replace(`_grid`, ``))
    })
    $(`.apex-item-lov-modal-prepare-query`).map((i, e) => {
        // $(e).html($(e).html().replaceAll($(e).text(), ``))
    })
    $(`.readonly-item-prepare-query`).attr(`readonly`, true)
    $(`.apex-item-lov-modal-prepare-query`).addClass(`pretius--enhancedLovItem`)
    $(`.apex-item-lov-modal-prepare-query`).attr(`contenteditable`, false)
    $(`div:not(.itemContainer):has(.apex-item-lov-modal-prepare-query)`).find(`.a-Button.a-Button--popupLOV:not(.a-Button--ajaxIndicator):has(.fa.fa-list-ul)`).show()
    $(`.apex-item-lov-modal-prepare-query`).removeClass(`apex-item-lov-modal-prepare-query`)
    $(`#context-menu-action-Query`).html(`<span class="context-menu-icon fa context-menu-icon fa-database-search"></span>Prepare Query`)
    query_data.query_prepared = false
}

/**
 * 
 * END SECTION QUERY DATA
 * 
 */

/**
 * 
 * SECTION WHEN PAGE LOAD EXECUTE
 * 
 */

$(document).ready(function () {
    // Additonal function for navigation bar without a link
    $(`#t_Body_nav .a-TreeView-content:not(:has(a))`).click((ev) => {
        $(ev.currentTarget).parent().children('.a-TreeView-toggle').click()
    })
    if(pages_disable_sw.indexOf($v(`pFlowStepId`))) pwa.init()
});


$(() => {
    // Set automatic function when change any item for details in Interactive Grid
    if(id_grid){
        $('.set_item_details').change((e) => { SetDetailsData(e) })

        $('.set_item_details').keyup((e) => { SetDetailsData(e) })
    }
    // configure localforage for use indexdb(a database local with disk size)
    
    localforage.config({
        driver: localforage.INDEXEDDB,
        name: 'xtlims',
        storeName: 'xtlims_v'
    });

    if(!limsApi.fileManager.files && $v('pFlowStepId') != '9997'){
        limsApi.fileManager.getContentPath(`C:\\Temp\\`)
    }

    GetCurrentIp()
    
    let super_clearErrors = apex.message.clearErrors

    apex.message.clearErrors = () => {
        super_clearErrors()
        Swal.close()
    }

    // Apex element inside is success alert
    const item_APEX_SUCCESS_MESSAGE = document.querySelector(`#APEX_SUCCESS_MESSAGE`);
    // Apex element inside is error message
    const item_APEX_ERROR_MESSAGE   = document.querySelector(`#APEX_ERROR_MESSAGE`);

    // Observer for success apex element when it's change is desplegate a success alert with sweetalert and with a best style
    const observer_APEX_SUCCESS_MESSAGE = new MutationObserver(() => {
        let success_message = $(`#success_text_message`).text() || $(`#notification_text_message`).text()
        if(success_message) ShowAlertPageSuccess(success_message)
    });
    
    // Observer for error apex element when it's change is desplegate a error alert with sweetalert and with a best style
    const observer_APEX_ERROR_MESSAGE = new MutationObserver(() => {
        // if(){
            
        // }

        let show_errors = [...$("#notification_text_message .a-Notification-item.htmldbStdErr").map((i, error) => { return $(error).text().split("Technical Info (only")[0] })].filter( (e) => !e.includes(`IG_RPT_NAME_UK`) )

        // if($v(`pFlowStepId`) != `9999` ){
        if(show_errors.length){
        //      message_text = $(`#notification_text_message`).text()
        //     _left_alert.fire({
        //         icon: `error`,
        //         title: message_text,
        //     })
        // }else{
            // $(`#success_text_message`).text(``)
            _left_alert.fire({
                icon: `error`,
                title: "An error has occurred",
                html: show_errors.join("<br>"),
                timer: 0
            })
        }else{
            if(!$(`#success_text_message`).text()){
                Swal.close()
            }
        }
    });

    // Validate with url parameters when the before page is success and need show a success message in the after page
    if($(`#success_text_message`).text() && GetUrlParameter(`success_msg`) ){
        ShowAlertPageSuccess($(`#success_text_message`).text())
    }

    observer_APEX_SUCCESS_MESSAGE.observe(item_APEX_SUCCESS_MESSAGE, {subtree: true, childList: true});
    observer_APEX_ERROR_MESSAGE.observe(item_APEX_ERROR_MESSAGE, {subtree: true, childList: true});

    // Instance file input for file manager
    file_input_modal = $('#FILE_PATH')
    // Get the limsservice file manager
    limsservice_file_browser = document.getElementById("limsservice-file-browser");

    // Get the <span> element that closes the modal in limsservice file browser / manager
    close_limsservice_modal = document.getElementsByClassName("close-limsservice-file-browser")[0];

    // When the user clicks on <span> (x), close the modal in file brower / manager
    close_limsservice_modal.onclick = () => {
        limsservice_file_browser.style.display = `none`;
        // When close set value to item to submit 
        // if(field_file_manager_to_submit) apex.item(field_file_manager_to_submit).setValue(file_input_modal.val())
        field_file_manager_to_submit = ``
    }

    // Get the file expand for inputs and textarea
    field_expand = document.getElementById("field_expand_modal");
    // Get the <span> element that closes the modal in field expand
    close_field_expand = document.getElementsByClassName("close-field-expand")[0];

    // Close field expand when 
    close_field_expand.onclick = () => {
        CloseFieldExpand()
    }
    
    // When the user clicks anywhere outside of the modal, close it
    // window.onclick = (event) => {
    //     if (event.target == limsservice_file_browser) {
    //         limsservice_file_browser.style.display = `none`;
    //     }
    // }
    $(`#manifest_xtlims`).attr('href', manifestURL)
})

/**
 * 
 * END SECTION WHEN PAGE LOAD EXECUTE
 * 
 */