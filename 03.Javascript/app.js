/**
 * Juan Da
 * @global variables
 **/

// Define el service worker
var apexServiceWorker = null;

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

/**
 * @namespace pwa
 **/
var pwa = {};

pwa.pages_to_save = [9999, 175]
//Normalmente el pwa.pages_disable_sw para las paginas sin sesion como el login y cosas asi
pwa.pages_disable_sw = [9999]

/**
 * @module pwa.init
 * @example pwa.init();
 * Se llama cuando la página cargue.
 * Es usado para registrar el service worker.
 **/

pwa.url_public_files = ""
pwa.url_service_worker = "/sw_safix.js"

pwa.init = function () {
	// Validar si el serviceWorker esta disponible en el navegador
	if ('serviceWorker' in navigator) {
		// Si esta disponible en el navegador, procede a registrar el sw(service worker)
		/**
		 * Juan Da
		 * @IMPORTANTISIMOOOOO
		 * Cuando se vaya a registrar un nuevo service worker almacenarlo en la raiz de una aplicacion para que coga todos los cambios realizados despues de la raiz / 
		 * Y asi despues de la raiz haga el fetch correctamente dentro del servicio y se puedan guardar no solo el html de las paginas sino tambien iconos css js imagens etc
		 * 
		 */
	
		navigator.serviceWorker.register(pwa.url_service_worker).then(function (registeredServiceWorker) {
			console.log('[XENCO] Service worker registrado correctamente!');
			apexServiceWorker = registeredServiceWorker;

			// Actualizar páginas en cache
			if(navigator.onLine){
				//Normalmente el pwa.pages_disable_sw para las paginas sin sesion como el login y cosas asi
				if(!pwa.pages_disable_sw.includes(parseInt($v(`pFlowStepId`)))) {
					// Consulta ó creación de la cache estatica donde se guardan las páginas
					let cache_st = caches.open('static-cache')

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
								r.map(e => {
									c.delete(e)
								})
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
 * @module pwa.login
 * @example pwa.login()
 */

/**
 * @module pwa.login
 **/
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
					location.replace(`../../safixmetro/f?p=105:9999:${sesi}:::::`)
				})
			}
		})
	}
}


/**
 * @module pwa.install
 * @example pwa.install();
 **/
pwa.install = function () {
	// Show the installation prompt, using the global variable previously set
	installPrompt.prompt();
	// Wait for the user to respond to the prompt
	installPrompt.userChoice
		.then(function (choiceResult) {
			console.log('[XENCO] User instalando la aplicacion ' + choiceResult.outcome);
			// Reset the install prompt
			installPrompt = null;
			// pwa.ui.refresh();
		});
};

/**
 * @module pwa.historias
 **/
