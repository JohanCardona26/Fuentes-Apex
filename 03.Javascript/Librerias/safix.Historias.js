/**
 * @Namespace Historias
 * @description Modulo de safix
 */

const Historias = {};

safix.Historias = Historias;

/**
 * @module Historias.ajustarTamañoColumnas
 * @example safix.Historias.ajustarTamañoColumnas();
 * @Descripcion Se llama para ajustar tamaño de columnas de los grids de Historia Clinica
 * @Comentario Enviar el Id del grid, name de la columna, tamaño en px
 **/

Historias.ajustarTamañoColumnas=(gridiD, columna, tamaño)=>{
    try{
        apex.region(gridiD).call("getViews").grid.view$.grid("setColumnWidth",columna ,tamaño);
    }catch(e){
        safix.alertas.toast.error('Favor validar parametros, ver consola')
        safix.procesos.mensajesConsola.error('Enviar el Id del grid, name de la columna, tamaño en px', e)
    }
}