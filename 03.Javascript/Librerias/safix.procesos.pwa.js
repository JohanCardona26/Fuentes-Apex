/**
 * @Namespace procesos.pwa
 * @description Procesos necesarios para el manejo de pwa
 */

const pwa = {};

safix.procesos.pwa = pwa;

pwa.apexServiceWorker   = null;
pwa.installPrompt       = null;
// pwa.firebaseVapidPublicKey = "BOFoGrYiN1P70-UMcQ9vbfCJl9x5MXfxqCBbBqOVvim_s63i9xpM9P0PwqHvfNAs2D1rKYFOlMXhD3_Rtuybl2o";
// pwa.firebaseNotificationEndpoint = "https://apex-pwa.firebaseio.com/notifications.json";
pwa.pages_to_save       = [10064, 175, 756];
pwa.pages_disable_sw    = [10064, 509, 512, 574,577, 998];
pwa.url_public_files    = "";
pwa.url_service_worker  = "/sw_safix.js"; // service worker
pwa.splitHref           = window.location.href.split(`/`);
pwa.route               = `${pwa.splitHref[0]}/${pwa.splitHref[1]}/${pwa.splitHref[2]}/${pwa.splitHref[3]}`;
pwa.icons_route         = `${pwa.route}${appImages}`;
pwa.url                 = `${pwa.route}/f?p=105:10064`;

/**
 * @module pwa.init
 * @example pwa.init();
 * Se llama cuando la página cargue.
 * Es usado para registrar el service worker.
 **/