pwa.historias = {
	/**
	 * @function 
	 * @example pwa.historias.consultar;
	 **/
	consultar : function(){
		
		// Swal.fire(`eres mi perra`)
		
		apex.item('P175_HORA_REMICION').setValue(new Date().toLocaleString('es-CO', { hour: 'numeric', minute: 'numeric', second : 'numeric',  hour12: false }).replace(' p. m.', '').replace(' a. m.', ''))
 		apex.item('P175_FECHA_REMICION').setValue(new Date().toLocaleString('es-CO', { day: 'numeric', month: 'numeric', year : 'numeric' }).replace(' p. m.', '').replace(' a. m.', ''))
		
		if(navigator.onLine){    
			// console.log('a')
			// Swal.fire(`eres mi perra 2`)
			apx_xenco.procesos.ejecutarCallback('PU_CONSULTAR_PACIENTE')
		}else{
			// Swal.fire({
			// 	title: 'Validando',
			// 	html: 'Este proceso puede tardar unos segundos',
			// 	timerProgressBar: true,
			// 	allowOutsideClick: false,
			// 	didOpen: () => {
			// 		Swal.showLoading()
			// 	}
			// 	}).then((result) => {
			// 	if (result.dismiss === Swal.DismissReason.timer) {
			// 		null;
			// 	}
			// });

			localforage.getItem('usuarios').then(function(usuarios){
				let usuario = usuarios.find(e => e.P175_DNI == $('#P175_DNI').val())

				Object.keys(usuario).forEach((items) => {
					apex.item(items).setValue(usuario[items]);
                });


				// apex.item('P175_TDNI').setValue(usuario.tipo_doc)
				// apex.item('P175_ADMISION').setValue(usuario.admision)
				// apex.item('P175_HISTORIA').setValue(usuario.historia)
				// apex.item('P175_NOMBRES').setValue(usuario.nombre)
				// apex.item('P175_EDAD').setValue(usuario.edad)
				// apex.item('P175_ENFERMEDAD').setValue(usuario.enfermedad)
				// apex.item('P175_ENTIDAD').setValue(usuario.entidad)
				// apex.item('P175_UH').setValue(usuario.uh)
				// apex.item('P175_FUNCIONARIO').setValue(usuario.profesional)
				// apex.item('P175_CARGO').setValue(usuario.cargo)
				// apex.item('P175_AMBULANCIA').setValue(usuario.ambulancia)
				// apex.item('P175_CONDUCTOR').setValue(usuario.conductor)
				// apex.item('P175_TRIPULANTE').setValue(usuario.tripulante)
				// apex.item('P175_LINEA').setValue(usuario.linea)
				// apex.item('P175_ADMISION').setValue(usuario.admision)
				// apex.item('P175_NUMERO_HISTORIA').setValue(usuario.historia)
				// apex.item('P175_LINEA_HISTORIA').setValue(usuario.linea_historia)

				// // Nuevos campos
				// apex.item('P175_DIAG_REL').setValue(usuario.diagnostico_re)
				// apex.item('P175_SOLICITANTE').setValue(usuario.solicitante)
				// apex.item('P175_FECHA_SOLICI').setValue(usuario.fecha_soli)
				// apex.item('P175_HORA_SOLICI').setValue(usuario.hora_soli)
				// apex.item('P175_DOC_CONDUC').setValue(usuario.doc_conductor)
				// apex.item('P175_DOC_TRIPULANTE').setValue(usuario.doc_tripulante)
				// apex.item('P175_FECHA_TRAS').setValue(usuario.fecha_traslado)
				// apex.item('P175_HORA_TRAS').setValue(usuario.hora_traslado)
			})
			// Swal.close();
		}
	},
	/**
	 * @function 
	 * @example pwa.historias.agregar();
	 **/
	agregar : function(){

		// Validar que no este nulo	
		if($('#P175_DNI').val()){
			// GUARDAR DATOS DE HISTORIA EN EL INDEX DB
			localforage.getItem('historias').then(function(historias){
				let hi = {

					'linea'             : apex.item('P175_LINEA').getValue(),
					'admision'          : apex.item('P175_ADMISION').getValue(),
					'historia'          : apex.item('P175_NUMERO_HISTORIA').getValue(),
					'lineah'            : apex.item('P175_LINEA_HISTORIA').getValue(),
					
						
					'hora'				: apex.item('P175_FECHA_REMICION').getValue(),
					'hora'				: apex.item('P175_HORA_REMICION').getValue(),

					'acompannante'      : apex.item('P175_ACOMPANA').getValue(),
					'dni_acompannante'  : apex.item('P175_DNI_ACOMPANA').getValue(),
					'parentesco'        : apex.item('P175_PARENTESCO').getValue(),
					'auxiliar'          : apex.item('P175_AUXIILIAR').getValue(),
					'otro'              : apex.item('P175_OTRO').getValue(),
	
					'tipo_servicio'     : apex.item('P175_TIPO_SERVI').getValue(),
					'cualdx'            : apex.item('P175_CUALDX').getValue(),
					'presion_sistolica' : apex.item('P175_PRESIONS').getValue(),
					'presion_diastolica': apex.item('P175_PRESIOND').getValue(),
					'pulso'             : apex.item('P175_PULSO').getValue(),
					'fcia_respira'      : apex.item('P175_FRESPIRA').getValue(),
					'temperatura'       : apex.item('P175_TEMPERATURA').getValue(),
					'sat_co2'           : apex.item('P175_SAT_CON_O2').getValue(),
					'sat_so2'           : apex.item('P175_SAT_SIN_O2').getValue(),
					'fcf'               : apex.item('P175_FCF').getValue(),
					'dilatacion'        : apex.item('P175_DILATACION').getValue(),
					'estado_conciencia' : apex.item('P175_ESTADO_CONCIENCIA').getValue(),
					'glasgow'           : apex.item('P175_GLASGOW').getValue(),
					'cambios_clinicos'  : apex.item('P175_CAMBIOS_TRASLADO').getValue(),
					'cambios_registro'  : apex.item('P175_CAMBIOS_REGISTRADOS').getValue(),

					'downton'  			: apex.item('P175_DOWNTON').getValue(),
					'caidas_previas'  	: apex.item('P175_CAIDAS_PREV').getValue(),
					'medicamentos'  	: apex.item('P175_MEDICAMENTOS').getValue(),
					'defic_sensoriales' : apex.item('P175_DEFSENSORIALES').getValue(),
					'estado_mental'  	: apex.item('P175_ESTADOMENTAL').getValue(),
					'deambulacion'  	: apex.item('P175_DEAMBULACION').getValue(),
					'estado_clinico'  	: apex.item('P175_ESTADOCLINICO').getValue(),	
					'medidas_prevencion': apex.item('P175_CONOCIMIENTOMEDIDAS').getValue(),

					//DESPLAZAMIENTO
					'presencia_unidad' 		: apex.item('P175_PRESENCIA_UH').getValue(),
					'recepcion_paciente' 	: apex.item('P175_RECEPCION_PACIENTE').getValue(),
					'salida_ips' 			: apex.item('P175_SALIDA_IPS').getValue(),
					'presencia_ips' 		: apex.item('P175_PRESENCIA_IPS').getValue(),
					'entrega_ips' 			: apex.item('P175_ENTREGA_PACI_IPS').getValue(),
					'reporte_dispo' 		: apex.item('P175_REPORTE_DISPONIBILIDAD').getValue(),

					'h_presencia_unidad' 	: apex.item('P175_PRESENCIA_UH_HORA').getValue(),
					'h_recepcion_paciente' 	: apex.item('P175_RECEPCION_PACIENTE_HORA').getValue(),
					'h_salida_ips' 			: apex.item('P175_SALIDA_IPS_HORA').getValue(),
					'h_presencia_ips' 		: apex.item('P175_PRESENCIA_IPS_HORA').getValue(),
					'h_entrega_ips'			: apex.item('P175_ENTREGA_PACI_IPS_HORA').getValue(),
					'h_reporte_dispo' 		: apex.item('P175_REPORTE_DISPONIBILIDAD_HO').getValue(),
					'user_connect' 			: apex.item('P175_USERCON').getValue()

					}
				if(historias){
					historias.push(hi)
					localforage.setItem('historias', historias)
					console.log('[XENCO] agregando a historias..', historias)
				}else{
					localforage.setItem('historias', [hi])
				}
			})

			// GUARDAR DATOS DE REFERENCIA (FIRMAS ETC...) EN EL INDEX DB
			localforage.getItem('referencias').then(function(referencias){
				//document.getElementById('E_signature_canvas').toBlob(function(fe) {
					document.getElementById('R_signature_canvas').toBlob(function(fr) {
						document.getElementById('A_signature_canvas').toBlob(function(fa) {


							let ref =  {
								'remision'        : apex.item('P175_LINEA').getValue(),
								'admision'        : apex.item('P175_ADMISION').getValue(),
								
								'hospital'        : apex.item('P175_INST_RECIBE').getValue(),
								'funcionario'     : apex.item('P175_FUNCIONARIO_RECIBE').getValue(),
								'cargo'           : apex.item('P175_CARGOF_RECIBE').getValue(),
								'observaciones'   : apex.item('P175_OBSERVACIONES').getValue(),
								// 'hora_llegada'    : apex.item('P175_HORA_LL').getValue(),
								// 'hora_aceptacion' : apex.item('P175_HORA_AC').getValue(),

								//'firma_e' : fe,
								'firma_r' : fr,
								'firma_a' : fa
							}

							if(referencias){
								referencias.push(ref)
								localforage.setItem('referencias', referencias)
								console.log('[XENCO] agregando a referencias..', referencias)
							}else{
								localforage.setItem('referencias', [ref] )
							}

						}, "image/jpeg", 1)
					}, "image/jpeg", 1)
				//}, "image/jpeg", 1)
			})

			// Validar cuando se encuentre online y guardar directamente
			if(navigator.onLine){
				console.log('[XENCO] Intentando guardar en modo online validacion')
				apex.message.showPageSuccess('Guardando...');
				setTimeout( () => { pwa.historias.guardar() }, 3000)
			}else{
				console.log('[XENCO] Guardando como pendiente')
				apex.message.showPageSuccess('Se esta guardando como pendiente!');
				setTimeout( () => { pwa.historias.limpiar() }, 2000)
			}
        }
	},
	/**
	 * @function 
	 * @example pwa.historias.guardar();
	 **/
	guardar : function(){

		console.log('[XENCO] Intentando guardar..')

		localforage.getItem('historias').then(function(historias){
            if(historias){
				historias.forEach(function(hist){
					var url = 'xenco/ambulancia/pwa/guardar'
					var opciones = {
						method: 'PUT',
						body: JSON.stringify(hist)
					}
					fetch(url, opciones)
					.then(function () {
						localforage.removeItem('historias')
						console.log('[XENCO] se ha guardado la historia')

						localforage.getItem('referencias').then(function(referencia){
							if(referencia){
								referencia.forEach(function(ref){
									var urli = `xenco/ambulancia/pwa/guardar_imagen?ADMISION=${ref.admision}&LINEA=${ref.remision}`
				
									var urlf = 'xenco/ambulancia/pwa/guardar_referencia'
									var opciones = {
										method: 'PUT',
										body: JSON.stringify(ref)
									}
				
									fetch(urli + '&TIPO=E', {
										method: 'PUT',
										body : ref.firma_e
									})
									
									fetch(urli + '&TIPO=R', {
										method: 'PUT',
										body : ref.firma_r
									})
				
									fetch(urli + '&TIPO=A', {
										method: 'PUT',
										body : ref.firma_a
									})
									
									
									fetch(urlf, opciones)
									.then(function () {
										localforage.removeItem('referencias')
										apex.message.showPageSuccess('Se ha guardado!');
										console.log('[XENCO] Se ha guardado')
										
										if(navigator.onLine){
											console.log('[XENCO] limpiando..' , )
											localforage.removeItem('recuperar')
											setTimeout(() => {
												$('#LIMPIAR_DATOS').click()
											}, 3000)
										}

									}).catch(function (err) {
										console.error('[XENCO] Error en el fetch ' + urlf + opciones, err);
										apex.message.clearErrors();
										apex.message.showErrors([{
											type: 'error',
											location: 'page',
											message: '[R] Error al guardar'
										}]);
									}); 
								})
							}
						})
						
					}).catch(function (err) {
						apex.message.clearErrors();
						apex.message.showErrors([{
							type: 'error',
							location: 'page',
							message: '[H] Error al guardar'
						}]);
						console.error('[XENCO] Error en el fetch ' + url + opciones, err);
					});
				})
            }
        })

	},
	/**
	 * @function 
	 * @example pwa.historias.limpiar();
	 **/
	limpiar : function(){
		console.log('[XENCO] limpiando los datos recuperados..' , )
		localforage.removeItem('recuperar')
		setTimeout(() => {
			location.reload()
		}, 2000);
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
 * IIFE (Immediately-Invoked Function Expression)
 **/
(function () {
	localforage.config({
		name: 'Bases de datos',
		storeName : 'xenco'
	});

	window.addEventListener('online', function(){
		pwa.event.online()
		pwa.historias.guardar()
	} );
	window.addEventListener('offline', pwa.event.offline);
	window.addEventListener('beforeinstallprompt', pwa.event.beforeinstallprompt);
	window.addEventListener('appinstalled', pwa.event.appinstalled);

})();

$(document).ready(() => {

	// Configurar la base de datos para que sea mas personalizada
	localforage.config({
		name: 'Bases de datos',
		storeName : 'xenco'
	});

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
	var myDynamicManifest =  {
		"name": "SAFIX - Ambulancias traslados",
		"short_name": "SAFIX - Ambulancias traslados",
		"start_url": "https://ambulancias.metrosalud.gov.co:4433/safixmetro/f?p=105:9999",
		"display": "standalone",
		"orientation": "portrait-primary",
		"background_color": "#fff",
		"theme_color": "#3f51b5",
		"description": "SAFIX - Ambulancias traslados",
		"dir": "ltr",
		"lang": "es-CO",
		"gcm_sender_id": "103953800507",
		"prefer_related_applications": false,
		"icons": [
			{
			"src": pwa.url_public_files + "iconos/referenc72x72.png",
			"type": "image/png",
			"sizes": "72x72"
			},
			{
			"src": pwa.url_public_files + "iconos/referenc96x96.png",
			"type": "image/png",
			"sizes": "96x96"
			},
			{
			"src": pwa.url_public_files + "iconos/referenc128x128.png",
			"type": "image/png",
			"sizes": "128x128"
			},
			{
			"src": pwa.url_public_files + "iconos/referenc144x144.png",
			"type": "image/png",
			"sizes": "144x144"
			},
			{
			"src": pwa.url_public_files + "iconos/referenc152x152.png",
			"type": "image/png",
			"sizes": "152x152"
			},
			{
			"src": pwa.url_public_files + "iconos/referenc192x192.png",
			"type": "image/png",
			"sizes": "192x192"
			},
			{
			"src": pwa.url_public_files + "iconos/referenc384x384.png",
			"type": "image/png",
			"sizes": "384x384"
			},
			{
			"src": pwa.url_public_files + "iconos/referenc512x512.png",
			"type": "image/png",
			"sizes": "512x512"
			}
			]
	}
	
	const stringManifest = JSON.stringify(myDynamicManifest);
	const blob = new Blob([stringManifest], {type: 'application/json'});
	const manifestURL = URL.createObjectURL(blob);
	
	$('#manifest_ambulancia').attr('href', manifestURL)
		
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

/**
 * 
 * SECTION QUERY DATA
 * Juan Da
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