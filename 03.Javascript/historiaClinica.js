let current_page = $('#pFlowStepId').val(), // PAGINA ACTUAL
    admision = $v('P0_IDADMISION'), // ADMISION ACTUAL
    fechas = $v('P' + current_page + '_TITLES'), // Traigo todas las fechas o titulos del grid
    _columns,       // SE UTILIZA PARA CAMBIAR EL TAMAÑO DE LAS COLUMNAS
    nLongitud = $v('P' + current_page + '_LONGITUD'), // SE UTILIZA PARA TRAER EL ESTATUS DE CANTIDAD DE CARACTERES MINIMOS DE UNA OBSERVACION
    respuesta,      // respuesta del usuario (Justificacion u observaciones en SweetAlert)
    idProducto,     // id del producto
    sequence,       // sequencia de la collecion
    fecha,
    fechaReal,
    horaReal,
    terminal,
    idUsuario,
    guardarObs;

function fjvBuscarInformacion() {
    let fechaI = $v('P' + current_page + '_FINICIAL'),
        fechaF = $v('P' + current_page + '_FFINAL'),
        horaI = $v('P' + current_page + '_HORAI'),
        horaF = $v('P' + current_page + '_HORAF');

    admision = $v('P0_IDADMISION');

    if (fechaI == '' || fechaF == '' || horaI == '' || horaF == '') { /// valido que los parametros no esten null
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Favor ingresar todos los parametros!',
            confirmButtonText: 'Cancelar',
        })
    } else {
        apex.server.process('PV_LLENAR_COLLECTION',
            {
                pageItems: '#P297_FINICIAL,#P297_FFINAL,#P297_HORAI,#P297_HORAF,#P0_IDADMISION',
                x01: 'Generar',
                x02: fechaI,
                x03: fechaF,
                x04: horaI,
                x05: horaF,
                x06: admision
            }, //Parametros que se le van a pasar al servidor
            {
                success: function (res) { //En caso de que el proceso sea exitoso
                    // apex.region("A").refresh();
                    apex.item('P' + current_page + '_TITLES').setValue(res.titulos);
                    apex.submit('submit');
                    console.log(res.titulos + 'titulos');
                    console.log(res.query + 'query');
                },
                error: function (e) {
                    console.log('Error: ' + JSON.stringify(e));
                }
            })
    }
};
// nov-08-2022 Sebastian Cardona. Función que llena el grid de medicamentos una vez se le de en el boton generar se ejecuta
function fjvEsconderDetalles() {
    if (screen.width > 1100 && screen.height > 700) {
        $('#ESCONDERDETALLE').show();
        $('#A td a').each((i, e) => {
            if (($(e).attr('href')).includes('p=105:309')) { $(e).removeAttr('href') }
        })
    } else {
        $('#ESCONDERDETALLE').hide();
    }
}

function fjvAnchoColumnas() {
    for (let index = 3; index < _columns.length + 3; index++) {
        if (index < 10) {
            apex.region("A").call("getViews").grid.view$.grid("setColumnWidth", "C00" + index, 150);
        } else {
            apex.region("A").call("getViews").grid.view$.grid("setColumnWidth", "C0" + index, 150);
        }
    }
};
// nov-08-2022 Sebastian Cardona. Función que modifica el tamaño de las columnas una vez ya se hay generado información en el grid

