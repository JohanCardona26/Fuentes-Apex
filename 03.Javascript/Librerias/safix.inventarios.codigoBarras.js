/**
 * @namespace safix.inventarios.codigoBarras
 * @description Módulo de inventarios, funciones de códigos de barras.
 * @Historico
 * Feb 14 2025. Johan Cardona. Creación de archivo para manejo de funciones globales.
 */

// Modulo de codigo de barras.
const codigoBarras = {};
safix.inventarios.codigoBarras = codigoBarras;

/**
 * @type {HTMLElement}
 * @module safix.inventarios.codigoBarras.elementoObservar  
 * @description Elemento del DOM a observar para detectar cambios
 * @create Feb 14 2025. Johan Cardona.
 */
const elementoObservar = document.querySelector(`body`);
codigoBarras.elementoObservar = elementoObservar;

/**
 * @type {boolean}
 * @module safix.inventarios.codigoBarras.modalIsOpening
 * @description Indica si la ventana modal está abierta o cerrada
 * @create Feb 14 2025. Johan Cardona.
 */
codigoBarras.modalIsOpening = false;

/**
 * @type {Array<string>}
 * @module safix.inventarios.codigoBarras.seleccionarElementos
 * @description Elementos seleccionados para observar
 * @create Feb 14 2025. Johan Cardona.
 */
codigoBarras.seleccionarElementos = null;

/**
 * @type {MutationObserver}
 * @module safix.inventarios.codigoBarras.ObservadorVentanasEmergentes
 * @description Observador que detecta cambios en el DOM para ventanas emergentes
 * @create Feb 14 2025. Johan Cardona.
 * @listens MutationRecord
 */
const ObservadorVentanasEmergentes = new MutationObserver((mutationsList) => {
    for (let mutation of mutationsList) {
        // Revisamos si se agregaron nodos al DOM
        for (let node of mutation.addedNodes) {
            if (node.nodeType === 1) { // Asegurar que es un elemento HTML
                if (safix.inventarios.codigoBarras.seleccionarElementos.some(selector => node.matches(selector))) {
                    safix.inventarios.codigoBarras.modalIsOpening = true;
                    safix.procesos.mensajesConsola.log("Modal abierto:", node.className);
                    return;
                }
            }
        }

        // Revisamos si se eliminaron nodos del DOM
        for (let node of mutation.removedNodes) {
            if (node.nodeType === 1) {
                if (safix.inventarios.codigoBarras.seleccionarElementos.some(selector => node.matches(selector))) {
                    safix.inventarios.codigoBarras.modalIsOpening = false;
                    safix.procesos.mensajesConsola.log("Modal cerrado:", node.className);
                    safix.procesos.recuperarEnfoque(); // Llamamos a focus solo cuando una modal se cierra
                    return;
                }
            }
        }
    }
});
codigoBarras.ObservadorVentanasEmergentes = ObservadorVentanasEmergentes;

/** 
 * @type {Array<Object>}
 * @module safix.inventarios.codigoBarras.camposListaChequeo
 * @description Lista de campos de chequeo para validar campos requeridos
 * @create Feb 14 2025. Johan Cardona.
 * @property {string} codigo - Código identificador del campo
 * @property {string} nombre - Nombre del campo de chequeo
 * @property {string} Respuesta - Mensaje de respuesta cuando hay inconsistencia
 */
codigoBarras.camposListaChequeo = [
    {"codigo":"905","nombre":"Marca","Respuesta":"La marca del producto entregado es diferente al del contrato.","item":"P462_DSP_VMARCA"},
    {"codigo":"906","nombre":"Presentación","Respuesta":"La presentación del producto entregado es diferente al del contrato.","item":"P462_DSP_PRESENTACION"},
    {"codigo":"907","nombre":"Precio","Respuesta":"El precio del producto entregado es diferente al del contrato.","item":"P462_NVALOR_MASCARA"},
    {"codigo":"908","nombre":"Unidad de Empaque","Respuesta":"La unidad de empaque del producto entregado es diferente al del contrato.","item":"P462_NEMPAQUE"},
    {"codigo":"909","nombre":"Registro Invima","Respuesta":"El registro Invima del producto entregado es diferente al del contrato.","item":"P462_VINVIMA"}
];

