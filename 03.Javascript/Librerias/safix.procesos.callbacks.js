/**
 * @Namespace procesos.callbacks
 * @description Modulo de procesos de js, utilizada para el manejo de procesos callbacks
 */

const callbacks = {};

safix.procesos.callbacks = callbacks;

/**
 * @module procesos.callbacks.ejecutar()
 * @example safix.procesos.callbacks.ejecutar('nameProcedure', ...otros argumentos);
 * @Descripcion Se utiliza para la ejecucion de callbacks
 * @Comentario Se llama desde acciones dinamicas, o otras funciones 
 * @param {Nombre del procedimiento} callback 
 * @param  {...otros parametros} parametrosCallback 
 */
callbacks.ejecutar = (callback, ...parametrosCallback) => {
    try {
        //Mensajes en consola
        safix.procesos.mensajesConsola.log('Empieza a ejecutar el callback ' + callback);
        safix.procesos.mensajesConsola.log('Mostrar alerta');
        //alerta de carga inicial
        safix.alertas.carga('Este proceso puede tardar unos segundos', 15000);
        //ejecucion del callback
        apex.server.process(callback,
        {
            pageItems : procesos.ArmarParametrosPageItems().join(',')
           ,x01: safix.procesos.ArmarParametrosX01() //items de toda la pagina
           ,x02: safix.procesos.ArmarParametrosX02() // columnas de todos los grids de la pagina
           ,x03: safix.procesos.ArmarParametrosX03() // Items de toda la pagina como objecto, id -> value
           ,x04: parametrosCallback[0]
           ,x05: parametrosCallback[1]
           ,x06: parametrosCallback[2]
           ,x07: parametrosCallback[3]
           ,x08: parametrosCallback[4]
           ,x09: parametrosCallback[5]
           ,x10: parametrosCallback[6]
           ,x11: parametrosCallback[7]
        },
        {
            success: function (res) {
                Swal.close() //cuando hay respuesta cerramos la alerta de carga
                safix.procesos.mensajesConsola.log('Esconder alerta');
                safix.procesos.mensajesConsola.log('Respuesta del calback ', callback, res);
                safix.procesos.callbacks.validarRespuesta(res);
            }
        },
        {
            error: function (res) {
                safix.procesos.mensajesConsola.error('Error de ejecucion del callback', res);
                //cuando hay errores solo se mostarara la alerta con el error
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    returnFocus: false,
                    text: "Favor valide, el proceso no quedo bien instalado"
                });
            }
        });
    } catch (error) {
        Swal.close()
        safix.procesos.mensajesConsola.error('Error en la ejecucion de proceso', error);
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            returnFocus: false,
            text: "Se presento un error en la ejecucion del proceso " + error
        });
    }
}

/** Asigancion para versiones anteriores */
safix.procesos.ejecutarCallback = callbacks.ejecutar;

/**
 * @module procesos.callbacks.ejecutarSinAlertaCarga()
 * @example safix.procesos.callbacks.ejecutarSinAlertaCarga('nameProcedure', ...otros argumentos);
 * @Descripcion Se utiliza para ejecutar callbacks sin alerta de carga
 * @Comentario Se llama desde acciones dinamicas, o otras funciones 
 * @param {Nombre del procedimiento} callback 
 * @param  {...otros parametros} parametrosCallback 
 */
