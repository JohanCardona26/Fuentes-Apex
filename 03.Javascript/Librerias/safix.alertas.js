/**
 * @namespace alertas
 */
const alertas = {};

safix.alertas = alertas;


/**
 * @module alertas.carga
 * @example safix.alertas.carga('favor esperar!!!')
 * @description alerta de carga 
 */
alertas.carga = (Mensaje) =>{
    Swal.fire({
        title: 'Validando!',
        html: Mensaje,
        timerProgressBar: true,
        timer: 300000, // Feb 05 2025. Johan cardona. Tiempo maximo de carga de 5 minutos 
        allowOutsideClick: false,
        returnFocus: false,
        didOpen: () => {
            Swal.showLoading()
        }
        }).then((result) => {
        if (result.dismiss === Swal.DismissReason.timer) {
            null;
        }
    });
};

/**
 * @module alertas.exito
 * @example safix.alertas.exito('successful', 15000)
 * @description alerta de exito 
 */

alertas.exito = (Mensaje, Tiempo) => {
    Swal.fire({
        position: 'top-end',
        icon: 'success',
        title: Mensaje,
        showConfirmButton: false,
        returnFocus: false,
        timer: Tiempo || 2000
    })
};

/**
 * @module alertas.error
 * @example safix.alertas.error('error')
 * @description alerta de error 
 */

alertas.error = (Mensaje) => {
    Swal.fire({
        icon: 'error',
        title: 'Oops...',
        returnFocus: false,
        allowOutsideClick: false,
        showConfirmButton : true, 
        confirmButtonColor: safix.colores.VA_GRIS_OSCURO, 
        confirmButtonText : 'Cerrar',
        text: Mensaje
    });
};

/**
 * @module alertas.aviso
 * @example safix.alertas.aviso('aviso')
 * @description alerta de aviso 
 */

alertas.aviso = (Mensaje) => {
    return new Promise((resolve) => {
        Swal.fire({
            icon: 'warning',
            title: 'Oops...',
            returnFocus: false,
            allowOutsideClick: false,
            showConfirmButton: true, 
            confirmButtonColor: safix.colores.VA_GRIS_OSCURO, 
            confirmButtonText: 'Cerrar',
            text: Mensaje
        }).then((result) => {
            resolve(result.isConfirmed);
        });
    });
  };

/**
 * @module alertas.superiores
 * @example safix.alertas.superiores
 * @description alertas que se muestran en el lado superior izquierdo de la pantalla principal
*/

alertas.superiores = Swal.mixin({
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

alertas.toast = alertas.superiores;

/**
 * @module alertas.superiores.exito
 * @example safix.alertas.superiores.exito('succesful')
 * @description alerta superior de exito
 */

alertas.superiores.exito = (Mensaje) => {
    alertas.superiores.fire({
        icon: 'success',
        title: Mensaje
    })
} 

/**
 * @module alertas.superiores.error
 * @example safix.alertas.superiores.error('error')
 * @description alerta superior de error
 */

alertas.superiores.error = (Mensaje) => {
    alertas.superiores.fire({
        icon: 'error',
        title: Mensaje
    })
} 

/**
 * @module alertas.superiores.aviso
 * @example safix.alertas.superiores.aviso('aviso')
 * @description alerta superior de aviso 
 */

alertas.superiores.aviso = (Mensaje) => {
    alertas.superiores.fire({
        icon: 'warning',
        title: Mensaje
    })
} 

/**
 * @module alertas.inferiores
 * @example safix.alertas.inferiores()
 * @description alertas en la parte inferior de la pagina principal
 */

alertas.inferiores = Swal.mixin({
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
 * @module alertas.inferiores.exito
 * @example safix.alertas.inferiores.exito('succesful')
 * @description alerta inferior de exito
 */

alertas.inferiores.exito = (Mensaje) => {
    alertas.inferiores.fire({
        icon: 'success',
        title: Mensaje
    })
} 

/**
 * @module alertas.inferiores.error
 * @example safix.alertas.inferiores.error('error')
 * @description alerta inferior de error
 */

alertas.inferiores.error = (Mensaje) => {
    alertas.inferiores.fire({
        icon: 'error',
        title: Mensaje
    })
} 

/**
 * @module alertas.inferiores.aviso
 * @example safix.alertas.inferiores.aviso('aviso')
 * @description alerta inferior de aviso 
 */

alertas.inferiores.aviso = (Mensaje) => {
    alertas.inferiores.fire({
        icon: 'warning',
        title: Mensaje
    })
}

/**
 * @module alertas.interactivas
 * @example safix.alertas.interactivas.fire('Esta seguro de continuar?')
 * @description plantilla de alertas con botones, en la parte central de la pagina
 */

alertas.interactivas = Swal.mixin({
    icon: `question`,
    showCancelButton: true,
    cancelButtonText : 'No',
    confirmButtonText : 'Si',
    confirmButtonColor: safix.colores.VA_VERDE,
    cancelButtonColor: safix.colores.VA_ROJO,
})

alertas.centrales = alertas.interactivas;