/**
 * @module safix.inventarios.codigoBarras.leerCodigoEan
 * @description Lee el código EAN del producto
 * @returns {void}
 * @create Mar 11 2025. Johan Cardona.
 */
codigoBarras.leerCodigoEan = () => {
    let dato = document.activeElement.id;
    safix.procesos.mensajesConsola.log('Lector de código de barras activado', 'dato', dato, 'paginaActual', paginaActual);
    // Verifica si el ID del elemento activo es un campo EAN
    if (dato == "P" + paginaActual + "_EAN") {
        if (apex.item(`P${paginaActual}_EAN`).getValue() == '') {
            safix.alertas.superiores.error('El campo EAN no puede estar vacío.');
            return;
        }else if (apex.item(`P${paginaActual}_EAN`).getValue().length > 14) {
            let ean = apex.item(`P${paginaActual}_EAN`).getValue().substring(0, 16)
            // apex.item(`P${paginaActual}_EAN`).setValue(ean);
            $(`#P${paginaActual}_EAN`).val(ean);
            safix.procesos.mensajesConsola.log('EAN truncado a 16 caracteres', 'valor', ean);
        }
        safix.procesos.callbacks.ejecutar('PU_VALIDAR_EAN');
    }
}

/**
 * @module safix.inventarios.codigoBarras.mostrarListaChequeo
 * @description Muestra una ventana modal con una lista de chequeo para validar campos requeridos
 * @returns {void}
 * @create Feb 14 2025. Johan Cardona.
 */
// codigoBarras.mostrarListaChequeo = () => {
//     // Crear el HTML dinámico para checkboxes con la opción "Seleccionar todos"
//     let checkboxesHtml = `
//         <div style="display: flex; flex-direction: column; align-items: start; gap: 10px; padding: 10px;">
//             <div style="display: flex; align-items: center;">
//                 <input type="checkbox" id="selectAll" style="margin-right: 10px;">
//                 <label for="selectAll">Seleccionar todos</label>
//             </div>
//     `;
//     codigoBarras.camposListaChequeo.forEach((campo) => {
//         checkboxesHtml += `
//             <div style="display: flex; align-items: center;">
//                 <input type="checkbox" id="${campo.codigo}" value="1" class="campo-checkbox" style="margin-right: 10px;">
//                 <label for="${campo.codigo}">${campo.nombre}</label>
//             </div>
//         `;
//     });
//     checkboxesHtml += '</div>';

//     // Configuración de la alerta
//     const alertaCamposRequeridos = { 
//         title: "Lista de chequeo de campos requeridos",
//         html: checkboxesHtml,
//         confirmButtonText: `Continuar &nbsp;<i class="fa fa-gear"></i>`,
//         width: 500,
//         padding: '1em',
//         allowOutsideClick: false,
//         confirmButtonColor: safix.colores.VA_VERDE,
//         background: '#f1f1f1',
//         preConfirm: async () => {
//             // Filtrar los campos que no están seleccionados
//             const camposNoSeleccionados = codigoBarras.camposListaChequeo.filter((campo) => !document.getElementById(campo.codigo).checked);