callbacks.ejecutarSinAlertaCarga = (callback, ...parametrosCallback) => {
    //Mensajes en consola
    safix.procesos.mensajesConsola.log('Empieza a ejecutar el callback ' + callback);
    //ejecucion del callback
    apex.server.process(callback,
    {
        x01: safix.procesos.ArmarParametrosX01() //items de toda la pagina
       ,x02: safix.procesos.ArmarParametrosX02() // columnas de todos los grids de la pagina
       ,x03: safix.procesos.ArmarParametrosX03() // Items de toda la pagina como objecto, id -> value
       ,x04: parametrosCallback[0]
       ,x05: parametrosCallback[1]
       ,x06: parametrosCallback[2]
       ,x07: parametrosCallback[3]
       ,x08: parametrosCallback[4]
       ,x09: parametrosCallback[5]
       ,x10: parametrosCallback[6]
       ,x11: parametrosCallback[7]
    },
    {
        success: function (res) {
            safix.procesos.mensajesConsola.log('Respuesta del calback ', callback, res);
            safix.procesos.callbacks.validarRespuesta(res);
        }
     },
     {
        error: function (res) {
            safix.procesos.mensajesConsola.error('Error de ejecucion del callback', res);
            //cuando hay errores solo se mostarara la alerta con el error
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                returnFocus: false,
                text: "Favor valide, el proceso no quedo bien instalado"
            });
        }
     });
}

/**
 * @module procesos.callbacks.ejecutarComoPromesa()
 * @param {nombre del procedimiento ajax callback} callback 
 * @param  {...any} parametrosCallback 
 * @example safix.procesos.callbacks.ejecutarComoPromesa('nameProcedure', ...otros argumentos);
 * @description Se utiliza para la ejecucion de callbacks con promesa
 **/
callbacks.ejecutarComoPromesa = (callback, ...parametrosCallback) => {
    //Mensajes en consola
    safix.procesos.mensajesConsola.log('Empieza a ejecutar el callback ' + callback);
    safix.procesos.mensajesConsola.log('Mostrar alerta');
    
    //alerta de carga inicial
    safix.alertas.carga('Este proceso puede tardar unos segundos', 15000);
    
    //ejecucion del callback
    return new Promise((resolve, reject) => {
        try {
            apex.server.process(callback, {
                x01: safix.procesos.ArmarParametrosX01() //items de toda la pagina
               ,x02: safix.procesos.ArmarParametrosX02() // columnas de todos los grids de la pagina
               ,x03: safix.procesos.ArmarParametrosX03() // Items de toda la pagina como objecto, id -> value
               ,x04: parametrosCallback[0]
               ,x05: parametrosCallback[1]
               ,x06: parametrosCallback[2]
               ,x07: parametrosCallback[3]
               ,x08: parametrosCallback[4]
               ,x09: parametrosCallback[5]
               ,x10: parametrosCallback[6]
               ,x11: parametrosCallback[7]
           },
           {
               success: function(res){
                   //Mensajes de consola
                   safix.procesos.mensajesConsola.log('Respuesta del calback ', callback, res);
                   safix.procesos.mensajesConsola.log('Esconder alerta');
                   
                   //cuando hay respuesta cerramos la alerta de carga
                   Swal.close() 
                   
                   safix.procesos.callbacks.validarRespuesta(res);
                   
                   resolve(res);
               }
           },
           {
               error: function(res){
                   safix.procesos.mensajesConsola.error('Error de ejecucion del callback', res);
                   
                   //cuando hay errores solo se mostarara la alerta con el error
                   Swal.fire({
                       icon: 'error',
                       title: 'Oops...',
                       returnFocus: false,
                       text: "Favor valide, el proceso no quedo bien instalado"
                   });
   
                   reject(new Error('Favor valide, el proceso no quedo bien instalado'));
               }
           })
        } catch (error) {
            Swal.close()
            safix.procesos.mensajesConsola.error('Error en la ejecucion de proceso', error);
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                returnFocus: false,
                text: "Se presento un error en la ejecucion del proceso " + error
            });

            reject(new Error("Se presento un error en la ejecucion del proceso " + error));
        }
    });
};

/** Asigancion para versiones anteriores */
safix.procesos.ejecutarCallbackPromiss = callbacks.ejecutarComoPromesa;

/**
 * @module procesos.callbacks.ejecutarComoPromesaSinAlerta()
 * @param {nombre del procedimiento ajax callback} callback 
 * @param  {...any} parametrosCallback 
 * @example safix.procesos.callbacks.ejecutarComoPromesaSinAlerta('nameProcedure', ...otros argumentos);
 * @description Se utiliza para la ejecucion de callbacks con promesa
 **/
