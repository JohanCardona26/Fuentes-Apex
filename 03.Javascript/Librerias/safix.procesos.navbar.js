/**
 * @Namespace procesos.navbar
 * @description Funcionalidades de la barra de navegacion
 */

const navbar = {};

safix.procesos.navbar = navbar;

/**
 * @module procesos.navbar.primerRegistro
 * @description Busqueda del primer registro
 */
navbar.primerRegistro = () => {
    safix.procesos.mensajesConsola.log(`Se dio clic en el boton de buscar primer registro`, `Funcionalidades de barra de herramientas`);
} 

/**
 * @module procesos.navbar.anteriorRegistro
 * @description Buscar el anterior registro 
 */
navbar.anteriorRegistro = () =>{
    safix.procesos.mensajesConsola.log(`Se dio clic en el boton de buscar anterior registro`, `Funcionalidades de barra de herramientas`);
}

/**
 * @module procesos.navbar.siguienteRegistro
 * @description Buscar el siguiente registro 
 */
navbar.siguienteRegistro = () =>{
    safix.procesos.mensajesConsola.log(`Se dio clic en el boton de buscar siguiente registro`, `Funcionalidades de barra de herramientas`);
}

/**
 * @module procesos.navbar.ultimoRegistro
 * @description Buscar el ultimo registro 
 */
navbar.ultimoRegistro = () =>{
    safix.procesos.mensajesConsola.log(`Se dio clic en el boton de buscar ultimo registro`, `Funcionalidades de barra de herramientas`);
}

/**
 * @module procesos.navbar.guardar
 * @description Guardar cambios en el formulario
 */
navbar.guardar = () =>{
    safix.procesos.mensajesConsola.log(`Se dio clic en el boton de guardar`, `Funcionalidades de barra de herramientas`);
}

/**
 * @module procesos.navbar.limpiarFormulario
 * @description limpiar formulario
 */
navbar.limpiarFormulario = () =>{
    safix.procesos.mensajesConsola.log(`Se dio clic en el boton de limpiar formulario`, `Funcionalidades de barra de herramientas`);
}

/**
 * @module procesos.navbar.eliminarRegistro
 * @description eliminar registro
 */
navbar.eliminarRegistro = () =>{
    safix.procesos.mensajesConsola.log(`Se dio clic en el boton de eliminar registros`, `Funcionalidades de barra de herramientas`);
}

/**
 * @module procesos.navbar.prepararConsulta
 * @description preparar consulta
 */
navbar.prepararConsulta = () =>{
    safix.procesos.mensajesConsola.log(`Se dio clic en el boton de preparar consulta`, `Funcionalidades de barra de herramientas`);
}

/**
 * @module procesos.navbar.ejecutarConsulta
 * @description Ejecutar Consulta
 */
navbar.ejecutarConsulta = () =>{
    safix.procesos.mensajesConsola.log(`Se dio clic en el boton de ejecutar consulta`, `Funcionalidades de barra de herramientas`);
}

/**
 * @module procesos.navbar.infoCampo
 * @description informacion del campo
 */
navbar.infoCampo = () =>{
    safix.procesos.mensajesConsola.log(`Se dio clic en el boton de informacion del campo`, `Funcionalidades de barra de herramientas`);
}

/**
 * @module procesos.navbar.buscar
 * @description Buscar forma en Safix
 */
navbar.buscar = () => {
    safix.procesos.mensajesConsola.log(`Se realiza busqueda`, `Funcionalidades de barra de herramientas`, `${document.getElementById("itm-registro").value}`);
}