//             // Si hay campos sin seleccionar, muestra la alerta con el mensaje correspondiente
//             if (camposNoSeleccionados.length > 0) {
//                 const mensaje = camposNoSeleccionados.map(campo => campo.Respuesta).join("\n");
//                 const resultado = await Swal.fire({
//                     title: "¿Generar inconsistencia?",
//                     text: `Hay campos sin seleccionar:\n${mensaje}`,
//                     icon: "warning",
//                     confirmButtonText: "Sí, generar inconsistencia",
//                     cancelButtonText: "Cancelar",
//                     showCancelButton: true,
//                     confirmButtonColor: safix.colores.VA_VERDE,
//                     cancelButtonColor: safix.colores.VA_ROJO
//                 });
//                 // Si el usuario cancela, vuelve a mostrar la alerta principal
//                 if (!resultado.isConfirmed) {
//                     Swal.fire(alertaCamposRequeridos); // Vuelve a mostrar la alerta de chequeo
//                     return false; // Previene el cierre de la alerta original
//                 }
//             }

//             // Retorna los campos seleccionados si no hay campos sin seleccionar o si se confirmó continuar
//             return camposNoSeleccionados;
//         },
//         didOpen: () => {
//             // Lógica para "Seleccionar todos"
//             const selectAllCheckbox = document.getElementById('selectAll');
//             const campoCheckboxes = document.querySelectorAll('.campo-checkbox');

//             selectAllCheckbox.addEventListener('change', () => {
//                 const isChecked = selectAllCheckbox.checked;
//                 campoCheckboxes.forEach(checkbox => {
//                     checkbox.checked = isChecked;
//                 });
//             });

//             campoCheckboxes.forEach(checkbox => {
//                 checkbox.addEventListener('change', () => {
//                     // Si algún checkbox no está seleccionado, desmarca "Seleccionar todos"
//                     if (!checkbox.checked) {
//                         selectAllCheckbox.checked = false;
//                     }
//                     // Si todos los checkboxes están seleccionados, marca "Seleccionar todos"
//                     else if (Array.from(campoCheckboxes).every(cb => cb.checked)) {
//                         selectAllCheckbox.checked = true;
//                     }
//                 });
//             });
//         }
//     };

//     // Función para disparar la alerta y manejar la respuesta
//     async function mostrarAlerta() {
//         const { value: accept } = await Swal.fire(alertaCamposRequeridos);
//         let codigo = null;
//         let nombre = null;
//         let respuesta = null;
//         let item = null;
//         apex.item(`P${paginaActual}_FRLISTCHEQUEO`).setValue(`S`);

//         // Procesar la respuesta de la alerta si se seleccionaron campos
//         if (accept && accept.length > 0) {
//             for (const campo of accept) {
//                 if (!nombre) {
//                     // codigo = campo.codigo;
//                     nombre = campo.nombre;
//                     respuesta = campo.Respuesta;
//                 } else {
//                     // codigo += ';' + campo.codigo;
//                     nombre += ';' + campo.nombre;
//                     respuesta += ';' + campo.Respuesta;
//                 }

//                 if (!codigo) codigo = campo.codigo; item = campo.item;
//             }

//             const alertaObservacion = {
//                 icon: `question`,
//                 confirmButtonText : 'Confirmar',
//                 confirmButtonColor: safix.colores.VA_VERDE,
//                 cancelButtonColor: safix.colores.VA_ROJO,
//                 input: "text",
//                 inputLabel: nombre,
//                 inputPlaceholder: "Digite el dato de " + nombre + " entregado.",
//                 inputValidator: (value) => {
//                     // Validación en tiempo real
//                     if (!value || value.trim() === '') {
//                         return 'El dato ' + nombre + ' es obligatorio';
//                     }
//                 }
//             };
//             // Muestra la alerta de observación
//             Swal.fire(alertaObservacion).then((resObs) => {
//                 if (resObs.isConfirmed) { 
//                     let observacion = `Se genera inconsistencia por ${nombre}, entregada: ` + resObs.value + '. contratada: ' + apex.item(item).getValue();
//                     apex.item(`P${paginaActual}_VOBSERVACION`).setValue(observacion);
//                 }
//                 apex.item(`P${paginaActual}_FRINCONSITENCIAS`).setValue(`S`);
//                 apex.item(`P${paginaActual}_CODIGO_INCONSISTENCIA`).setValue(codigo);
//                 apex.item(`P${paginaActual}_MENSAJE_INCONSISTENCIA`).setValue(respuesta);