function fjvAccionesTablero(estado, columna, posicion) { // Se reciben tres parámetros el estado en el cual se encuentra la aplicación, la columna a la cual se le dio clic, y la posición (botón 1 // posición 1 y botón 2 // posicion 2)
    let selec = apex.region("A").call("getViews").grid.getSelectedRecords(),   // columna seleccionada en el grid     
        guardar = 'N',              // variable que va a validar si requiere hacer llamado al callback se inicializa en N y en la función se le reasigna el valor
        itemsSubmit;        // items que se le envian al serviddor
    fecha = fechas.split(',')[columna - 1]; // tomó la fecha que se seleccionó
    fechaReal = fecha.split(' ')[0]; // la fecha viene hora y fecha con el split separo la fecha de la hora y la guardo en cada variabble
    horaReal = fecha.split(' ')[1]; // variable donde queda la hora
    terminal = $v('P' + current_page + '_TERMINAL'); // obtenemos la terminal
    idUsuario = $v('P' + current_page + '_ID_USUARIO');   // obtenemos el id del usuario conectado    
    guardarObs = 'N';  // En caso de que la aplicacion requiera obsevaciones valido su guardado con esta variable
    idProducto = selec[0][49]; // id del prodcuto de la fila selecionada
    sequence = selec[0][50]; // sequence de la coleccion en la fila seleciionada

    switch (estado)  /// se realiza el switch al estado donde se valida el estado y este mismo se conectaría con el callback dependiendo del estado
    {
        case '1':
            if (posicion == '1') {

                Swal.fire('El medicamento ya se encuentra aplicado en la hora seleccionado');

            } else if (posicion == '2') {

                Swal.fire({
                    title: 'Justificación para desmarcar la aplicación',
                    input: 'text',
                    inputAttributes: {
                        autocapitalize: 'off'
                    },
                    showCancelButton: true,
                    confirmButtonText: 'Guardar',
                    showLoaderOnConfirm: true,
                    preConfirm: (respuesta) => {

                        if (respuesta.length == 0) {
                            Swal.showValidationMessage(
                                `Debe ingresar una justificación`
                            )
                            guardar = 'N';
                        } else if (respuesta.length < nLongitud) {
                            Swal.showValidationMessage(
                                `Debe ingresar una justificación minimo de ` + nLongitud + ` caracteres`
                            )
                            guardar = 'N';
                        } else {
                            // guardar = 'S';
                            itemsSubmit = '#P0_IDADMISION, #P' + current_page + '_TERMINAL, #P' + current_page + '_ID_USUARIO'; // items que se le envian al serviddor
                            fjvAccionarCallback(estado, columna, posicion, respuesta, 'PV_ACCIONES_TABLERO', itemsSubmit);
                        }
                    }
                })
            }
            break;

        case '2':

            Swal.fire('El medicamento fue suspendido');
            break;

        case '3':

            if (posicion == '1') {

                Swal.fire('El medicamento se encuentra como NO aplicado en la hora seleccionado');

                // guardar = 'N';

            } else if (posicion == '2') {

                Swal.fire({
                    title: 'Justificación para desmarcar la aplicación',
                    input: 'text',
                    inputAttributes: {
                        autocapitalize: 'off'
                    },
                    showCancelButton: true,
                    confirmButtonText: 'Guardar',
                    showLoaderOnConfirm: true,
                    preConfirm: (respuesta) => {

                        if (respuesta.length == 0) {
                            Swal.showValidationMessage(
                                `Debe ingresar una justificación`
                            )
                        } else if (respuesta.length < nLongitud) {
                            Swal.showValidationMessage(
                                `Debe ingresar una justificación minimo de ` + nLongitud + ` caracteres`
                            )
                        } else {
                            // guardar == 'S';
                            itemsSubmit = '#P0_IDADMISION, #P' + current_page + '_TERMINAL, #P' + current_page + '_ID_USUARIO'; // items que se le envian al serviddor
                            fjvAccionarCallback(estado, columna, posicion, respuesta, 'PV_ACCIONES_TABLERO', itemsSubmit);
                        }
                    }
                })
            }
            // if (guardar == 'S') {
            //     alert('hdjahshd')
                
            // }
            break;

        case '4':
            if (posicion == '1') {

                // guardar == 'S';
                itemsSubmit = '#P0_IDADMISION, #P' + current_page + '_TERMINAL, #P' + current_page + '_ID_USUARIO'; // items que se le envian al serviddor
                fjvAccionarCallback(estado, columna, posicion, respuesta, 'PV_ACCIONES_TABLERO', itemsSubmit);

            } else if (posicion == '2') {
                Swal.fire({
                    title: 'Justificación para marcar NO aplicado',
                    input: 'text',
                    inputAttributes: {
                        autocapitalize: 'off'
                    },
                    showCancelButton: true,
                    confirmButtonText: 'Guardar',
                    showLoaderOnConfirm: true,
                    preConfirm: (respuesta) => {

                        if (respuesta.length == 0) {
                            Swal.showValidationMessage(
                                `Debe ingresar una justificación`
                            )
                            guardar = 'N';
                        } else if (respuesta.length < nLongitud) {
                            Swal.showValidationMessage(
                                `Debe ingresar una justificación minimo de ` + nLongitud + ` caracteres`
                            )
                            guardar = 'N';
                        } else {
                            // guardar == 'S';
                            itemsSubmit = '#P0_IDADMISION, #P' + current_page + '_TERMINAL, #P' + current_page + '_ID_USUARIO'; // items que se le envian al serviddor
                            fjvAccionarCallback(estado, columna, posicion, respuesta, 'PV_ACCIONES_TABLERO', itemsSubmit);
                        }
                    }
                })
            }
            // if (guardar == 'S') {
                
            // }

            break;
        default:
            console.log("Not Zero, One or Two");
    }
    //}, 100)
};
// nov-08-2022 Sebastian Cardona. Funcion que aplica, desaplica, noaplica un medicamento, casa caso se comunica con la funciop fjvAccionarCallback
function fjvAccionarCallback(estado, columna, posicion, respuesta, callback, items) {
    apex.server.process(callback,
        {
            pageItems: items,
            x01: estado,        // estado de la aplicacion
            x02: posicion,      // posicion 1 o 2 dependiendo del boton que se le da clic 
            x03: fechaReal,     // fecha de aplicacion
            x04: horaReal,      // hora de aplicacion
            x05: admision,      // admnision del paciente 
            x06: idProducto,    // producto
            x07: terminal,      // terminal del equipo
            x08: idUsuario,     // id usuario connectado
            x09: columna,       // columna de la aplicacion
            x10: sequence,      // sequence del medicamento
            x11: respuesta      // la respuesta del usuario

        }, //Parametros que se le van a pasar al servidor
        {
            success: function (res) { //En caso de que el proceso sea exitoso
                if (res.controlErrores == 'SI') {
                    Swal.fire({
                        position: 'center',
                        icon: 'info',
                        title: res.respuesta,
                        showConfirmButton: false,
                        timer: 200000
                    })
                } else {
                    if (res.respuesta == 'OBSERVACIONES') {
                        Swal.fire({
                            title: 'Registro aplicación del medicamento',
                            input: 'text',
                            inputAttributes: {
                                autocapitalize: 'off'
                            },
                            showCancelButton: true,
                            confirmButtonText: 'Guardar',
                            showLoaderOnConfirm: true,
                            preConfirm: (respuesta) => {
                                if (respuesta.length == 0) {
                                    Swal.showValidationMessage(
                                        `Debe ingresar una observación`
                                    )
                                } else if (respuesta.length < nLongitud) {
                                    Swal.showValidationMessage(
                                        `Debe ingresar una observación minimo de ` + nLongitud + ` caracteres`
                                    )
                                } else {
                                    apex.server.process('PV_ACCIONES_TABLERO',
                                        {
                                            pageItems: '#P0_IDADMISION, #P297_TERMINAL, #P297_ID_USUARIO',
                                            x01: 'guardarObs', /// en este caso en vez de enviar el estado envio un dato quemado ya que se interpreta en este punto que la aplicacion se encuentra en estado 4 o pendiente por aplicar
                                            x02: posicion,
                                            x03: fechaReal,
                                            x04: horaReal,
                                            x05: admision,
                                            x06: idProducto,
                                            x07: terminal,
                                            x08: idUsuario,
                                            x09: columna,
                                            x10: sequence,
                                            x11: respuesta
                                        }, //Parametros que se le van a pasar al servidor
                                        {
                                            success: function (res) { //En caso de que el proceso sea exitoso
                                                console.log(res)
                                                if (res.controlErrores == 'SI') {
                                                    Swal.fire({
                                                        position: 'center',
                                                        icon: 'info',
                                                        title: res.respuesta,
                                                        showConfirmButton: false,
                                                        timer: 200000
                                                    })
                                                } else {
                                                    apex.region("A").refresh();
                                                    Swal.fire({
                                                        position: 'top-end',
                                                        icon: 'success',
                                                        title: res.respuesta,
                                                        showConfirmButton: false,
                                                        timer: 1500
                                                    })
                                                }
                                            },
                                            error: function (e) {
                                                alert('Error: ' + JSON.stringify(e));
                                            }
                                        })

                                }
                            }
                        })
                    } else {
                        apex.region("A").refresh();
                        Swal.fire({
                            position: 'top-end',
                            icon: 'success',
                            title: res.respuesta,
                            showConfirmButton: false,
                            timer: 1500
                        })
                    }

                }
                // fjvBuscarInformacion();
            },
            error: function (e) {
                console.log('Error: ' + JSON.stringify(e));
            }
        }
    )
};
// nov-08-2022 Sebastian Cardona. Funcion que llama al ajax callback que donde esta el procedimiento plsql para aplicar, desmarcar o no aplicar.

