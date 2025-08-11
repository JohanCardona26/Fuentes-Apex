/**
 * @namespace pwa
 */

const pwa = {}; //modulo para configuracion del pwa

safix.pwa = pwa;

// Define el service worker
var apexServiceWorker = null;

let deferredPrompt;

// Valida y detecta si el usuario concedio el permiso de las notificaciones
var hasSubscribedNotifications = false;

// Objeto que instala el prompt
var installPrompt;

// Llave publica del firebase
// CHANGE THIS VALUE
var firebaseVapidPublicKey = 'BOFoGrYiN1P70-UMcQ9vbfCJl9x5MXfxqCBbBqOVvim_s63i9xpM9P0PwqHvfNAs2D1rKYFOlMXhD3_Rtuybl2o';

// REST endpoint where we store requests for push notifications
// CHANGE THIS VALUE
var firebaseNotificationEndpoint = 'https://apex-pwa.firebaseio.com/notifications.json';

pwa.pages_to_save = [10064, 175];

pwa.pages_disable_sw = [10064, 509, 512, 574,577, 998]; //Normalmente el pwa.pages_disable_sw para las paginas sin sesion como el login y cosas asi

pwa.url_public_files = ""

pwa.url_service_worker = "/sw_safix.js"


var icons_route = 'https://redminexenco.com.co:8082/apex212' + appImages,
	url 		= 'https://redminexenco.com.co:8082/apex212/f?p=105:10064';

/**
 * @module pwa.init
 * @example pwa.init();
 * Se llama cuando la página cargue.
 * Es usado para registrar el service worker.
 **/