//                 safix.procesos.mensajesConsola.log('Reporte de inconsistencias', 'codigo', codigo, 'respuesta', respuesta, 'nombre', nombre);

//                 safix.alertas.superiores.exito('Inconsistencia registrada con éxito. Por favor complete los datos del lote y proceda a generar el proceso.');
//             });
//         } else {
//             safix.alertas.superiores.exito('Lista de chequeo generada con éxito. Por favor complete los datos del lote y proceda a generar el proceso.');
//         }
//     }

//     // Llamada a la función para mostrar la alerta
//     mostrarAlerta();
// }
codigoBarras.mostrarListaChequeo = () => {
    // Crear el HTML dinámico para checkboxes con la opción "Seleccionar todos"
    let checkboxesHtml = `
        <div style="display: flex; flex-direction: column; align-items: start; gap: 10px; padding: 10px;">
            <div style="display: flex; align-items: center;">
                <input type="checkbox" id="selectAll" style="margin-right: 10px;">
                <label for="selectAll">Seleccionar todos</label>
            </div>
    `;
    codigoBarras.camposListaChequeo.forEach((campo) => {
        checkboxesHtml += `
            <div style="display: flex; align-items: center;">
                <input type="checkbox" id="${campo.codigo}" value="1" class="campo-checkbox" style="margin-right: 10px;">
                <label for="${campo.codigo}">${campo.nombre}</label>
            </div>
        `;
    });
    checkboxesHtml += '</div>';

    // Configuración de la alerta
    const alertaCamposRequeridos = { 
        title: "Lista de chequeo de campos requeridos",
        html: checkboxesHtml,
        confirmButtonText: `Continuar &nbsp;<i class="fa fa-gear"></i>`,
        width: 500,
        padding: '1em',
        allowOutsideClick: false,
        confirmButtonColor: safix.colores.VA_VERDE,
        background: '#f1f1f1',
        preConfirm: async () => {
            // Filtrar los campos que no están seleccionados
            const camposNoSeleccionados = codigoBarras.camposListaChequeo.filter((campo) => !document.getElementById(campo.codigo).checked);

            // Si hay campos sin seleccionar, muestra la alerta con el mensaje correspondiente
            if (camposNoSeleccionados.length > 0) {
                const mensaje = camposNoSeleccionados.map(campo => campo.Respuesta).join("\n");
                const resultado = await Swal.fire({
                    title: "¿Generar inconsistencia?",
                    text: `Hay campos sin seleccionar:\n${mensaje}`,
                    icon: "warning",
                    confirmButtonText: "Sí, generar inconsistencia",
                    cancelButtonText: "Cancelar",
                    showCancelButton: true,
                    confirmButtonColor: safix.colores.VA_VERDE,
                    cancelButtonColor: safix.colores.VA_ROJO
                });
                // Si el usuario cancela, vuelve a mostrar la alerta principal
                if (!resultado.isConfirmed) {
                    // Swal.fire(alertaCamposRequeridos); // Vuelve a mostrar la alerta de chequeo
                    codigoBarras.mostrarListaChequeo (); // Llama a la función de nuevo para mostrar la alerta
                    return false; // Previene el cierre de la alerta original
                }
            }

            // Retorna los campos seleccionados si no hay campos sin seleccionar o si se confirmó continuar
            return camposNoSeleccionados;
        },
        didOpen: () => {
            // Lógica para "Seleccionar todos"
            const selectAllCheckbox = document.getElementById('selectAll');
            const campoCheckboxes = document.querySelectorAll('.campo-checkbox');

            selectAllCheckbox.addEventListener('change', () => {
                const isChecked = selectAllCheckbox.checked;
                campoCheckboxes.forEach(checkbox => {
                    checkbox.checked = isChecked;
                });
            });

            campoCheckboxes.forEach(checkbox => {
                checkbox.addEventListener('change', () => {
                    // Si algún checkbox no está seleccionado, desmarca "Seleccionar todos"
                    if (!checkbox.checked) {
                        selectAllCheckbox.checked = false;
                    }
                    // Si todos los checkboxes están seleccionados, marca "Seleccionar todos"
                    else if (Array.from(campoCheckboxes).every(cb => cb.checked)) {
                        selectAllCheckbox.checked = true;
                    }
                });
            });
        }
    };

    // Función para disparar la alerta y manejar la respuesta
    async function mostrarAlerta() {
        const { value: accept } = await Swal.fire(alertaCamposRequeridos);
        let codigo = null;
        let nombres = [];
        let respuestas = [];
        apex.item(`P${paginaActual}_FRLISTCHEQUEO`).setValue(`S`);

        // Procesar la respuesta de la alerta si se seleccionaron campos
        if (accept && accept.length > 0) {
            const observaciones = []; // Array para acumular todas las observaciones
            let procesoExitoso = true;

            // Recopilar información de todos los campos para los códigos y respuestas
            for (const campo of accept) {
                if (!codigo) {
                    codigo = campo.codigo;
                } else {
                    codigo += ';' + campo.codigo;
                }
                nombres.push(campo.nombre);
                respuestas.push(campo.Respuesta);
            }

            // Procesar cada campo de manera secuencial para las observaciones
            for (let i = 0; i < accept.length; i++) {
                const campo = accept[i];

                const alertaObservacion = {
                    title: `Observación ${i + 1} de ${accept.length}`,
                    html: `
                        <div style="text-align: left; margin-bottom: 15px;">
                            <strong>Campo:</strong> ${campo.nombre}<br>
                            <strong>Valor contratado:</strong> ${apex.item(campo.item).getValue() || 'No definido'}<br>
                            <strong>Motivo:</strong> ${campo.Respuesta}
                        </div>
                    `,
                    icon: 'question',
                    input: 'text',
                    inputLabel: `Valor entregado para ${campo.nombre}`,
                    inputPlaceholder: `Digite el dato de ${campo.nombre} entregado`,
                    confirmButtonText: i === accept.length - 1 ? 'Finalizar' : 'Siguiente',
                    confirmButtonColor: safix.colores.VA_VERDE,
                    // cancelButtonText: 'Cancelar proceso',
                    // cancelButtonColor: safix.colores.VA_ROJO,
                    // showCancelButton: true,
                    allowOutsideClick: false,
                    allowEscapeKey: false,
                    inputValidator: (value) => {
                        if (!value || value.trim() === '') {
                            return `El dato para ${campo.nombre} es obligatorio`;
                        }
                    }
                };

                try {
                    // Mostrar la alerta y esperar la respuesta
                    const resObs = await Swal.fire(alertaObservacion);
                    
                    if (resObs.isConfirmed) {
                        // Crear la observación para este campo específico
                        const valorContratado = apex.item(campo.item).getValue() || 'No definido';
                        const observacionCampo = `${campo.nombre}: entregado "${resObs.value.trim()}" - contratado "${valorContratado}"`;
                        observaciones.push(observacionCampo);
                        
                        console.log(`Observación ${i + 1} procesada:`, observacionCampo);
                    } else {
                        // Si el usuario cancela, detener el proceso
                        procesoExitoso = false;
                        safix.alertas.superiores.info('Proceso de observaciones cancelado por el usuario.');
                        return; // Salir de la función
                    }
                } catch (error) {
                    console.error(`Error al procesar observación para ${campo.nombre}:`, error);
                    procesoExitoso = false;
                    safix.alertas.superiores.error('Error al procesar las observaciones.');
                    return; // Salir de la función
                }
            }

            // Si el proceso fue exitoso y hay observaciones
            if (procesoExitoso && observaciones.length > 0) {
                // Crear la observación completa con todas las inconsistencias
                const observacionCompleta = observaciones.length === 1 
                    ? `Se genera inconsistencia por ${observaciones[0]}`
                    : `Se generan inconsistencias: ${observaciones.join(' | ')}`;
                
                // Actualizar todos los campos necesarios
                apex.item(`P${paginaActual}_VOBSERVACION`).setValue(observacionCompleta);
                apex.item(`P${paginaActual}_FRINCONSITENCIAS`).setValue("S");
                apex.item(`P${paginaActual}_CODIGO_INCONSISTENCIA`).setValue(codigo);
                apex.item(`P${paginaActual}_MENSAJE_INCONSISTENCIA`).setValue(respuestas.join(';'));

                // Log para depuración
                safix.procesos.mensajesConsola.log(
                    'Reporte de inconsistencias', 
                    'codigo', codigo, 
                    'respuestas', respuestas.join(';'), 
                    'nombres', nombres.join(';'),
                    'total_observaciones', observaciones.length,
                    'observacion_completa', observacionCompleta
                );

                // Mostrar mensaje de éxito con contador
                const mensajeExito = observaciones.length === 1 
                    ? 'Inconsistencia registrada con éxito. Por favor complete los datos del lote y proceda a generar el proceso.'
                    : `${observaciones.length} inconsistencias registradas con éxito. Por favor complete los datos del lote y proceda a generar el proceso.`;
                
                safix.alertas.superiores.exito(mensajeExito);
            }
        } else {
            if (apex.item(`P${paginaActual}_FRINCONSITENCIAS`).getValue() === 'S') {
                let codigoValidar = apex.item(`P${paginaActual}_CODIGO_INCONSISTENCIA`).getValue();
                const existe = codigoBarras.camposListaChequeo.some(elemento => elemento.codigo === codigoValidar);
                
                if (existe) {
                    apex.item(`P${paginaActual}_FRINCONSITENCIAS`).setValue("N");
                    apex.item(`P${paginaActual}_CODIGO_INCONSISTENCIA`).setValue('');
                    apex.item(`P${paginaActual}_MENSAJE_INCONSISTENCIA`).setValue('');
                    apex.item(`P${paginaActual}_VOBSERVACION`).setValue('');
                }
            }
            // No se seleccionaron campos con inconsistencias
            safix.alertas.superiores.exito('Lista de chequeo generada con éxito. Por favor complete los datos del lote y proceda a generar el proceso.');
        }
    }

    // Llamada a la función para mostrar la alerta
    mostrarAlerta();
}