function fjvCallbackDatos() {
    //DECLARAMOS VARIABLES QUE SE VA A ENVIAR A EL PROCEDIMEINTO (PV_DATOS) PARA TRAER LA INFO POR MEDICANTO 
    // let p_Idmedicamento = idProducto, ///idProducto
    let p_admicion = $v('P0_IDADMISION');
        p_historia = $v('P0_NRO_HISTORIA');
        // idProductos =$v('P297_IDPRODUCTO');
    
    apex.server.process('PV_DATOS',
        {
            //ENVIAMOS VARIABLES    
            x01: idProducto,
            x02: p_admicion,
            x03: p_historia,
            x04: 'buscarData',
            x05: sequence
        },
        // RESIVIMOS INFO PARA PODER IMPRIMIR  
        {
            success: function (res) { //En caso de que el proceso sea exitoso
                // console.log(res.res);
                // apex.message.showPageSuccess('El Registro se Guardo Correctamente!');
                apex.item('P297_APLICACIONES').setValue(res.p297_aplicaciones);
                apex.item('P297_DSP_DOSIS').setValue(res.p297_dsp_dosis);
                apex.item('P297_NRCANTIDAD').setValue(res.p297_nrcantidad);
                apex.item('P297_NKPSLINEA').setValue(res.p297_nkpslinea);
                apex.item('P297_NDIAS').setValue(res.p297_ndias);
                apex.item('P297_FRALTORIESGO').setValue(res.p297_fraltoriesgo);
                apex.item('P297_NDEVUELTA').setValue(res.p297_ndevuelta);
                apex.item('P297_ADMISIONES_NKPLINEA').setValue(res.p297_admisiones_nkplinea);
                apex.item('P297_DSP_FECHA_SUSPENCION').setValue(res.p297_dsp_fecha_suspencion);
                apex.item('P297_DSP_DTPROGRAMACION').setValue(res.p297_dsp_dtprogramacion);
                apex.item('P297_DSP_FECHAORDEN').setValue(res.p297_dsp_fechaorden);
                apex.item('P297_NAPLICACIONES').setValue(res.p297_naplicaciones);
                apex.item('P297_DRECIBIDO').setValue(res.p297_drecibido);
                apex.item('P297_VUSUARIORECIBE').setValue(res.p297_vusuariorecibe);
                apex.item('P297_VOBSERVACIONES').setValue(res.p297_vobservaciones);
                apex.item('P297_UNID_VKPCODIGO').setValue(res.p297_unid_vkpcodigo);
                apex.item('P297_DSP_FRECUENCIA').setValue(res.p297_dsp_frecuencia);
                apex.item('P297_DSP_TMTIPOSVIA_VKPCODIGO').setValue(res.p297_dsp_tmtiposvia_vkpcodigo);
                apex.item('P297_DSP_DNI_PROFESIONAL').setValue(res.p297_dsp_dni_profesional);
                apex.item('P297_DSP_PROFESIO_TERC_VKPCODIGO').setValue(res.p297_dsp_profesio_terc_vkpcodigo);
                apex.item('P297_DSP_VINDICACIONES').setValue(res.p297_dsp_vindicaciones);
                apex.item('P297_DSP_PRESENTACION').setValue(res.p297_dsp_presentacion);
                apex.item('P297_SALDO').setValue(res.p297_saldo);
                apex.item('P297_NDESPACHADA').setValue(res.p297_ndespachada);

            },
            error: function (e) {
                console.log('Error: ' + JSON.stringify(e));
                apex.message.showPageSuccess('El Registro no se Guardo Correctamente!');
            }
        }
    )
}
//
//function fjvValidarSiEsN(itemApex1,itemApex2){
    //if (itemApex1 == 'N') {
        //apex.item(itemApex2).hide()
    //}
