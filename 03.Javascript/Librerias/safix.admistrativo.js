/**
 * @Namespace administrativo
 * @description Modulo de safix
 */
  
const administrativo = {};

safix.administrativo = administrativo;

/**
 * @module administrativo.diseñadorFormas(accion)
 * @example administrativo.diseñadorFormas('Guardar')
 * @description se debe enviar la accion que se va a realizar como parametro
 */

administrativo.diseñadorFormas = (accion) => {
    let titulo_alerta, tituloConfirmacion, callback;

    accion = accion.toUpperCase();

    if (accion == 'GUARDAR'){
        titulo_alerta       = 'Creando la página!';
        tituloConfirmacion  = '¿Está seguro que desea crear la página?';
        callback            = 'PU_CREACION_PAGS';

    }
    else{
        if(accion == 'BORRAR'){
            titulo_alerta       = 'Borrando la página!';
            tituloConfirmacion  = '¿Está seguro que desea borrar la página?';
            callback            = 'PU_BORRADO_PAGINAS';
        }else if(accion == 'ACTUALIZAR'){
            titulo_alerta       = 'Actualizando la información!';
            tituloConfirmacion  = '¿Está seguro que actualizarla pagina?';
            callback            = 'PU_ACTUALIZACION_PAGS';
        }else {
            safix.alertas.superiores.error('La accion ' + accion + ' no esta permitida, favor validar parametros');
        }
    };

    safix.alertas.centrales.fire(
        tituloConfirmacion,
        "¡No podrás revertir esto!"
    ).then((resultado)=> {
        if (resultado.isConfirmed){
            safix.procesos.ejecutarCallback(callback);
        }
        
    })
}