callbacks.ejecutarComoPromesaSinAlerta = (callback, ...parametrosCallback) => {
    //Mensajes en consola
    safix.procesos.mensajesConsola.log('Empieza a ejecutar el callback ' + callback);
    
    //ejecucion del callback
    return new Promise((resolve, reject) => {
        apex.server.process(callback, {
             x01: safix.procesos.ArmarParametrosX01() //items de toda la pagina
            ,x02: safix.procesos.ArmarParametrosX02() // columnas de todos los grids de la pagina
            ,x03: safix.procesos.ArmarParametrosX03() // Items de toda la pagina como objecto, id -> value
            ,x04: parametrosCallback[0]
            ,x05: parametrosCallback[1]
            ,x06: parametrosCallback[2]
            ,x07: parametrosCallback[3]
            ,x08: parametrosCallback[4]
            ,x09: parametrosCallback[5]
            ,x10: parametrosCallback[6]
            ,x11: parametrosCallback[7]
        },
        {
            success: function(res){
                //Mensajes de consola
                safix.procesos.mensajesConsola.log('Respuesta del calback ', callback, res);
                safix.procesos.callbacks.validarRespuesta(res);
                resolve(res);
            }
        },
        {
            error: function(res){
                safix.procesos.mensajesConsola.error('Error de ejecucion del callback', res);
                
                //cuando hay errores solo se mostarara la alerta con el error
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    returnFocus: false,
                    text: "Favor valide, el proceso no quedo bien instalado"
                });

                reject(new Error('Favor valide, el proceso no quedo bien instalado'));
            }
        }
        )
    });
};

/**
 * @module procesos.callbacks.validarRespuesta
 * @example safix.procesos.callbacks.validarRespuesta(res)
 * @description Se utiliza para procesar las respuestas de los callbacks, sea por promesa o por proceso tradicional
 * @param {respuesta del proceso callback} res 
 * @Funcionalidades     Todos los nombres de funcionalidades son con Inicial mayuscula
 * @Errores             Debes retornar 'S' o 'N', esto para validar si hubo errores en la ejecucion del procedimiento
 * @Ejecutar            debes retorna el nombre del procedimiento que se va a ejecutar, esto para realizar ejecuciones de procedimientos callback desde otro
 * @Asignaciones        Debes retornar 'S' o 'N', esto para validar si el procedimiento realiza Set_Values
 * @Enfocar             Retorna el id del item que se va a enfocar
 * @TipoLink            Retorna el tipo de link al que se va redireccionar "MODAL", "NORMAL"
 * @URL                 Link al que se va a redireccionar este no se ejecuta si no se manda el elemento "TipoLink"
 * @LimpiarFormulario   debes retorna "S" o "N", esto para limpiar todos los items de la pagina
 * @Mensaje             debes retornar un mensaje de error que se imprime en la alerta
 * @MensajeExito        debe retornar un mensaje de exito
 * @MensajeConfirmacion debes retornar un mensaje de confirmacion este debe ir acompañado de una accion de cofirmacion y otra de cancelacion
 * @AccionConfirma      debes retornar el procedimiento que se ejecuta cuando el usuario presiona confirmar en la alerta
 * @AccionNoConfirma    debes retornar el procedimiento que se ejecuta cuando el usuario presiona cancelar en la alerta
 * @HabilitarItem       debes retornar el nombre del item para habilitarlo
 * @DesahabilitarItem   debes retornar el nombre del item para deshabilitarlo
 * @PintarItem          nombre del item a pintar
 * @Color               color que se va a pintar el item 
 * @Avisos              Ejecuta una lista de alertas y las muestra en pantalla como avisos, se espera un array
 * @Alerta              Ejecuta un aviso en pantalla
 * @EntitularRegId      Esta funcionalidad la utilizamos para entitular regiones esta etiqueta funciona en conjunto con @EntitularRegName
 * @EntitularRegName    Esta etiqueta permite ponerle titulos con estandar safix a la region con el id @EntitularRegId
 */