//}
//OCULTA Y LIMPIA LOS ITEMS QUE RECIBE LA FUNCION
//RECIBE UN ARREGLO CON EL NOMBRE DE LOS RESPECTIVOS ITEMS
function fjvMostraOcultar1(nameItems){
    arguments = nameItems;
 	for(var i=0; i<arguments.length; i++){
        apex.item(arguments[i]).setValue(null);
        apex.item(arguments[i]).hide();
    }
}
//
/// 17 FEB 23 MATEO PELAEZ HOLGUIN
//
//OCULTA LOS ITEMS QUE RECIBE LA FUNCION
function fjvOcultarPaginaCargue(nameItems){
    arguments = nameItems;
 	for(var i=0; i<arguments.length; i++){
        apex.item(arguments[i]).hide();
    }
}
//
/// 17 FEB 2023 MATEO PELAEZ HOLGUIN
//
//MUESTRA LOS ITEMS QUE RECIBE LA FUNCION
function fjvMostarItems(nameItems){
    arguments = nameItems;
 	for(var i=0; i<arguments.length; i++){
        apex.item(arguments[i]).show();
    }
}
//
/// 17 FEB 23 MATEO PELAEZ HOLGUIN
//
//listo
//PONE EN NULL LOS ITEMS QUE SE LE DAN
//05 ENE 23 MATEO PELAEZ HOLGUIN
function fjvPonerNull(nameItems){
    arguments = nameItems;
 	for(var i=0; i<arguments.length; i++){
        apex.item(arguments[i]).setValue(null);
    }
}
//CON ESTA FUNCION SE BLOQUEAN TECLAS, EN ESTE CASO ESTAN HABILITADAS SOLO LAS TECLAS NUMERICAS
function fjvNoNumText(){
    //IDENTIFICA EL TIPO DE ITEM EN EL QUE VA A ESCRIBIR Y EMPIEZA A ACTUAR EL EVENTO KEYDOWN(DESENCADENA ALGO CUANDO SE PRESIONE UNA TECLA EN ESE ITEM)
    $('.apex-item-number').keydown(function(event){
        //SI PRESIONA LA TECLA SHITF O LA TECLA 187(SE IDENTIFICA MEDIANTE KEYCODE) NO MUESTRA NADA
        if (event.shiftKey || event.which == 187){
            //ESTE RETURN FALSE HACE QUE LA TECLA PRESIONADA NO SE VEA REFLEJADA EN EL CAMPO, EN RESUMEN QUE NO ESCRIBA NADA
            return false;
        }else{
            //LAS TECLAS QUE DECLAREMOS EN ESTA SENTENCIA SERAN LAS ACEPTADAS EN EL CAMPO Y LAS VEREMOS REFLEJADAS CUANDO PRESIONEMOS UNA TECLA
            if  ((event.which < 48 || event.which > 57) 
                && (event.which < 96 || event.which > 105) 
                //&& event.which !==190  
                //&& event.which !==110 
                && event.which !== 8
                && event.which !== 13
                && event.which !== 9 
                && event.which !== 37
                && event.which !== 39
                && event.which !== 116){
                    //SI ES UNA TECLA DISTINTA A LAS DECLARADAS EN LA SENTENCIA IF, HACE QUE LA TECLA PRESIONADA NO SE VEA REFLEJADA EN EL CAMPO, EN RESUMEN QUE NO ESCRIBA NADA
                return false;
            }
        }
    });
}
//EL KEYCODE SE PUEDE IDENTIFICAR EN https://www.toptal.com/developers/keycode
//
/// 16 FEB 2023 MATEO PELAEZ HOLGUIN
//CON ESTA FUNCION SE BLOQUEAN TECLAS, EN ESTE CASO ESTAN HABILITADAS LAS TECLAS NUMERICAS, EL SIMBOLO / Y EL SHIFT+7
function fjvValDate(){
    //IDENTIFICA EL TIPO DE ITEM EN EL QUE VA A ESCRIBIR Y EMPIEZA A ACTUAR EL EVENTO KEYDOWN(DESENCADENA ALGO CUANDO SE PRESIONE UNA TECLA EN ESE ITEM)
    $('.apex-item-datepicker-jet').keydown(function(event){
        //SI PRESIONA LA TECLA SHITF MAS CUALQUIER TECLA QUE NO SEHA LA TECLA 55(SE IDENTIFICA MEDIANTE KEYCODE) O LA TECLA CTRL MAS LA TECLA 86, NO MUESTRA NADA
        if ((event.shiftKey && event.which !== 55)||(event.ctrlKey && event.which == 86)){
            //ESTE RETURN FALSE HACE QUE LA TECLA PRESIONADA NO SE VEA REFLEJADA EN EL CAMPO, EN RESUMEN QUE NO ESCRIBA NADA
            return false;
        }else{
            if
                //LAS TECLAS QUE DECLAREMOS EN ESTA SENTENCIA SERAN LAS ACEPTADAS EN EL CAMPO Y LAS VEREMOS REFLEJADAS CUANDO PRESIONEMOS UNA TECLA
                ((event.which < 48 || event.which > 57) 
                && (event.which < 96 || event.which > 105)  
                && event.which !== 8 
                && event.which !== 9
                && event.which !== 13
                && event.which !== 111
                && event.which !== 193
                && event.which !== 109  
                && event.which !== 189
                && event.which !== 37
                && event.which !== 39
                && event.which !== 116){
                    //ESTE RETURN FALSE HACE QUE LA TECLA PRESIONADA NO SE VEA REFLEJADA EN EL CAMPO, EN RESUMEN QUE NO ESCRIBA NADA
                return false;
            }
        }
    });
}
//EL KEYCODE SE PUEDE IDENTIFICAR EN https://www.toptal.com/developers/keycode
//
/// 16 FEB 2023 MATEO PELAEZ HOLGUIN
//
//MODIFICA UN ITEM SEGUN UNA SUMA DE DOS ITEMS, ADEMAS LOS TRANSFORMA A TIPO NUMBER CUANDO LLEGAN STRING
//05 ENE 23 MATEO PELAEZ HOLGUIN
//ALERTA CREADA CON SWEETALERT2, RECIBE EL MENSAJE DE LA ALERTA Y EL TIPO
//MENSAJE EN ESQUINA SUPERIOR DERECHA, PEQUEÑO
function fjvMenPeqAdver(alert, type){
    const Toast = Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,  
    timer: 4000
    })

    Toast.fire({ 
    icon: type,
    titleText: alert
    })
    
}
//
/// 17 ENE 23 MATEO PELAEZ HOLGUIN
//

