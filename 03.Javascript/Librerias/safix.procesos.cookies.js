/**
 * @Namespace procesos.cookies
 * @description Modulo de procesos de js, utilizada para el registro y trata de cookies
 */

const cookies = {};

safix.procesos.cookies = cookies;

/**
 * @module procesos.cookies.alerta()
 * @example safix.procesos.cookies.alerta();
 * @Descripcion Se utiliza como alerta del sistema para validar permisos de almacenar cookies
 */
cookies.alerta = () => {
    safix.alertas.centrales.fire(
        `Aviso de Cookies`,
        `Este sitio web utiliza cookies para mejorar la experiencia del usuario. ¿Aceptas el uso de cookies?`,
        `info`
    ).then((e) => {
        if (e.isConfirmed) {
            safix.procesos.mensajesConsola.aviso(`El usuario ha aceptado las cookies.`);
            safix.procesos.cookies.guardar({auth : `S`});
        } else {
            safix.procesos.mensajesConsola.aviso(`El usuario ha rechazado  las cookies.`);
            safix.procesos.cookies.guardar({auth : `N`});
        }
    });
}

/**
 * @module procesos.cookies.guardar()
 * @example safix.procesos.cookies.guardar(`{miCookie:valor}`);
 * @Descripcion Se utiliza para almacenar las cookies del usuario
 * @param {json con los datos de la cookie} datosCookie 
 */
cookies.guardar = (datosCookie) => {

    let almacenar = (nombre, valor) => {
        let dias = 365;
        let fechaExpiracion = new Date();

        fechaExpiracion.setDate(fechaExpiracion.getDate() + dias);

        let cookieValor = escape(valor) + ((dias == null) ? "" : "; expires=" + fechaExpiracion.toUTCString());

        safix.procesos.mensajesConsola.log(`Ingresa a registrar cookie`, nombre ,valor, cookieValor );

        document.cookie = nombre.trim() + "=" + cookieValor;
    };    

    try {
        // Verificar si el JSON es un objeto simple o un array
        if (Array.isArray(datosCookie)) {
            // Si es un array, usar forEach para recorrer cada elemento
            datosCookie.forEach(function(elemento) {
                for (var clave in elemento) {
                    if (elemento.hasOwnProperty(clave)) {
                        almacenar(clave , elemento[clave]);
                    }
                }
            });
        } else {
            for (var clave in datosCookie) {
                if (datosCookie.hasOwnProperty(clave)) {
                    almacenar(clave , datosCookie[clave]);
                }
            }
        }
    } catch (error) {
        safix.procesos.mensajesConsola.error(`Error guardando la cookies ${datosCookie}`, error);
    }
}

/**
 * @module procesos.cookies.obtener()
 * @example safix.procesos.cookies.obtener(`miCookie`)
 * @Descripcion Se utiliza para obtener las cookies almacenadas
 * @param {nombre de la cookie como se va a almacenada} idCookie 
 * @returns valor de la cookie ingresada
 */
cookies.obtener = (idCookie) => {

    var nombreCookie    = idCookie + "=";
    var v_cookies       = document.cookie.split(';');
    var valorCookie;

    try {
        for(var i = 0; i < v_cookies.length; i++) {
            var cookie = v_cookies[i].trim();
            if (cookie.indexOf(nombreCookie) == 0) {
                valorCookie = cookie.substring(nombreCookie.length);
            }
        }
    
        safix.procesos.mensajesConsola.log(`Ingresa a obtener cookie`, nombreCookie ,valorCookie);
    } catch (error) {
        safix.procesos.mensajesConsola.error(`Error obteniendo la cookie ${idCookie}`, error);
        valorCookie = null;
    }

    return valorCookie;
}

/**
 * @module procesos.cookies.eliminar()
 * @example safix.procesos.cookies.eliminar(`miCookie`)
 * @description se utiliza para borrar cookies del sistema
 * @param {nombre de la cookie} idCookie 
 */
cookies.eliminar = (idCookie) => {
    try {
        document.cookie = idCookie + '=; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    } catch (error) {
        safix.procesos.mensajesConsola.error(`Error eliminando cookie`, error);
    }
}