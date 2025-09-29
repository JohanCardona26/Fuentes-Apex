/**
 * @namespace safix
 * @description Modulo inicial del modulo safix.
 * @author Johan Cardona
 * @note Este archivo contiene el modulo inicial safix, que nos ayuda a gestionar los diferentes eventos o procesos del aplicativo.
 * @version 1.0.0 creacion archivo.
 * @version 1.0.1 Mejora de la documentacion.
 * @version 1.0.2 Correccion de errores en la documentacion.
 * @version 1.0.3 Mejora de la estructura del codigo, incluyendo funcionalidades nativas de ORACLE APEX.
 * @version 1.0.4 Mejora de la gestion de eventos del service worker.
 **/

// const safix = {};

const safix = {
    // Ultimo item enfocado
    ultimoItemFocus : null,
    // Validar datos nulos
    nvl : (valorPrincipal, valorReemplaza) => {
        return valorPrincipal || valorReemplaza;
    },
    // Función para detectar si se accede desde un dispositivo móvil
    esDispositivoMovil : () => {
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    },
    // Codigos HEX de colores de la aplicacion
    colores: {
        VA_ROJO     : "#c1121f",
        VA_NARANAJA : "#ff7300",
        VA_AZUL     : "#0509fa",
        VA_VERDE    : "#0f848c",
        VA_AMARILLO : "#ffff00",
        VA_BLANCO   : "#ffffff",
        VA_GRIS     : "#b8b4b4",
        VA_GRIS_OSCURO  : "#5a5a5a"
    },
    // Codigos HEX de colores pastel de la aplicacion
    coloresPastel: {
        VA_ROJO     : "#FADBD8",
        VA_NARANAJA : "#ffe8d8",
        VA_AZUL     : "#dde8f9",
        VA_VERDE    : "#d2ebd2",
        VA_AMARILLO : "#FCF3CF"
    },
    // Objecto para gestion de Index DB
    IndexDB: {
        dbName : "IndexDB - Safix",
        storeName : "registros",
        dbVersion : 1,
        Usuarios : "Users", 
        Terminal : "DatosTerminal"
    },
    VariablesPwa: {
        url_service_worker  : "/sw_safix.js",
        splitHref   : window.location.href.split(`/`)
    }, 
    idHojaEstilosInyectada: 'estilos-inyectados-js'
};

const apx_xenco = safix;
const paginaActual = $v(`pFlowStepId`);
const aplicacionActual  = $v(`pFlowId`);
const appImages_1 = '#THEME_IMAGES#css/Vista#MIN#.css?v=#APEX_VERSION#';
const appImages = '#THEME_IMAGES#css/Vista#MIN#.css?v=#APEX_VERSION#';
const verErroresConsola = true;
var verLogsConsola = false;
var verAvisosConsola = false;

// Codigo comentado ya que no se usa en la aplicacion
// Columnas de multiregistros
// var columnMuyCorta, columnCorta, columnMediana, columnGrande, columnMuyGrande;
// Asignar los atributos
// var linkElement = document.createElement('link');
// linkElement.rel     = 'manifest';
// linkElement.href    = '#APP_FILES#pwa_icons/manifest.json';
// linkElement.id      = "manifest_apex212";
// document.head.appendChild(linkElement);

safix.VariablesPwa.route       = `${safix.VariablesPwa.splitHref[0]}/${safix.VariablesPwa.splitHref[1]}/${safix.VariablesPwa.splitHref[2]}/${safix.VariablesPwa.splitHref[3]}`;
safix.VariablesPwa.icons_route = `${safix.VariablesPwa.route}${appImages_1}`;
safix.VariablesPwa.url         = `${safix.VariablesPwa.route}/f?p=105:10064`;

// Feb 05 2025. Johan Cardona. Evento de focus sobre ultimo item.
document.addEventListener("focusin", (event) => {
    if (event.target.matches('input, select, textarea')) { 
        safix.ultimoItemFocus = event.target.id;
    }
});


(function () {
    if (safix.esDispositivoMovil()) {
        console.log("Estás accediendo desde un dispositivo móvil.");
    } else {
        console.log("Estás accediendo desde una computadora de escritorio.");
    }
})();