//OCULTA UN ELEMENTO SEGUN SU ID ESTATICA 
function fvjHideRegion(id) {
    $(id).hide();
}
//
/// 17 FEB 2023 MATEO PELAEZ HOLGUIN
//
// MUESTRA UN ELEMENTO SEGUN SU ID ESTATICA
function fvjShowRegion(id) {
    $(id).show();
}
//
/// 05 FEB 2023 MATEO PELAEZ HOLGUIN
//
//ESTA FUNCION ES UNICAMENTE USADA EN LA PAGINA 338
function fvjAnteObstetricos338(){
    //VALIDA SI EL ITEM P311_NGESTAS ESTA VACIO O TIENE 0
    if($v('P338_NGESTAS') == '' || $v('P338_NGESTAS') == 0){
    //SI ES VERDADERO CREA EL ARREGLO nameItems Y LE AÑADE LOS NOMBRE DE LOS ITEMS QUE VA A USAR
        var nameItems = [
                'P338_NVAGINALES'
                ,'P338_FRINSTRUMENTAL'
                ,'P338_NECTOPICOS'
                ,'P338_NVIVOS'
                ,'P338_NVIVEN'
                ,'P338_NPARTOS'
                ,'P338_NABORTOS'
                ,'P338_FRABORTOSCONSEC'
                ,'P338_NGESTACIONALMORTINATOS'
                ,'P338_NMUEREN'
                ,'P338_NMENOR'
                ,'P338_NCESAREA'
                ,'P338_NMORTINATOS'
                ,'P338_NPREMATURO'
                ,'P338_NGESTACIONALPREMATUROS'
                ,'P338_NMAYOR'
                ,'P338_FRMULTIPLES'
                ,'P338_VFECHAMORTINATOS'
                ,'P338_VFECHAPREMATUROS'
                ,'P338_NMUEREND1S'
                ,'P338_NMUEREN1S'
                ,'P338_VINTERGENESICO'
                ,'P338_FESMENORA1O5'
                ,'P338_VXLACTANCIA'
                ,'P338_VOBSERVACIONESLACTANCIA'
                ,'P338_VTRATAMIENTOS'
                ,'P338_VOBSERVACIONES'];
        //EJECUTA LA FUNCION fjvMostraOcultar1 CON LOS ELEMNTOS DE EL ARREGLO nameItems
        fjvMostraOcultar1(nameItems);
        //SOBRE ESCRIBE EL ARREGLO ANTERIOR CON NUEVOS ITEMS
        var nameItems = [
                'P338_FRNINGUNA'
                ,'P338_FRRPM'
                ,'P338_FROLIGOHIDRAMNIOS'
                ,'P338_FRRCIU'
                ,'P338_FRAMENABORTO'
                
                ,'P338_FRPREMATURO'
                ,'P338_FRPOLHIDRAMNIOS'
                ,'P338_FREMBARAZOMOLAR'
                ,'P338_FRPROLONGADO'
                ,'P338_FRECLAMPSIA'
                ,'P338_FRSIFILISCONGENITA'
                ,'P338_FRSIFILISGESTACIONAL'
                ,'P338_FRDEPRESIONPOSPARTO'
                ,'P338_FRDIABETESGESTA'
                ,'P338_FRTOXOPLASMOSIS'
                ,'P338_FRMACROSOMIA'
                ,'P338_FRANOMALIASFETALES'
                ,'P338_FRATONIAUTERINA'
                ,'P338_FRPRESENTACIONANORMAL'
                ,'P338_FRHIPERPLACENTARIA'
                ,'P338_FRHEMOGRAFIA'
                ,'P338_FREBARAZOGEMELAR'
                ,'P338_FRCIRUGIAGINECO'
                ,'P338_FRCESAREAPREVIA'
                ,'P338_FRCARDIACA'
                ,'P338_FRHISTINFERTILIDAD'
                ,'P338_FRAUTOINMUNE'
                ,'P338_FRBACTERIANA'
                ,'P338_FRANEMIA'
                ,'P338_FRENFRENALCRONICA'
                ,'P338_FRPRECLAMPSIA'
                ,'P338_FRMELLITUS'
                ,'P338_FRPARTOPROLONGADO'
                ,'P338_FRPRIMIPARIEDAD'
                ,'P338_VXDESGARRO'
        ];
        //EJECUTA LA FUNCION fjvPonerNull ENVIANDOLE EL ARREGLO nameItems 
        fjvPonerNull(nameItems);
        //EJECUTA LA FUNCION fvjHideRegion Y LE ENVIA EL ID ESTATICO formPatoEmbarazos1
        fvjHideRegion('#formPatoEmbarazos1');
    }else{
        ////SI ES FALSO CREA EL ARREGLO nameItems Y LE AÑADE LOS NOMBRE DE LOS ITEMS QUE VA A USAR
        var nameItems = [
            'P338_NVAGINALES'
            ,'P338_FRINSTRUMENTAL'
            ,'P338_NECTOPICOS'
            ,'P338_NVIVOS'
            ,'P338_NVIVEN'
            ,'P338_NPARTOS'
            ,'P338_NABORTOS'
            ,'P338_FRABORTOSCONSEC'
            ,'P338_NGESTACIONALMORTINATOS'
            ,'P338_NMUEREN'
            ,'P338_NMENOR'
            ,'P338_NCESAREA'
            ,'P338_NMORTINATOS'
            ,'P338_NPREMATURO'
            ,'P338_NGESTACIONALPREMATUROS'
            ,'P338_NMAYOR'
            ,'P338_FRMULTIPLES'
            ,'P338_VFECHAMORTINATOS'
            ,'P338_VFECHAPREMATUROS'
            ,'P338_NMUEREND1S'
            ,'P338_NMUEREN1S'
            ,'P338_VINTERGENESICO'
            ,'P338_FESMENORA1O5'
            ,'P338_VXLACTANCIA'
            ,'P338_VOBSERVACIONESLACTANCIA'
            ,'P338_VTRATAMIENTOS'
            ,'P338_VOBSERVACIONES'];
        //EJECUTA LA FUNCION fjvMostarItems CON LOS ELEMENTOS DE EL ARREGLO nameItems    
        fjvMostarItems(nameItems);
        //EJECUTA LA FUNCION fvjShowRegion ENVIANDOLE EL ID ESTATICO formPatoEmbarazos1 
        fvjShowRegion('#formPatoEmbarazos1');
        //VALIDA SI P338_VXLACTANCIA ESTA EN BLANCO
        if($v('P338_VXLACTANCIA') == ''){
            //SI ES VERDAD, INICIA EL ITEM P338_VXLACTANCIA EN S 
            apex.item('P338_VXLACTANCIA').setValue('S')
        }
    }
}
//
/// 17 FEB 2023 MATEO PELAEZ HOLGUIN
//