pwa.init = () => {
    // Validar si el serviceWorker esta disponible en el navegador
    // Si esta disponible en el navegador, procede a registrar el sw(service worker)
    if ('serviceWorker' in navigator) {
        
        /**
		 * Juan Da
		 * @IMPORTANTISIMOOOOO
		 * Cuando se vaya a registrar un nuevo service worker almacenarlo en la raiz de una aplicacion para que coga todos los cambios realizados despues de la raiz / 
		 * Y asi despues de la raiz haga el fetch correctamente dentro del servicio y se puedan guardar no solo el html de las paginas sino tambien iconos css js imagens etc
		 */	

        navigator.serviceWorker.register(pwa.url_service_worker).then(function (registeredServiceWorker) {
            safix.procesos.mensajesConsola.aviso('[XENCO] Service worker registrado correctamente!');
            
            //
            pwa.apexServiceWorker = registeredServiceWorker;
            
            // Actualizar páginas en cache
            if(navigator.onLine){
                if(pwa.pages_disable_sw.includes(parseInt($v(`pFlowStepId`)))){
                    let cache_st = caches.open('static-cache');

                    // Obtener la cache de la siguiente forma
                    cache_st.then(function(c){
                        // Obtener las páginas dentro de la cache
                        c.keys().then(function(r) {
                            let pr = new URL(window.location.href);

                            pwa.pages_disable_sw.forEach(e => {
                                let sear = pr.search.split(':');

                                sear[1] = e;
                                sear[2] = '';
                                sear[6] = '';
                                sear[7] = '';

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
                            });

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
            safix.procesos.mensajesConsola.aviso('[XENCO] Service worker fallo en el registro.', err);
        });

        // Recibe un mensaje del service worker en caso de alguna alerta
		navigator.serviceWorker.addEventListener('message', function (event) {
			if (event.data.refreshReportIds) {
				for (var key in event.data.refreshReportIds) {
					if (event.data.refreshReportIds.hasOwnProperty(key)) {X	
						apex.region(event.data.refreshReportIds[key]).refresh();
						safix.procesos.mensajesConsola.log(event, key)
					}
				}
			}
		});

    } else {
		safix.procesos.mensajesConsola.aviso('Service workers no esta disponible en este navegador.');
	}
}

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
    if (pwa.installPrompt) {
		pwa.installPrompt.prompt();
	    pwa.installPrompt.userChoice.then((choiceResult) => {
		if (choiceResult.outcome === 'accepted') {
		    safix.procesos.mensajesConsola.log('La aplicación fue instalada');
            apex.submit();
		} else {
		    safix.procesos.mensajesConsola.log('El usuario canceló la instalación');
		}
		  pwa.installPrompt = null;
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
	online: function () {
		apex.message.showPageSuccess('Estas online!');
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
		pwa.installPrompt = event;
		
		// pwa.ui.refresh();
	},

	/**
	 * @function appinstalled
	 * @example pwa.event.appinstalled
	 * This event will be triggered after the app is installed
	 **/
	appinstalled: function (event) {
		safix.procesos.mensajesConsola.log('[XENCO] Aplicacion instalada', event);
	}
};

/**
 * FUNCIONES PROPIAS DEL PWA, QUE SE DEBEN EJECUTAR CUANDO CARGA LA PAGINA
 * JCARDONA. NOV 16 2023
 */

/**
 * IIFE (Immediately-Invoked Function Expression)
 **/
(function () {
	window.addEventListener('offline', pwa.event.offline);
	window.addEventListener('beforeinstallprompt', pwa.event.beforeinstallprompt);
	window.addEventListener('appinstalled', pwa.event.appinstalled);
	window.addEventListener('online', function(){
		pwa.event.online()
		pwa.historias.guardar()
	});
})();

$(document).ready(() => {
	// Obtener el path de la version actual en los archivos publicos en la aplicacion de apex
	for (e of $(`link[rel="stylesheet"]`)) {
		// Verifica si el enlace contiene el valor de pFlowId y no contiene 'theme'
		if (e.href.includes(pFlowId.value) && !e.href.includes('theme')) {

			let link = e.href;
			// Define el patrón para buscar 'v' seguido de dígitos
			const pattern = /v\d+/g;
			// Encuentra todas las coincidencias del patrón en la cadena
			const matches = link.match(pattern);
	
			let substring = "";
			// Si hay coincidencias, extrae la subcadena hasta el final de la última coincidencia
			if (matches) {
				substring = link.substring(0, link.indexOf(matches[matches.length - 1]) + matches[matches.length - 1].length + 1);
			}

			// Asigna la subcadena a pwa.url_public_files
			pwa.url_public_files = substring;
	
			// Rompe el bucle
			break;
		}
	}
		
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
$(document).ready(() => {
    // Configurar el manifest como objeto JS
    var manifest_pwa_app = {
        start_url: safix.VariablesPwa.url,
        display: "standalone",
        theme_color: "#239e89",
        name: "Historias - Safix",
        short_name: "Safix",
        orientation: "portrait-primary",
        background_color: "#fff",
        description: "Manejo de historias clinicas desde Safix-Mobile",
        dir: "ltr",
        lang: "es-CO",
        gcm_sender_id: "103953800507",
        prefer_related_applications: false,
        icons: [
            { src: safix.VariablesPwa.icons_route + "windows/SmallTile.scale-100.png", sizes: "71x71" },
            { src: safix.VariablesPwa.icons_route + "windows/SmallTile.scale-125.png", sizes: "89x89" },
            { src: safix.VariablesPwa.icons_route + "windows/SmallTile.scale-150.png", sizes: "107x107" },
            { src: safix.VariablesPwa.icons_route + "windows/SmallTile.scale-200.png", sizes: "142x142" },
            { src: safix.VariablesPwa.icons_route + "windows/SmallTile.scale-400.png", sizes: "284x284" },
            { src: safix.VariablesPwa.icons_route + "windows/Square150x150Logo.scale-100.png", sizes: "150x150" },
            { src: safix.VariablesPwa.icons_route + "windows/Square150x150Logo.scale-125.png", sizes: "188x188" },
            { src: safix.VariablesPwa.icons_route + "windows/Square150x150Logo.scale-150.png", sizes: "225x225" },
            { src: safix.VariablesPwa.icons_route + "windows/Square150x150Logo.scale-200.png", sizes: "300x300" },
            { src: safix.VariablesPwa.icons_route + "windows/Square150x150Logo.scale-400.png", sizes: "600x600" },
            { src: safix.VariablesPwa.icons_route + "windows/Wide310x150Logo.scale-100.png", sizes: "310x150" },
            { src: safix.VariablesPwa.icons_route + "windows/Wide310x150Logo.scale-125.png", sizes: "388x188" },
            { src: safix.VariablesPwa.icons_route + "windows/Wide310x150Logo.scale-150.png", sizes: "465x225" },
            { src: safix.VariablesPwa.icons_route + "windows/Wide310x150Logo.scale-200.png", sizes: "620x300" },
            { src: safix.VariablesPwa.icons_route + "windows/Wide310x150Logo.scale-400.png", sizes: "1240x600" },
            { src: safix.VariablesPwa.icons_route + "windows/LargeTile.scale-100.png", sizes: "310x310" },
            { src: safix.VariablesPwa.icons_route + "windows/LargeTile.scale-125.png", sizes: "388x388" },
            { src: safix.VariablesPwa.icons_route + "windows/LargeTile.scale-150.png", sizes: "465x465" },
            { src: safix.VariablesPwa.icons_route + "windows/LargeTile.scale-200.png", sizes: "620x620" },
            { src: safix.VariablesPwa.icons_route + "windows/LargeTile.scale-400.png", sizes: "1240x1240" },
            { src: safix.VariablesPwa.icons_route + "windows/Square44x44Logo.scale-100.png", sizes: "44x44" },
            { src: safix.VariablesPwa.icons_route + "windows/Square44x44Logo.scale-125.png", sizes: "55x55" },
            { src: safix.VariablesPwa.icons_route + "windows/Square44x44Logo.scale-150.png", sizes: "66x66" },
            { src: safix.VariablesPwa.icons_route + "windows/Square44x44Logo.scale-200.png", sizes: "88x88" },
            { src: safix.VariablesPwa.icons_route + "windows/Square44x44Logo.scale-400.png", sizes: "176x176" },
            { src: safix.VariablesPwa.icons_route + "windows/StoreLogo.scale-100.png", sizes: "50x50" },
            { src: safix.VariablesPwa.icons_route + "windows/StoreLogo.scale-125.png", sizes: "63x63" },
            { src: safix.VariablesPwa.icons_route + "windows/StoreLogo.scale-150.png", sizes: "75x75" },
            { src: safix.VariablesPwa.icons_route + "windows/StoreLogo.scale-200.png", sizes: "100x100" },
            { src: safix.VariablesPwa.icons_route + "windows/StoreLogo.scale-400.png", sizes: "200x200" },
            { src: safix.VariablesPwa.icons_route + "windows/SplashScreen.scale-100.png", sizes: "620x300" },
            { src: safix.VariablesPwa.icons_route + "windows/SplashScreen.scale-125.png", sizes: "775x375" },
            { src: safix.VariablesPwa.icons_route + "windows/SplashScreen.scale-150.png", sizes: "930x450" },
            { src: safix.VariablesPwa.icons_route + "windows/SplashScreen.scale-200.png", sizes: "1240x600" },
            { src: safix.VariablesPwa.icons_route + "windows/SplashScreen.scale-400.png", sizes: "2480x1200" },
            { src: safix.VariablesPwa.icons_route + "windows/Square44x44Logo.targetsize-16.png", sizes: "16x16" },
            { src: safix.VariablesPwa.icons_route + "windows/Square44x44Logo.targetsize-20.png", sizes: "20x20" },
            { src: safix.VariablesPwa.icons_route + "windows/Square44x44Logo.targetsize-24.png", sizes: "24x24" },
            { src: safix.VariablesPwa.icons_route + "windows/Square44x44Logo.targetsize-30.png", sizes: "30x30" },
            { src: safix.VariablesPwa.icons_route + "windows/Square44x44Logo.targetsize-32.png", sizes: "32x32" },
            { src: safix.VariablesPwa.icons_route + "windows/Square44x44Logo.targetsize-36.png", sizes: "36x36" },
            { src: safix.VariablesPwa.icons_route + "windows/Square44x44Logo.targetsize-40.png", sizes: "40x40" },
            { src: safix.VariablesPwa.icons_route + "windows/Square44x44Logo.targetsize-44.png", sizes: "44x44" },
            { src: safix.VariablesPwa.icons_route + "windows/Square44x44Logo.targetsize-48.png", sizes: "48x48" },
            { src: safix.VariablesPwa.icons_route + "windows/Square44x44Logo.targetsize-60.png", sizes: "60x60" },
            { src: safix.VariablesPwa.icons_route + "windows/Square44x44Logo.targetsize-64.png", sizes: "64x64" },
            { src: safix.VariablesPwa.icons_route + "windows/Square44x44Logo.targetsize-72.png", sizes: "72x72" },
            { src: safix.VariablesPwa.icons_route + "windows/Square44x44Logo.targetsize-80.png", sizes: "80x80" },
            { src: safix.VariablesPwa.icons_route + "windows/Square44x44Logo.targetsize-96.png", sizes: "96x96" },
            { src: safix.VariablesPwa.icons_route + "windows/Square44x44Logo.targetsize-256.png", sizes: "256x256" },
            { src: safix.VariablesPwa.icons_route + "windows/Square44x44Logo.altform-unplated_targetsize-16.png", sizes: "16x16" },
            { src: safix.VariablesPwa.icons_route + "windows/Square44x44Logo.altform-unplated_targetsize-20.png", sizes: "20x20" },
            { src: safix.VariablesPwa.icons_route + "windows/Square44x44Logo.altform-unplated_targetsize-24.png", sizes: "24x24" },
            { src: safix.VariablesPwa.icons_route + "windows/Square44x44Logo.altform-unplated_targetsize-30.png", sizes: "30x30" },
            { src: safix.VariablesPwa.icons_route + "windows/Square44x44Logo.altform-unplated_targetsize-32.png", sizes: "32x32" },
            { src: safix.VariablesPwa.icons_route + "windows/Square44x44Logo.altform-unplated_targetsize-36.png", sizes: "36x36" },
            { src: safix.VariablesPwa.icons_route + "windows/Square44x44Logo.altform-unplated_targetsize-40.png", sizes: "40x40" },
            { src: safix.VariablesPwa.icons_route + "windows/Square44x44Logo.altform-unplated_targetsize-44.png", sizes: "44x44" },
            { src: safix.VariablesPwa.icons_route + "windows/Square44x44Logo.altform-unplated_targetsize-48.png", sizes: "48x48" },
            { src: safix.VariablesPwa.icons_route + "windows/Square44x44Logo.altform-unplated_targetsize-60.png", sizes: "60x60" },
            { src: safix.VariablesPwa.icons_route + "windows/Square44x44Logo.altform-unplated_targetsize-64.png", sizes: "64x64" },
            { src: safix.VariablesPwa.icons_route + "windows/Square44x44Logo.altform-unplated_targetsize-72.png", sizes: "72x72" },
            { src: safix.VariablesPwa.icons_route + "windows/Square44x44Logo.altform-unplated_targetsize-80.png", sizes: "80x80" },
            { src: safix.VariablesPwa.icons_route + "windows/Square44x44Logo.altform-unplated_targetsize-96.png", sizes: "96x96" },
            { src: safix.VariablesPwa.icons_route + "windows/Square44x44Logo.altform-unplated_targetsize-256.png", sizes: "256x256" },
            { src: safix.VariablesPwa.icons_route + "android/android-launchericon-512-512.png", sizes: "512x512" },
            { src: safix.VariablesPwa.icons_route + "android/android-launchericon-192-192.png", sizes: "192x192" },
            { src: safix.VariablesPwa.icons_route + "android/android-launchericon-144-144.png", sizes: "144x144" },
            { src: safix.VariablesPwa.icons_route + "android/android-launchericon-96-96.png", sizes: "96x96" },
            { src: safix.VariablesPwa.icons_route + "android/android-launchericon-72-72.png", sizes: "72x72" },
            { src: safix.VariablesPwa.icons_route + "android/android-launchericon-48-48.png", sizes: "48x48" },
            { src: safix.VariablesPwa.icons_route + "ios/16.png", sizes: "16x16" },
            { src: safix.VariablesPwa.icons_route + "ios/20.png", sizes: "20x20" },
            { src: safix.VariablesPwa.icons_route + "ios/29.png", sizes: "29x29" },
            { src: safix.VariablesPwa.icons_route + "ios/32.png", sizes: "32x32" },
            { src: safix.VariablesPwa.icons_route + "ios/40.png", sizes: "40x40" },
            { src: safix.VariablesPwa.icons_route + "ios/50.png", sizes: "50x50" },
            { src: safix.VariablesPwa.icons_route + "ios/57.png", sizes: "57x57" },
            { src: safix.VariablesPwa.icons_route + "ios/58.png", sizes: "58x58" },
            { src: safix.VariablesPwa.icons_route + "ios/60.png", sizes: "60x60" },
            { src: safix.VariablesPwa.icons_route + "ios/64.png", sizes: "64x64" },
            { src: safix.VariablesPwa.icons_route + "ios/72.png", sizes: "72x72" },
            { src: safix.VariablesPwa.icons_route + "ios/76.png", sizes: "76x76" },
            { src: safix.VariablesPwa.icons_route + "ios/80.png", sizes: "80x80" },
            { src: safix.VariablesPwa.icons_route + "ios/87.png", sizes: "87x87" },
            { src: safix.VariablesPwa.icons_route + "ios/100.png", sizes: "100x100" },
            { src: safix.VariablesPwa.icons_route + "ios/114.png", sizes: "114x114" },
            { src: safix.VariablesPwa.icons_route + "ios/120.png", sizes: "120x120" },
            { src: safix.VariablesPwa.icons_route + "ios/128.png", sizes: "128x128" },
            { src: safix.VariablesPwa.icons_route + "ios/144.png", sizes: "144x144" },
            { src: safix.VariablesPwa.icons_route + "ios/152.png", sizes: "152x152" },
            { src: safix.VariablesPwa.icons_route + "ios/167.png", sizes: "167x167" },
            { src: safix.VariablesPwa.icons_route + "ios/180.png", sizes: "180x180" },
            { src: safix.VariablesPwa.icons_route + "ios/192.png", sizes: "192x192" },
            { src: safix.VariablesPwa.icons_route + "ios/256.png", sizes: "256x256" },
            { src: safix.VariablesPwa.icons_route + "ios/512.png", sizes: "512x512" },
            { src: safix.VariablesPwa.icons_route + "ios/1024.png", sizes: "1024x1024" }
        ]
    };

    const stringManifest = JSON.stringify(manifest_pwa_app);
    const blob = new Blob([stringManifest], {type: 'application/json'});
    const manifestURL = URL.createObjectURL(blob);
    
    $('#manifest').attr('href', manifestURL);

    // Verificar si la aplicación se está ejecutando en el modo de pantalla completa de una PWA instalada
    if (window.matchMedia('(display-mode: standalone)').matches || navigator.standalone) {
        $('.hide_download_app').hide();
    } else {
        $('.hide_download_app').show();
    }
})