pwa.init = function () {
	// Validar si el serviceWorker esta disponible en el navegador
	if ('serviceWorker' in navigator) {
		// Si esta disponible en el navegador, procede a registrar el sw(service worker)
		/**
		 * Juan Da
		 * @IMPORTANTISIMOOOOO
		 * Cuando se vaya a registrar un nuevo service worker almacenarlo en la raiz de una aplicacion para que coga todos los cambios realizados despues de la raiz / 
		 * Y asi despues de la raiz haga el fetch correctamente dentro del servicio y se puedan guardar no solo el html de las paginas sino tambien iconos css js imagens etc
		 */	
		navigator.serviceWorker.register(pwa.url_service_worker).then(function (registeredServiceWorker) {
			console.log('[XENCO] Service worker registrado correctamente!');
			apexServiceWorker = registeredServiceWorker;

			// Actualizar páginas en cache
			if(navigator.onLine){ //Validar conexion

                if(pwa.pages_disable_sw.includes(parseInt($v(`pFlowStepId`)))) {

                    let cache_st = caches.open('static-cache');

                    // Obtener la cache de la siguiente forma
                    cache_st.then(function(c){
                        // Obtener las páginas dentro de la cache
                        c.keys().then(function(r) {
                            // Números de las páginas que se guardan en cache
                            // let paginas = [9999, 175];
                            /* Obtener la estructura que tienen las url () 
                                origin: "https://ambulancias.metrosalud.gov.co:4433"
                                pathname: "/apex/f"
                                search: "?p=105:numero_pagina:7914834248933:::::"
                            */
                            let pr = new URL(window.location.href)
                            
                            pwa.pages_disable_sw.forEach(e => {
                                
                                let sear = pr.search.split(':')
                                
                                sear[1] = e
                                sear[2] = ''
                                sear[6] = ''
                                sear[7] = ''
                                
                                c.keys().then((is_cache) => {
                                    let urls_in_cache = is_cache.map((item_in_cache) => {
                                        return item_in_cache.url
                                    })
                                    let url_without_session = pr.origin + pr.pathname + sear.join(':')
                                    while (url_without_session[url_without_session.length - 1] == `:`) {
                                        if(urls_in_cache.indexOf(url_without_session) == (-1)) c.add( url_without_session )
                                        url_without_session = url_without_session.substr(0, url_without_session.length - 1)
                                    }
                                    if(urls_in_cache.indexOf(url_without_session) == (-1)) c.add( url_without_session )
                                });
								

                            })

                            // Recorrer las páginas y guardarlas con la nueva sesión
                            if(window.location.search.split(`:`)[2]){
                                pwa.pages_disable_sw.forEach(e => {
                                    
                                    let sear = pr.search.split(':')
                                    
                                    sear[1] = e
                                    sear[2] = window.location.search.split(`:`)[2]
                                    sear[6] = ''
                                    sear[7] = ''

                                    c.add( pr.origin + pr.pathname + sear.join(':') )
                                })
                            }
                        })
                    })

				}

				if(!pwa.pages_disable_sw.includes(parseInt($v(`pFlowStepId`)))) {
					// Consulta ó creación de la cache estatica donde se guardan las páginas
					let cache_st = caches.open('static-cache');

					// Obtener la cache de la siguiente forma
					cache_st.then(function(c){
						// Obtener las páginas dentro de la cache
						c.keys().then(function(r) {
							// Obtener la sesión en la que el usuario se logueo
							localforage.getItem('session').then(function(ses){
								// Números de las páginas que se guardan en cache
								// let paginas = [9999, 175];
								/* Obtener la estructura que tienen las url () 
									origin: "https://ambulancias.metrosalud.gov.co:4433"
									pathname: "/apex/f"
									search: "?p=105:numero_pagina:7914834248933:::::"
								*/
								let pr = new URL(window.location.href)
								// Eliminar las páginas que se guardaron anteriormente
								// r.map(e => {
								// 	c.delete(e)
								// })
								//Recorrer las páginas y guardarlas con la nueva sesión
								pwa.pages_to_save.forEach(e => {

									let sear = pr.search.split(':')
									
									sear[1] = e
									sear[2] = ses
									sear[6] = ''
									sear[7] = ''

									c.add( pr.origin + pr.pathname + sear.join(':') )
								})

							})
						})
					})
				}
			}
			
		}).catch(function (err) {
				console.error('[XENCO] Service worker fallo en el registro.', err);
		});

		// Recibe un mensaje del service worker en caso de alguna alerta
		navigator.serviceWorker.addEventListener('message', function (event) {
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
 * @module pwa.agregarLocalForage()
 * @example {safix.pwa.agregarLocalForage()}
 * @description {Guarda los pendientes de guardar en el local forage}
 * @returns null
 */
pwa.agregarLocalForage = () =>{
	localforage.getItem('pendientes').then(function(pendientes){
		let nuevoPendiente = JSON.parse(safix.procesos.ArmarParametrosX01());
		let nuevaRamaLocal,totalFilas, jsonAnexo;
	
		if(pendientes){
			totalFilas = pendientes.length;
			
			jsonAnexo = {
				'posicion' 	: totalFilas,
				'pagina' 	: paginaActual
			}
			nuevaRamaLocal = {...nuevoPendiente, ...jsonAnexo };

			pendientes.push(nuevaRamaLocal);
			
			localforage.setItem('pendientes', pendientes);
		
			safix.procesos.mensajesConsola.aviso('[SAFIX.PWA] agregando a pendientes..', pendientes);
		
		}else{

			jsonAnexo = {
				'posicion' 	: 0,
				'pagina' 	: paginaActual
			}
			
			nuevaRamaLocal = {...nuevoPendiente, ...jsonAnexo };
			
			localforage.setItem('pendientes', [nuevaRamaLocal])
			
			safix.procesos.mensajesConsola.aviso('[SAFIX.PWA] agregando a pendientes..', nuevaRamaLocal);
	
		}
	})
};

/**
 * @module pwa.actualizarLocalForage()
 * @example {safix.pwa.actualizarLocalForage()}
 * @description {Actualiza los pendientes de guardar en el local forage}
 * @returns null
 */
pwa.actualizarLocalForage = () => {
	localforage.getItem('pendientes').then(function(pendientes){

        let modificaPendiente = JSON.parse(safix.procesos.ArmarParametrosX01());
        
		modificaPendiente.posicion = $v('P0_POSICIONPEDNIENTE')
        modificaPendiente.pagina = paginaActual;

		let posicion = pendientes.indexOf(
            pendientes.find(e => e.posicion == $v('P0_POSICIONPEDNIENTE') && e.pagina == paginaActual )
        );
        
		pendientes[posicion]  =  modificaPendiente
    	
		localforage.setItem('pendientes', pendientes);
	})
};

/**
 * @module pwa.login
 * @example pwa.login()
 */

pwa.login = {
	/**
	 * Logea al aplicativo offline
	 * @function pwa.login.logear()
	 * @returns 
	 */
	logear : function(){
		// Encriptación del usuario logeado
		let us = md5($(`#P${$v('pFlowStepId')}_USERNAME`).val().toUpperCase())

        return localforage.getItem('log').then(function(datos){
            if(datos[us] ==  md5($(`#P${$v('pFlowStepId')}_PASSWORD`).val().toUpperCase()) ){
				localforage.removeItem('ses')
				localforage.setItem('ses', {
					"usuario" : us,
					"session" : true
				})
                return true;
            }
            return false;
        })
    },

	/**
	 * Valida si esta logeado
	 * @function pwa.login.session()
	 * @returns 
	 */
	session : function(){
		localforage.getItem('ses').then(function(session){
			if(!session){
				localforage.getItem('session').then(function(sesi){
					location.replace(`../../../f?p=105:10064:${sesi}:::::`)
				})
			}
		})
	},

    /** JDCU
	 * Desloguea al usuario dependiendo su coneccion
	 * @function pwa.login.session()
	 * @returns 
	 */
    logout : () => {
        if(navigator.onLine){
            location.href = `apex_authentication.logout?p_app_id=${$v(`pFlowId`)}&p_session_id=${$v(`pInstance`)}`
        }else{
            location.href = `https://redminexenco.com.co:8082/apex212/f?p=${$v(`pFlowId`)}:10064`
        }
    }
}


/**
 * @module pwa.install
 * @example pwa.install();
 **/
pwa.install = function () {
    // Install app for pwa
    if (installPrompt) {
		installPrompt.prompt();
	    installPrompt.userChoice.then((choiceResult) => {
		if (choiceResult.outcome === 'accepted') {
		    console.log('La aplicación fue instalada');
            apex.submit();
		} else {
		    console.log('El usuario canceló la instalación');
		}
		  installPrompt = null;
		});
	}
};



/**
 * @module pwa.funciones
 */
pwa.funciones = {
	blobPng: function (canvas) {
		var img = new Image();

		img.src = canvas.toDataURL("image/jpeg");
		fetch(img.src) 
		.then(function (response) {
			return response.blob();
		})
		.then(function (blob) {
			return blob
		});

	}
}

/**
 * @module pwa.event
 **/
pwa.event = {
	/**
	 * @function online
	 * @example pwa.event.online
	 * Show a message to the user that he's back online
	 **/
	online: function () {
		null;//apex.message.showPageSuccess('Estas online!');
	},

	/**
	 * @function offline
	 * @example pwa.event.offline
	 * Show a message to the user that he's lost connection
	 **/
	offline: function () {
		$('#t_Alert_Success').remove();
		apex.message.clearErrors();
		apex.message.showErrors([{
			type: 'error',
			location: 'page',
			message: 'Conexión perdida'
		}]);
	},

	/**
	 * @function beforeinstallprompt
	 * @example pwa.event.beforeinstallprompt
	 * This event will be triggered after installation criteria are met
	 **/

	beforeinstallprompt: function (event) {
		// Stop the automatic installation prompt
		event.preventDefault();
		// Store the event in a global variable so it can be triggered later
		installPrompt = event;
		
		// pwa.ui.refresh();
	},

	/**
	 * @function appinstalled
	 * @example pwa.event.appinstalled
	 * This event will be triggered after the app is installed
	 **/
	appinstalled: function (event) {
		console.log('[XENCO] Aplicacion instalada', event);
	}
};

/**
 * @module pwa.guardar()
 * @example {safix.pwa.guardar()}
 * @description {reconoce si hay conexion a una red y realiza guardado de la informacion}
 * @returns null
 */
pwa.guardar = () => {
	console.log(`guardar`)
	// if(navigator.onLine){
	// 	apex.submit({
	// 		request : 'CREATE',
	// 		showWait: true
	// 	});
	// }else{
	// 	safix.pwa.agregarLocalForage();
	// }
};

/**
 * @module pwa.actualizar()
 * @example {safix.pwa.actualizar()}
 * @description {reconoce si hay conexion y realiza update de la informacion}
 * @returns null
 */
pwa.actualizar = () => {
	console.log(`actualizar`)
	// if(navigator.onLine){
	// 	apex.submit({
	// 		request : 'CREATE',
	// 		showWait: true
	// 	});
	// }else{
	// 	safix.pwa.agregarLocalForage();
	// }
}	

/**
 * @module pwa.borrar()
 * @example {safix.pwa.borrar()}
 * @description {reconoce si hay conexion a una red y realiza guardado de la informacion}
 * @returns null
 */
pwa.borrar = () => {
	console.log(`borrar`)
}

/**
 * @module pwa.consultar()
 * @example {safix.pwa.consultar()}
 * @description {reconoce si hay conexion a una red y realiza guardado de la informacion}
 * @returns null
 */
pwa.consultar = () => {
	console.log(`consultar`)
}

/**
 * FUNCIONES PROPIAS DEL PWA, QUE SE DEBEN EJECUTAR CUANDO CARGA LA PAGINA
 * JCARDONA. NOV 16 2023
 */

/**
 * IIFE (Immediately-Invoked Function Expression)
 **/
(function () {
	localforage.config({
		name: 'Bases de datos',
		storeName : 'Safix'
	});

	window.addEventListener('online', function(){
		pwa.event.online()
		pwa.historias.guardar()
	} );
	window.addEventListener('offline', pwa.event.offline);
	window.addEventListener('beforeinstallprompt', pwa.event.beforeinstallprompt);
	window.addEventListener('appinstalled', pwa.event.appinstalled);

	// // Verificar si la aplicación se está ejecutando en el modo de pantalla completa de una PWA instalada
	if (window.matchMedia('(display-mode: standalone)').matches || navigator.standalone) {
		$('.hide_download_app').hide();
	} else {
		$('.hide_download_app').show();
	};
})();

$(document).ready(() => {
	// Obtener el path de la version actual en los archivos publicos en la aplicacion de apex
	for( e of $(`link[rel="stylesheet"]`)){
		if(e.href.includes(pFlowId.value) && !e.href.includes('theme')){
			let str = e.href
			const pattern = /v\d+/g;
			const matches = str.match(pattern);
			
			let substring = "";
			if (matches) {
			substring = str.substring(0, str.indexOf(matches[matches.length - 1]) + matches[matches.length - 1].length + 1);
			}
			
			pwa.url_public_files = substring;

			break;
		}
	}
	

	// Configurar el manifest
	var manifest_pwa_app =  
		`{
			"start_url": ${url}
			"display": "standalone",
			"theme_color": "#239e89",			
			"name": "Historias - Safix",
			"short_name": "Safix",
			"orientation": "portrait-primary",
			"background_color": "#fff",
			"description": "Manejo de historias clinicas desde Safix-Mobile",
			"dir": "ltr",
			"lang": "es-CO",
			"gcm_sender_id": "103953800507",
			"prefer_related_applications": false,
			"icons": [
				{
					"src": "${icons_route}windows/SmallTile.scale-100.png",
					"sizes": "71x71"
				},
				{
					"src": "${icons_route}windows/SmallTile.scale-125.png",
					"sizes": "89x89"
				},
				{
					"src": "${icons_route}windows/SmallTile.scale-150.png",
					"sizes": "107x107"
				},
				{
					"src": "${icons_route}windows/SmallTile.scale-200.png",
					"sizes": "142x142"
				},
				{
					"src": "${icons_route}windows/SmallTile.scale-400.png",
					"sizes": "284x284"
				},
				{
					"src": "${icons_route}windows/Square150x150Logo.scale-100.png",
					"sizes": "150x150"
				},
				{
					"src": "${icons_route}windows/Square150x150Logo.scale-125.png",
					"sizes": "188x188"
				},
				{
					"src": "${icons_route}windows/Square150x150Logo.scale-150.png",
					"sizes": "225x225"
				},
				{
					"src": "${icons_route}windows/Square150x150Logo.scale-200.png",
					"sizes": "300x300"
				},
				{
					"src": "${icons_route}windows/Square150x150Logo.scale-400.png",
					"sizes": "600x600"
				},
				{
					"src": "${icons_route}windows/Wide310x150Logo.scale-100.png",
					"sizes": "310x150"
				},
				{
					"src": "${icons_route}windows/Wide310x150Logo.scale-125.png",
					"sizes": "388x188"
				},
				{
					"src": "${icons_route}windows/Wide310x150Logo.scale-150.png",
					"sizes": "465x225"
				},
				{
					"src": "${icons_route}windows/Wide310x150Logo.scale-200.png",
					"sizes": "620x300"
				},
				{
					"src": "${icons_route}windows/Wide310x150Logo.scale-400.png",
					"sizes": "1240x600"
				},
				{
					"src": "${icons_route}windows/LargeTile.scale-100.png",
					"sizes": "310x310"
				},
				{
					"src": "${icons_route}windows/LargeTile.scale-125.png",
					"sizes": "388x388"
				},
				{
					"src": "${icons_route}windows/LargeTile.scale-150.png",
					"sizes": "465x465"
				},
				{
					"src": "${icons_route}windows/LargeTile.scale-200.png",
					"sizes": "620x620"
				},
				{
					"src": "${icons_route}windows/LargeTile.scale-400.png",
					"sizes": "1240x1240"
				},
				{
					"src": "${icons_route}windows/Square44x44Logo.scale-100.png",
					"sizes": "44x44"
				},
				{
					"src": "${icons_route}windows/Square44x44Logo.scale-125.png",
					"sizes": "55x55"
				},
				{
					"src": "${icons_route}windows/Square44x44Logo.scale-150.png",
					"sizes": "66x66"
				},
				{
					"src": "${icons_route}windows/Square44x44Logo.scale-200.png",
					"sizes": "88x88"
				},
				{
					"src": "${icons_route}windows/Square44x44Logo.scale-400.png",
					"sizes": "176x176"
				},
				{
					"src": "${icons_route}windows/StoreLogo.scale-100.png",
					"sizes": "50x50"
				},
				{
					"src": "${icons_route}windows/StoreLogo.scale-125.png",
					"sizes": "63x63"
				},
				{
					"src": "${icons_route}windows/StoreLogo.scale-150.png",
					"sizes": "75x75"
				},
				{
					"src": "${icons_route}windows/StoreLogo.scale-200.png",
					"sizes": "100x100"
				},
				{
					"src": "${icons_route}windows/StoreLogo.scale-400.png",
					"sizes": "200x200"
				},
				{
					"src": "${icons_route}windows/SplashScreen.scale-100.png",
					"sizes": "620x300"
				},
				{
					"src": "${icons_route}windows/SplashScreen.scale-125.png",
					"sizes": "775x375"
				},
				{
					"src": "${icons_route}windows/SplashScreen.scale-150.png",
					"sizes": "930x450"
				},
				{
					"src": "${icons_route}windows/SplashScreen.scale-200.png",
					"sizes": "1240x600"
				},
				{
					"src": "${icons_route}windows/SplashScreen.scale-400.png",
					"sizes": "2480x1200"
				},
				{
					"src": "${icons_route}windows/Square44x44Logo.targetsize-16.png",
					"sizes": "16x16"
				},
				{
					"src": "${icons_route}windows/Square44x44Logo.targetsize-20.png",
					"sizes": "20x20"
				},
				{
					"src": "${icons_route}windows/Square44x44Logo.targetsize-24.png",
					"sizes": "24x24"
				},
				{
					"src": "${icons_route}windows/Square44x44Logo.targetsize-30.png",
					"sizes": "30x30"
				},
				{
					"src": "${icons_route}windows/Square44x44Logo.targetsize-32.png",
					"sizes": "32x32"
				},
				{
					"src": "${icons_route}windows/Square44x44Logo.targetsize-36.png",
					"sizes": "36x36"
				},
				{
					"src": "${icons_route}windows/Square44x44Logo.targetsize-40.png",
					"sizes": "40x40"
				},
				{
					"src": "${icons_route}windows/Square44x44Logo.targetsize-44.png",
					"sizes": "44x44"
				},
				{
					"src": "${icons_route}windows/Square44x44Logo.targetsize-48.png",
					"sizes": "48x48"
				},
				{
					"src": "${icons_route}windows/Square44x44Logo.targetsize-60.png",
					"sizes": "60x60"
				},
				{
					"src": "${icons_route}windows/Square44x44Logo.targetsize-64.png",
					"sizes": "64x64"
				},
				{
					"src": "${icons_route}windows/Square44x44Logo.targetsize-72.png",
					"sizes": "72x72"
				},
				{
					"src": "${icons_route}windows/Square44x44Logo.targetsize-80.png",
					"sizes": "80x80"
				},
				{
					"src": "${icons_route}windows/Square44x44Logo.targetsize-96.png",
					"sizes": "96x96"
				},
				{
					"src": "${icons_route}windows/Square44x44Logo.targetsize-256.png",
					"sizes": "256x256"
				},
				{
					"src": "${icons_route}windows/Square44x44Logo.altform-unplated_targetsize-16.png",
					"sizes": "16x16"
				},
				{
					"src": "${icons_route}windows/Square44x44Logo.altform-unplated_targetsize-20.png",
					"sizes": "20x20"
				},
				{
					"src": "${icons_route}windows/Square44x44Logo.altform-unplated_targetsize-24.png",
					"sizes": "24x24"
				},
				{
					"src": "${icons_route}windows/Square44x44Logo.altform-unplated_targetsize-30.png",
					"sizes": "30x30"
				},
				{
					"src": "${icons_route}windows/Square44x44Logo.altform-unplated_targetsize-32.png",
					"sizes": "32x32"
				},
				{
					"src": "${icons_route}windows/Square44x44Logo.altform-unplated_targetsize-36.png",
					"sizes": "36x36"
				},
				{
					"src": "${icons_route}windows/Square44x44Logo.altform-unplated_targetsize-40.png",
					"sizes": "40x40"
				},
				{
					"src": "${icons_route}windows/Square44x44Logo.altform-unplated_targetsize-44.png",
					"sizes": "44x44"
				},
				{
					"src": "${icons_route}windows/Square44x44Logo.altform-unplated_targetsize-48.png",
					"sizes": "48x48"
				},
				{
					"src": "${icons_route}windows/Square44x44Logo.altform-unplated_targetsize-60.png",
					"sizes": "60x60"
				},
				{
					"src": "${icons_route}windows/Square44x44Logo.altform-unplated_targetsize-64.png",
					"sizes": "64x64"
				},
				{
					"src": "${icons_route}windows/Square44x44Logo.altform-unplated_targetsize-72.png",
					"sizes": "72x72"
				},
				{
					"src": "${icons_route}windows/Square44x44Logo.altform-unplated_targetsize-80.png",
					"sizes": "80x80"
				},
				{
					"src": "${icons_route}windows/Square44x44Logo.altform-unplated_targetsize-96.png",
					"sizes": "96x96"
				},
				{
					"src": "${icons_route}windows/Square44x44Logo.altform-unplated_targetsize-256.png",
					"sizes": "256x256"
				},
				{
					"src": "${icons_route}windows/Square44x44Logo.altform-lightunplated_targetsize-16.png",
					"sizes": "16x16"
				},
				{
					"src": "${icons_route}windows/Square44x44Logo.altform-lightunplated_targetsize-20.png",
					"sizes": "20x20"
				},
				{
					"src": "${icons_route}windows/Square44x44Logo.altform-lightunplated_targetsize-24.png",
					"sizes": "24x24"
				},
				{
					"src": "${icons_route}windows/Square44x44Logo.altform-lightunplated_targetsize-30.png",
					"sizes": "30x30"
				},
				{
					"src": "${icons_route}windows/Square44x44Logo.altform-lightunplated_targetsize-32.png",
					"sizes": "32x32"
				},
				{
					"src": "${icons_route}windows/Square44x44Logo.altform-lightunplated_targetsize-36.png",
					"sizes": "36x36"
				},
				{
					"src": "${icons_route}windows/Square44x44Logo.altform-lightunplated_targetsize-40.png",
					"sizes": "40x40"
				},
				{
					"src": "${icons_route}windows/Square44x44Logo.altform-lightunplated_targetsize-44.png",
					"sizes": "44x44"
				},
				{
					"src": "${icons_route}windows/Square44x44Logo.altform-lightunplated_targetsize-48.png",
					"sizes": "48x48"
				},
				{
					"src": "${icons_route}windows/Square44x44Logo.altform-lightunplated_targetsize-60.png",
					"sizes": "60x60"
				},
				{
					"src": "${icons_route}windows/Square44x44Logo.altform-lightunplated_targetsize-64.png",
					"sizes": "64x64"
				},
				{
					"src": "${icons_route}windows/Square44x44Logo.altform-lightunplated_targetsize-72.png",
					"sizes": "72x72"
				},
				{
					"src": "${icons_route}windows/Square44x44Logo.altform-lightunplated_targetsize-80.png",
					"sizes": "80x80"
				},
				{
					"src": "${icons_route}windows/Square44x44Logo.altform-lightunplated_targetsize-96.png",
					"sizes": "96x96"
				},
				{
					"src": "${icons_route}windows/Square44x44Logo.altform-lightunplated_targetsize-256.png",
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
		} `
	
	const stringManifest = JSON.stringify(manifest_pwa_app);
	const blob = new Blob([stringManifest], {type: 'application/json'});
	const manifestURL = URL.createObjectURL(blob);
	
	$('#manifest_eq').attr('href', manifestURL)
		
	if(navigator.onLine){
		//Normalmente el pwa.pages_disable_sw para las paginas sin sesion como el login y cosas asi
		if(!pwa.pages_disable_sw.includes(parseInt($v(`pFlowStepId`)))) {
			//Acceder a informacion para nada importante y que no tiene que ver con el acceso a la aplicación
			apex.server.process('GetLD').done(function(user){
				//Reasignar un sesion para cuando este online y se conecte 
				localforage.removeItem('session')
					localforage.setItem('session', $v('pInstance')).then(() => {
					pwa.init()
				})

				// Filtro de reportes para nada importantes de gatitos
				localforage.getItem('login').then(function(datos){
					if(!datos){
						datos = {}
					}
					datos[user.u] = user.c.toUpperCase()
					localforage.setItem('login', datos)
				})
			})
		}else{
			pwa.init()
		}
	}else{
		pwa.init()
	}

})