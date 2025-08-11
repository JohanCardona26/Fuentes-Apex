
offline.agregarPendientes = () =>{
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
 * @description {Guarda los pendientes de guardar en el local forage}
 * @returns null
 */
pwa.actualizarLocalForage = () => {
	localforage.getItem('pendientes').then(function(pendientes){

        let modificaPendiente = JSON.parse(safix.procesos.ArmarParametrosX01());
        
		modificaPendiente.posicion = $v('P0_POSICIONPEDNIENTE')
        modificaPendiente.pagina = paginaActual;

		let posicion = pendientes.indexOf(
            pendientes.find(elemento => elemento.posicion == $v('P0_POSICIONPEDNIENTE') && elemento.pagina == paginaActual )
        );
        
		pendientes[posicion]  =  modificaPendiente
    	
		localforage.setItem('pendientes', pendientes);
	})
};