callbacks.validarRespuesta = (res) => {
    try {
        /**
         * @Errores 
         * Validacion de errores en procedimientos
         * Apex_Json.Write('Errores', 'S') inidica que hay errores
         * Apex_Json.Write('Errores', 'N') inidica que no hay errores
         * @Mensaje 
         * Mensaje de error que se imprime en caso de haber uno en el procedimiento
         * Apex_Json.Write('Mensaje', 'MI MENSAJE.....')
         * @MensajeExito
         * Mensaje de exito en caso de que el procedimiento se haya realizado exitosamente
         * Apex_Json.Write('MensajeExito', 'MI MENSAJE.....')
         */
        if(res.Errores == "S"){
            //cuando hay errores solo se mostarara la alerta con el error
            safix.procesos.mensajesConsola.error('Con errores', res.Mensaje);
            safix.alertas.toast.error(res.Mensaje);
        } else {
            safix.procesos.mensajesConsola.aviso('Sin errores');
            if (res.MensajeExito || res.Mensaje){
                safix.procesos.mensajesConsola.aviso('Con mensaje de exito', res.MensajeExito, res.Mensaje );
                safix.alertas.toast.exito(safix.nvl(res.MensajeExito, res.Mensaje));
            } else {
                if (res.Alerta) {
                    safix.procesos.mensajesConsola.aviso('Con alerta ', res.Alerta);
                    safix.alertas.aviso(res.Alerta);
                }
            };
        }
    
        /**
         * @Asignaciones
         * asiganaciones a items
         * Apex_Json.Write('Asignaciones', 'S') Solo indica que si hay asignaciones
         * @IMPORTANTE "Asignaciones" ESTE ELEMENTO SOLO VALIDA SI HAY ASIGNACIONES EL VALOR SE PUEDE ENVIAR DE LA SIGUIENTE MANERA DESDE EL PROCEDIMIENTO
         * (Apex_Json.Write('P1_MYITEM', 'VALOR123')),  Esta forma ejecutara acciones dinamicas sobre el item que se hizo el cambio, ejemmplo si en P1_MYITEM tengo una accion dinamica CHANGE esta se ejecuatara
         * (Apex_Json.Write('#P1_MYITEM','VALOR123')),  Esta forma solo asigna el valor si ejecutar acciones dinamicas
         * (Apex_Json.Write('$P1_MYITEM','VALOR123')),  Esta forma es para enmascarar en pesos el valor, ejecuta acciones dinamicas
         * (Apex_Json.Write('€P1_MYITEM','VALOR123')),  Esta forma es para enmascarar en euros el valor, ejecuta acciones dinamicas
         * (Apex_Json.Write('DP1_MYITEM','VALOR123')),  Esta forma es para enmascarar en dolares el valor, ejecuta acciones dinamicas
         * (Apex_Json.Write('$#P1_MYITEM','VALOR123')), Esta forma es para enmascarar en pesos el valor, no ejecuta acciones dinamicas
         * (Apex_Json.Write('€#P1_MYITEM','VALOR123')), Esta forma es para enmascarar en euros el valor, no ejecuta acciones dinamicas
         * (Apex_Json.Write('D#P1_MYITEM','VALOR123')), Esta forma es para enmascarar en dolares el valor, no ejecuta acciones dinamicas
         */
        if (res.Asignaciones == "S"){
            safix.procesos.mensajesConsola.aviso('Con Set Values', res.Asignaciones);
            //loop que recorre y asigna los valores a los items que se enviaron por el AJAX_CALLBACK
            safix.procesos.asignaciones(res);
        };

        /**
         * @Enfocar 
         * Enfocar Items
         * Apex_Json.Write('Enfocar', 'P1_MYITEM')
         */
        
        if (res.Enfocar) {
            safix.procesos.mensajesConsola.aviso('Con Focus', res.Enfocar);
            document.getElementById(res.Enfocar).focus();
        };
            
        /**
         * @TipoLink 
         * Redirecionamiento desde un procedimiento 
         * Apex_Json.Write('TipoLink', 'MODAL') Redireccionamiento a paginas flotantes
         * Apex_Json.Write('TipoLink', 'NORMAL') Redireccionamiento a paginas normales
         * @URL
         * link donde se va a redireccionar 
         * Apex_Json.Write('URL', '....');
         */
        
        if (res.URL){
            safix.procesos.mensajesConsola.aviso('Con url', res.URL );
            if (res.TipoLink){
                safix.procesos.mensajesConsola.aviso('Con tipo de link', res.TipoLink );

                safix.procesos.redirecionamiento(res.TipoLink, res.URL);
            }else {
                safix.procesos.mensajesConsola.error('Sin tipo de link', res.TipoLink );
            }
        }
        
        /**
         * @LimpiarFormulario 
         * Borrar el contenido de la vista del formulario
         * Apex_Json.Write('LimpiarFormulario', 'S')
         */
        
        if (res.LimpiarFormulario == "S"){
            safix.procesos.limpiarFormulario();
            safix.procesos.mensajesConsola.log('Con Limpieza de la forma' );
            safix.procesos.asignaciones(res);
            safix.procesos.mensajesConsola.log('Re asignacion de items requeridos' );
        };

        /**
         * @HabilitarItem 
         * Habilitacion de items
         * Apex_Json.Write('HabilitarItem', 'P1_MYITEM');
         */
        let itemHabilitar =  res.HabilitarItem;  
        
        if (itemHabilitar){
            safix.procesos.mensajesConsola.aviso('Con habilitacion de items', itemHabilitar);
            if (itemHabilitar.includes("P" + paginaActual)){
                safix.procesos.mensajesConsola.log('Se valida que si sea un item de la pagina');
                let item;
                if (itemHabilitar.includes('#')){
                    item = itemHabilitar;
                }else {
                    item = "#" + itemHabilitar;
                };
                
                safix.procesos.habilitarItems(item);
            }else{
                safix.procesos.mensajesConsola.log('El item que se requiere habilitar no pertenece a la actual pagina');
            }
        }
        
        /**
         * @DesahabilitarItem 
         * Deshabilitacion de items
         * Apex_Json.Write('DesahabilitarItem', 'P1_MYITEM');
         */    
        let itemDeshabilitar = res.DesahabilitarItem ;

        if (itemDeshabilitar){
            safix.procesos.mensajesConsola.aviso('Con deshabilitacion de items', itemDeshabilitar);
            if (itemDeshabilitar.includes("P"+paginaActual)){
                safix.procesos.mensajesConsola.log('Se valida que si sea un item de la pagina');
                let item;
                
                if (item.includes('#')){
                    item = itemDeshabilitar;
                }else {
                    item = "#" + itemDeshabilitar;
                };

                safix.procesos.desabilitarItem(item);
            } else {
                safix.procesos.mensajesConsola.log('El item que se requiere deshabilitar no pertenece a la actual pagina');
            }
        } 
        /**
         * @PintarItem
         * Pintar items, debe viajar con un color
         * Apex_Json.Write('PintarItem', 'P1_MYITEM');
         * Apex_Json.Write('color', 'red');
         */
        if (res.PintarItem){
            safix.procesos.mensajesConsola.aviso('Con pintado de items', res.PintarItem, 'color', res.Color);
            safix.procesos.pintarItem(res.PintarItem, res.Color)
        }

        /**
         * @Avisos
         * Sacar varias alertas o mensajes de un solo callback
         * Apex_Json.Open_Array('Avisos');
         * Apex_Json.Write('Tener en cuenta x'); 
         * Apex_Json.Write('Tener en cuenta y'); 
         * Apex_Json.Write('Tener en cuenta z'); 
         * Apex_Json.Close_Array('Avisos'); 
         */

        if (Array.isArray(res.Avisos)){
            if (res.Avisos.length > 0){
                safix.alertas.enlistadas(res.Avisos)
            }
        }

        /**
         * @MostrarRegion
         * Se toma el id mostrado se ubica la region y se muestra
         * Apex_Json.write('MostrarRegion', 'Id de la region')
         */

        let idRegionM = safix.nvl(res.MostrarRegion, 'N');

        if (idRegionM != 'N') {
            safix.procesos.mensajesConsola.aviso(`Muestra la region ${idRegionM}`);
            safix.procesos.mostrarRegion(idRegionM);
        }

        /**
         * @EsconderRegion
         * Se toma el id enviado y se esconde la region
         * Apex_Json.write('EsconderRegion', 'Id de la region')
         */

        let idRegionE = safix.nvl(res.EsconderRegion, 'N');

        if (idRegionE != 'N') {
            safix.procesos.mensajesConsola.aviso(`Esconde la region ${idRegionE}`);
            $x_Show(idRegionE);
        }

        /**
         * @Process Ejecutar
         * @description Se utiliza para llamar un procedimiento dentro de un mismo procedimiento callback
         * Apex_Json.Write('Ejecutar', 'Console.log()')
         * @Complemento1 Se puede enviar la variable <Confirmar_Ejecutar> en 'S', para confirmar el cambio
         * Apex_Json.Write('Confirmar_Ejecutar', 'S')
         * @Complemento2 cuando se requiere confirmar la ejecucion se envia el mansaje de confirmacion en la variable <MensajeConfirmacion>
         * Apex_Json.Write('MensajeConfirmacion', 'continuar?')
         * @Complemento3 para lo anterior enviar una accion en caso de que se confirme o se deniegue <ConfirmacionEjecuta> y <DeniegaEjecuta>
         * Apex_Json.Write('ConfirmacionEjecuta', '#codigo#')
         * @Complemento4 en caso de querer enviar codigo de js en las acciones enviar <TipoCodigoConfirmacionEjecuta> y <TipoFuenteDeniegaEjecuta>, en caso contrario se espera el nombre de un procedimiento callback 
         * Apex_Json.Write('TipoCodigoConfirmacionEjecuta', 'js')
         * @Complemento5 Se pueden enviar parametros de un callback a otro enviando del 4 a 10 parametros al servidor utilizar <Parametrox04>...<Parametrox10>
         * Apex_Json.Write('Parametrox04', 'IdCliente')
         * @Complemento6 Se incluye el envio del parametro 11, para procesamiento de data tipo XML
         */

        /**
         * @EjecutarJs 
         * Ejecucion de otros procedimientos desde un procedimiento
         * Apex_Json.Write('EjecutarJs', '#codigo#')
         */
        if (res.EjecutarJs){
            safix.procesos.mensajesConsola.log(`Se ejecuta el codigo js ${res.EjecutarJs}` );
            eval(res.EjecutarJs);
        }
        
        /**
         * @Ejecutar 
         * Ejecucion de otros procedimientos desde un procedimiento
         * Apex_Json.Write('Ejecutar', 'PU_MYPROCEDURE')
         */

        if (res.Ejecutar) { 
            safix.procesos.ejecutarCallback(res.Ejecutar);
            safix.procesos.mensajesConsola.aviso('Con ejecucion de otro procedimiento', res.Ejecutar);
        }

        /**
         * @RefrescarRegiones
         * Apex_Json.Write('RefrescarRegiones', 'idRegion')
         */
        if (res.RefrescarRegiones){
            safix.procesos.mensajesConsola.aviso('Refresca la region', res.RefrescarRegiones);
            apex.region(res.RefrescarRegiones).refresh();
        }

        /**
         * @EsconderItems
         * Apex_Json.Write('EsconderItems', 'P1_MYITEM;....')
         */
        if (res.EsconderItems){

            let items = res.EsconderItems.split(';');

            items.map((item, indice) => {
                safix.procesos.mensajesConsola.log('Esconder Item', item, indice);
                apex.item(item).hide();
            });
        }

        /**
         * @MostarItems
         * Apex_Json.Write('MostrarItems', 'P1_MYITEM;....')
         */
        if (res.MostrarItems){

            let items = res.MostrarItems.split(';');

            items.map((item, indice) => {
                safix.procesos.mensajesConsola.log('Mostrar Item', item, indice);
                apex.item(item).show();
            });
        }

        /**
         * @EntitularRegId
         * Mar 07 2025. Johan Cardona.
         * APEX_JSON.WRITE('EntitularRegId', '#IDREGION');
         * APEX_JSON.WRITE('EntitularRegName', '#TITULO');
         */
        if (res.EntitularRegId) {
            if (res.EntitularRegName){
                const titulosReg = safix.procesos.insertarEstiloPersonalizado(res.EntitularRegId, res.EntitularRegName);
            }
        }

    } catch (error) {
        Swal.close()
        safix.procesos.mensajesConsola.error('Error en la ejecucion de proceso', error);
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            returnFocus: false,
            text: "Se presento un error en la ejecucion del proceso " + error
        });
    }
}