/** 
 * @description Inicialización del módulo cuando el documento está listo
 * @listens DOMContentLoaded
 */
$(document).ready(() => {
    /**
     * @event textInput
     * @description Maneja la entrada de texto del lector de códigos de barras
     * @param {InputEvent} e - Evento de entrada de texto
     */
    document.addEventListener('textInput', function (e){
        // le añadimos el evento a todos los textInput del documento o pagina
        if(e.data.length >= 2){ 
            // nos paramos en el item que esta activo y le asignamos la data que el lector escaneo
            document.activeElement.value = e.data;
            e.preventDefault();
            safix.inventarios.codigoBarras.leerCodigoEan();
        }
    });

    /**
     * @event numberInput
     * @description Maneja la entrada numérica del lector de códigos de barras
     * @param {InputEvent} e - Evento de entrada numérica
     */
    document.addEventListener('numberInput', function (e){
        // le añadimos el evento a todos los textInput del documento o pagina
        if(e.data.length >= 2){
            // nos paramos en el item que esta activo y le asignamos la data que el lector escaneo
            document.activeElement.value = e.data;
            e.preventDefault();
            safix.inventarios.codigoBarras.leerCodigoEan();
        }
    });
    safix.inventarios.codigoBarras.ObservadorVentanasEmergentes.observe(document.body, { childList: true, subtree: true });
}); 