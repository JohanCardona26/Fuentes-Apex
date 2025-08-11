/**
 * @namespace notificaciones
 */
const notificaciones = {};

safix.notificaciones = notificaciones;

/**
 * @module alertas.notificacion.top
 * @example safix.alertas.notificacion.top.fire('Mensaje');
 * @description Definicion de notificaciones ubicadas en la parte superior de la vista.
*/
notificaciones.top = Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    returnFocus: false,
    timer: 10000,
    timerProgressBar: true,
    didOpen: (toast) => {
        toast.addEventListener('mouseenter', Swal.stopTimer)
        toast.addEventListener('mouseleave', Swal.resumeTimer)
    }
}) 

/**
 * @module notificaciones.top.exito
 * @example safix.notificaciones.top.exito('succesful')
 * @description Notificacion de exito
 */

notificaciones.top.exito = (Mensaje) => {
    notificaciones.top.fire({
        icon: 'success',
        title: Mensaje
    })
} 

/**
 * @module notificaciones.top.error
 * @example safix.notificaciones.top.error('error')
 * @description Notificacion de error
 */

notificaciones.top.error = (Mensaje) => {
    notificaciones.top.fire({
        icon: 'error',
        title: Mensaje
    })
} 

/**
 * @module notificaciones.top.aviso
 * @example safix.notificaciones.top.aviso('warn')
 * @description notificacion de advertencia
 */

notificaciones.top.aviso = (Mensaje) => {
    notificaciones.top.fire({
        icon: 'warning',
        title: Mensaje
    })
}

/**
 * @module alertas.notificacion.bottom
 * @example safix.alertas.notificacion.bottom.fire('Mensaje');
 * @description Definicion de notificaciones ubicadas en la parte superior de la vista.
*/
notificaciones.bottom = Swal.mixin({
    toast: true,
    position: `bottom-end`,
    showConfirmButton: false,
    returnFocus: false,
    timer: 10000,
    timerProgressBar: true,
    didOpen: (toast) => {
        toast.addEventListener(`mouseenter`, Swal.stopTimer)
        toast.addEventListener(`mouseleave`, Swal.resumeTimer)
    }
}) 

/**
 * @module notificaciones.bottom.exito
 * @example safix.notificaciones.bottom.exito('succesful')
 * @description Notificacion de exito
 */

notificaciones.bottom.exito = (Mensaje) => {
    notificaciones.bottom.fire({
        icon: 'success',
        title: Mensaje
    })
} 

/**
 * @module notificaciones.bottom.error
 * @example safix.notificaciones.bottom.error('error')
 * @description Notificacion de error
 */

notificaciones.bottom.error = (Mensaje) => {
    notificaciones.bottom.fire({
        icon: 'error',
        title: Mensaje
    })
} 

/**
 * @module notificaciones.bottom.aviso
 * @example safix.notificaciones.bottom.aviso('warn')
 * @description notificacion de advertencia
 */

notificaciones.bottom.aviso = (Mensaje) => {
    notificaciones.bottom.fire({
        icon: 'warning',
        title: Mensaje
    })
} 