safix.procesos.validarRespuestaCallback = callbacks.validarRespuesta;

callbacks.ejecutar2 = ({
    callback,
    parametrosCallback = [],
    Alerta = true
}) => {
    //Mensajes en consola
    safix.procesos.mensajesConsola.log('Empieza a ejecutar el callback ' + callback);

    if (Alerta === true) {
        safix.alertas.carga('Este proceso puede tardar unos segundos', 15000);
    }
    //ejecucion del callback
    return new Promise((resolve, reject) => {
        try {
            apex.server.process(callback, {
                pageItems : procesos.ArmarParametrosPageItems().join(',')
               ,x01: safix.procesos.ArmarParametrosX01() //items de toda la pagina
               ,x02: safix.procesos.ArmarParametrosX02() // columnas de todos los grids de la pagina
               ,x03: safix.procesos.ArmarParametrosX03() // Items de toda la pagina como objecto, id -> value
               ,x04: parametrosCallback[0]
               ,x05: parametrosCallback[1]
               ,x06: parametrosCallback[2]
               ,x07: parametrosCallback[3]
               ,x08: parametrosCallback[4]
               ,x09: parametrosCallback[5]
               ,x10: parametrosCallback[6]
               ,x11: parametrosCallback[7]
           },
           {
               success: function(res){
                   //Mensajes de consola
                   safix.procesos.mensajesConsola.log('Respuesta del calback ', callback, res);
                   safix.procesos.mensajesConsola.log('Esconder alerta');
                   
                   //cuando hay respuesta cerramos la alerta de carga
                   Swal.close() 
                   
                   safix.procesos.callbacks.validarRespuesta(res);
                   
                   resolve(res);
               }
           },
           {
               error: function(res){
                   safix.procesos.mensajesConsola.error('Error de ejecucion del callback', res);
                   
                   //cuando hay errores solo se mostarara la alerta con el error
                   Swal.fire({
                       icon: 'error',
                       title: 'Oops...',
                       returnFocus: false,
                       text: "Favor valide, el proceso no quedo bien instalado"
                   });
   
                   reject(new Error('Favor valide, el proceso no quedo bien instalado'));
               }
           })
        } catch (error) {
            Swal.close()
            safix.procesos.mensajesConsola.error('Error en la ejecucion de proceso', error);
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                returnFocus: false,
                text: "Se presento un error en la ejecucion del proceso " + error
            });

            reject(new Error("Se presento un error en la ejecucion del proceso " + error));
        }
    });
}