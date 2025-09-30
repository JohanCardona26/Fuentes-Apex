/**
 * @namespace safix.procesos
 * @description modulo de procesos reutilizables
 * @Historico
 * May 05 2023. Johan Cardona. Creacion de modulo de funciones reutilizables.
 * Feb 14 2025. Johan Cardona. Se agrega funcion para control de enfoque en los items.
 */

//modulo para los procesos reutilizables
const procesos = {};
safix.procesos = procesos;

/**
 * @module safix.procesos.listas
 * @description listas reutilizables
 */
procesos.listas = {
    /**
     * @module procesos.listas.tiposEnmascaramientos
     * @example safix.procesos.listas.tiposEnmascaramientos();
     * @description Tipos de enmascaramientos habiles
     */
    tiposEnmascaramientos: {
        "$": "pesos",
        "€": "euros",
        "D": "dolares",
        "#": "ninguno",
        "P": "ninguno"
    },
    /**
     * @module procesos.listas.regionesMoneda
     * @example safix.procesos.listas.regionesMoneda();
     * @descripcion Tipos de regiones o nacionalidades
     */
    regionesMoneda: {
        dolares: "en-US",
        pesos: "es-CO",
        euros: "es-ES"
    },
    /**
     * @module procesos.listas.monedas
     * @example safix.procesos.listas.monedas();
     * @description Tipos de monedas para mascara
     */
    monedas: {
        dolares: "USD",
        pesos: "COP",
        euros: "EUR"
    },
}

/**
 * @module procesos.ObtenerMascara
 * @example safix.procesos.ObtenerMascara('dolares');
 * @description obtener tipo de mascara que se va a aplicar
 * @param {tipo de mascara que se requiere (dolares, pesos....)} tipoMascara 
 * @returns objecto con la mascara
 */
procesos.obtenerMascara = (tipoMascara) => {
    var mascara = {
        region: procesos.listas.regionesMoneda[tipoMascara],
        moneda: procesos.listas.monedas[tipoMascara]
    };
    return JSON.stringify(mascara);
};

/**
 * @module procesos.EnmascararValores
 * @example safix.procesos.EnmascararValores('es-CO', 'COP', 1234567898);
 * @Descripcion Se utiliza para enmascarar valores numericos
 * @param {Region del intercambio de moneda} region 
 * @param {Tipo de moneda} moneda 
 * @param {Valor a convertir} pValor 
 **/
procesos.EnmascararValores = (region, moneda, pValor) => {
    // Formatear el valor 
    let valorEnmascarado = pValor.toLocaleString(region, { style: 'currency', currency: moneda });

    //returnar valor enmascarado
    return valorEnmascarado;
};

/**
 * @module procesos.ArmarParametrosX01
 * @example safix.procesos.ArmarParametrosX01();
 * @Descripcion Se llama para obtener todos los valores de los items de una pagina
 * @Comentario retorna json string con key = Nombre del campo, Value= Su valor
 * @example {"P1_MYITEM":"miValor"}
 **/
procesos.ArmarParametrosX01 = () => {
    let datos = {}
    procesos.mensajesConsola.log('Recoleccion de informcion',);

    $('input[id^="P' + paginaActual + '"]').each((i, it) => {
        datos[obtenerNombreRealItem(it.id)] = $v(it);
    });

    $('select[id^="P' + paginaActual + '"]').each((i, it) => {
        datos[obtenerNombreRealItem(it.id)] = $v(it);
    });

    $('.radio_group[id^="P' + paginaActual + '"]').each((i, it) => {
        datos[obtenerNombreRealItem(it.id)] = $v(it);
    });

    $('textarea[id^="P' + paginaActual + '"]').each((i, it) => {
        datos[obtenerNombreRealItem(it.id)] = $v(it);
    });

    $('input[id^="P' + "0" + '"]').each((i, it) => {
        datos[obtenerNombreRealItem(it.id)] = $v(it);
    });

    $('select[id^="P' + "0" + '"]').each((i, it) => {
        datos[obtenerNombreRealItem(it.id)] = $v(it);
    });

    $('.radio_group[id^="P' + "0" + '"]').each((i, it) => {
        datos[obtenerNombreRealItem(it.id)] = $v(it);
    });

    $('textarea[id^="P' + "0" + '"]').each((i, it) => {
        datos[obtenerNombreRealItem(it.id)] = $v(it);
    });


    return JSON.stringify(datos);
};

/**
 * @module procesos.datosGridFilaSeleccionada
 * @module2 procesos.ArmarParametrosX02()
 * @example safix.procesos.datosGridFilaSeleccionada
 * @example2 safix.procesos.ArmarParametrosX02()
 * @description armado de json con los datos de un grid en la fila seleccionada
 * @CreateBy Jcastaño
*/
procesos.datosGridFilaSeleccionada = () => {

    let datos = {}
    try {
        apex.model.list().forEach((elemento, indice) => {
            // Verificar si elemento es una cadena antes de usar replace
            if (typeof elemento === 'string') {

                let idGrid = elemento.replace(/_grid/g, '');

                // Verificar si _options y fields están definidos antes de usar Object.keys
                let fields = apex.model.get(elemento)._options && apex.model.get(elemento)._options.fields;
                let columnas = fields ? Object.keys(fields) : [];

                safix.procesos.mensajesConsola.log('Inicio', elemento, indice, columnas, idGrid);

                try {
                    apex.model.get(elemento)._selection.forEach((seleccion) => {

                        safix.procesos.mensajesConsola.log('seleccion', seleccion);

                        seleccion.record.map((fila, indiceFila) => {

                            datos["C_" + idGrid + "_" + columnas[indiceFila]] = fila

                            // safix.procesos.mensajesConsola.log('seleccion->map', fila,indiceFila);
                        })

                        return false;
                    })
                } catch (error) {
                    safix.procesos.mensajesConsola.error('Error buscando la data de la fila seleccionada', error)
                }

                let datosGrid = []

                safix.procesos.mensajesConsola.log('datosGrid', datosGrid);

                try {

                    apex.model.get(elemento)._data.map((data) => {

                        let current_data = {}

                        safix.procesos.mensajesConsola.log('data', current_data);

                        data.map((col_data, IndiceData) => {

                            // safix.procesos.mensajesConsola.log('data->map', col_data, IndiceData);

                            current_data[columnas[IndiceData]] = col_data

                        })

                        datosGrid.push(current_data)

                        // safix.procesos.mensajesConsola.log('datosGrid', datosGrid);

                    })

                } catch (error) {

                    safix.procesos.mensajesConsola.error('Error buscando la data del grid', error)

                }

                datos[idGrid + "_DATA"] = datosGrid

                safix.procesos.mensajesConsola.log('datos', datos);
            }
        });

        return datos;

    } catch (error) {
        safix.procesos.mensajesConsola.error(`Error en datosGridFilaSeleccionada ${error}`, error);
        return null;
    }
}

procesos.ArmarParametrosX02 = procesos.datosGridFilaSeleccionada;

/**
 * @module procesos.ArmarParametrosX03
 * @example safix.procesos.ArmarParametrosX03();
 * @Descripcion Se llama para obtener todos los valores de los items de un formulario
 * @Comentario retorna json string con Id = Nombre del campo, valor= Su valor
 * @Example [{"id":"P1_MYITEM","valor": "miValor"}]
 **/
procesos.ArmarParametrosX03 = () => {
    let datos = []

    $('input[id^="P' + paginaActual + '"]').each((i, it) => {
        let inputs = {
            "id": obtenerNombreRealItem(it.id),
            "valor": it.value
        }
        datos.push(inputs);
    });

    $('select[id^="P' + paginaActual + '"]').each((i, it) => {
        let selects = {
            "id": obtenerNombreRealItem(it.id),
            "valor": it.value
        }
        datos.push(selects);
    });

    $('.radio_group[id^="P' + paginaActual + '"]').each((i, it) => {
        let radio_group = {
            "id": obtenerNombreRealItem(it.id),
            "valor": it.value
        }
        datos.push(radio_group);
    });

    $('textarea[id^="P' + paginaActual + '"]').each((i, it) => {
        let textarea = {
            "id": obtenerNombreRealItem(it.id),
            "valor": it.value
        }
        datos.push(textarea);
    });

    let objectoCompleto = {
        "idAplicacion": aplicacionActual,
        "idPagina": paginaActual,
        "items": datos
    };

    procesos.mensajesConsola.log('Recoleccion de informcion', objectoCompleto);
    return JSON.stringify(objectoCompleto);
};

/**
 * @module procesos.Redirecionamiento
 * @example procesos.Redirecionamiento("NORMAL","f?p=105:455:11435710735386")
 * @description funcion para redireccionar a otras paginas modales o normales
 * @param {tipo de pagina destino (MODAL o NORMAL)} TipoLink
 * @param {link destino} link
 */
procesos.redirecionamiento = (TipoLink, link) => {
    if (TipoLink == "MODAL") {
        eval(link);
    } else if (TipoLink == "NORMAL") {
        window.open(link, "_blank");
    };
}

/**
 * @module procesos.limpiarFormulario
 * @example procesos.limpiarFormulario()
 * @description funcion para limpiar formularios
 */
procesos.limpiarFormulario = () => {
    $('input[id^="P' + paginaActual + '"]').val('');
    $('select[id^="P' + paginaActual + '"]').val('');
    $('.radio_group[id^="P' + paginaActual + '"]').val('');
    $('textarea[id^="P' + paginaActual + '"]').val('');
};

/**
 * @module procesos.desabilitarItem
 * @example safix.procesos.desabilitarItem(item)
 * @description funcion para desabiltar items
 * @param {Id o Nombre del item} item
 */
procesos.desabilitarItem = (item) => {
    procesos.mensajesConsola.log('Desabilitacion del item', item);
    $(item).prop('disabled', true);
    $(item).css("background-color", safix.colores.VA_GRIS);
};

/**
 * @module procesos.habilitarItems
 * @example safix.procesos.habilitarItems(item)
 * @description funcion para habilitar items
 * @param {Id o Nombre del item} item
 */
procesos.habilitarItems = (item) => {
    procesos.mensajesConsola.log('Habilitacion del item', item);
    $(item).prop('disabled', false);
    $(item).css("background-color", safix.colores.VA_BLANCO);
};

/**
 * @module procesos.pintarItem
 * @example safix.procesos.pintarItem('P1_MYITEM', 'RED')
 * @description Pintar items de un formulario
 * @param {Id o Name del item} item 
 * @param {Color del cual se quiere pintar el item} color 
 */
procesos.pintarItem = (item, color) => {
    procesos.mensajesConsola.log('Pintado del item', item, 'color', color);
    $(item).css("background-color", color);
}

/**
 * @module procesos.hipervinculos
 * @param {id del item o del hipervinculo} idItem
 * @example safix.procesos.hipervinculos(idItem)
 * @description funcionalidad de hipervinculos para los diferentes templates configurados
 */
procesos.hipervinculos = (idItem) => {
    procesos.mensajesConsola.aviso('Se ejecuta el hipervinculo del item' + idItem);

    apex.server.process("PU_HIPERVINCULOS",
        {
            x01: idItem,
            x02: procesos.ArmarParametrosX01()
        },
        {
            success: function (res) {
                procesos.mensajesConsola.log('Respuesta de PU_HIPERVINCULOS' + res);
                if (res.Errores = 'N') {
                    if (res.TipoPagina == "MODAL") {
                        eval(res.Path);
                    } else {
                        let idpaginaLink = idItem + '_LINK';
                        document.getElementById(idpaginaLink).setAttribute("onclick", "window.open('" + res.Path + "')");
                        window.open(res.Path, target = "_blank");
                    }
                } else {
                    Swal.fire({
                        icon: 'error',
                        title: 'Oops...',
                        text: res.Mensaje
                    })
                }
            },
            error: function (res) {
                procesos.mensajesConsola.error('Error en la ejecucion del hipervinulo' + res);
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: "Favor valide, el proceso no quedo bien instalado " + res
                })
            }
        });
}

/**
 * @module procesos.asignaciones
 * @param {respuesta del procedimiento ajax callback} res
 * @example safix.procesos.asignaciones(res)
 * @description funcionalidad para asignar valores a todos los items de una pagina
 */
procesos.asignaciones = (res) => {
    procesos.mensajesConsola.log('For each a todos los items del json');
    Object.keys(res).forEach((e) => {
        procesos.mensajesConsola.log('key', e);
        if (e.includes("P" + paginaActual)) {
            procesos.mensajesConsola.log('Se reconoce como item de la pagina', e);

            let primerLetraParametro = e.substring(0, 1); //obtenemos la primera posicion del parametro

            procesos.mensajesConsola.log('Revision o validacion de primer caracter del parametro', primerLetraParametro);

            let tipoMascara = safix.procesos.listas.tiposEnmascaramientos[primerLetraParametro]; // buscamos el tipo de mascara que vamos a utlizar

            procesos.mensajesConsola.log('Revision o validacion del tipo de mascara que se debe utilizar', tipoMascara);

            let nombreItem, valor; // declaramos variable que va a guaradar el nombre del item y el valor

            if (tipoMascara == "ninguno") {
                procesos.mensajesConsola.log('No se requiere enmasacarar el valor');
                nombreItem = e;
                valor = res[e];
                procesos.mensajesConsola.log('Nombre del item', nombreItem, 'valor', valor);
            } else {
                let mascara = procesos.obtenerMascara(tipoMascara);
                procesos.mensajesConsola.log('Se obtiene el tipo de mascara', mascara);

                mascara = JSON.parse(mascara);

                nombreItem = e.replace(primerLetraParametro, '');

                valor = procesos.EnmascararValores(mascara.region, mascara.moneda, res[e]);

                procesos.mensajesConsola.log('Nombre del item', nombreItem, 'valor', valor);
            };

            //asignacion de valores
            if (e.includes("#")) {
                procesos.mensajesConsola.log('Asignacion sin ejecucion de accion dinamica');
                $(nombreItem).val(valor);
            } else if ($(`#${e}`).length) {
                procesos.mensajesConsola.log('Asignacion con ejecucion de accion dinamica');
                apex.item(nombreItem).setValue(valor);
            };
        }
    })
}

/**
 * @module procesos.asignaciones2
 * @param {respuesta del procedimiento ajax calback} res
 * @example safix.procesos.asignaciones2(res)
 * @description funcionalidad para asignar valores a todos los items de una pagina sin ejecutar accion accion dinamica
 */
procesos.asignaciones2 = (res) => {
    procesos.mensajesConsola.log('For each a todos los items del json');
    Object.keys(res).forEach((e) => {
        procesos.mensajesConsola.log('key', e);
        if (e.includes("P" + paginaActual)) {
            procesos.mensajesConsola.log('Se reconoce como item de la pagina', e);
            procesos.mensajesConsola.log('Asignacion sin ejecucion de accion dinamica');
            $(`#${e}`).val(res[e]);
        }
    })
}

/**
 * @module procesos.mensajesConsola()
 * @example safix.procesos.mensajesConsola
 * @description manejo de consola configurable
 */
procesos.mensajesConsola = {
    error: function () {
        if (verErroresConsola) {
            console.error(arguments);
        }
    },
    log: function () {
        if (verLogsConsola) {
            console.log(arguments);
        }
    },
    aviso: function () {
        if (verAvisosConsola) {
            console.warn(arguments);
        }
    }
}

/**
 * @module procesos.xml_To_Json
 * @description Conversion de un xml a Json
 * @param {Xml a convertir} DataXml 
 * @returns {Json convertido}
 */
procesos.xml_To_Json = (DataXml) => {
    safix.procesos.mensajesConsola.log(`Entra a convertir el XML a Json Valor`);
    try {
        var conversor = new X2JS();
        var retorno = DataXml;

        return JSON.stringify(conversor.xml_str2json(retorno));
    } catch (error) {
        safix.procesos.mensajesConsola.error(`ERROR EN LA CONVERSION DEL XML A JSON!`, error);
        return null;
    }
}

/**
 * @module procesos.mostrarRegion
 * @description refresca y muestra regiones
 * @param {id de la region que se quiere mostrar} idRegion 
 * @returns {Retorna un boleano, true se mostro, false no se mostro}
 */
procesos.mostrarRegion = (idRegion) => {
    try {
        apex.region(idRegion).refresh();
        $x_Show(idRegion);
        return true;
    } catch (error) {
        safix.procesos.mensajesConsola.error(`ERROR MOSTRANDO LA REGION SOLICITADA`, error);
        return false;
    }
}

/**
 * @module procesos.tomarItemsNoNulos
 * @example {safix.procesos.tomarItemsNoNulos}
 * @description {armado de json string donde se envian todos los items no nulos de la pagina}
 * @CreateBy Jcardona
 */
procesos.tomarItemsNoNulos = () => {
    const datos = {};
    procesos.mensajesConsola.log('Recolección de información');

    // Tipos de elementos a buscar
    const tiposElementos = ['input', 'select', '.radio_group', 'textarea'];
    
    // Páginas a revisar (actual y página 0)
    const paginas = [paginaActual, '0'];

    // Función para procesar cada elemento
    const procesarElemento = (elemento) => {
        const valor = $v(elemento);
        if (valor) {
            datos[elemento.id] = valor;
        }
    };

    // Iterar sobre tipos y páginas
    tiposElementos.forEach(tipo => {
        paginas.forEach(pagina => {
            const selector = `${tipo}[id^="P${pagina}"]`;
            $(selector).each((_, elemento) => procesarElemento(elemento));
        });
    });

    procesos.mensajesConsola.log('Datos recolectados:', datos);
    return JSON.stringify(datos);
}

/**
 * @module procesos.listarInputsVisibles
 * @create Feb 14 2025. Johan Cardona.
 * @description {Funcion para retorna los items visibles en pantalla }
 * @example {safix.procesos.listarInputsVisibles}
 * @returns retorna listado de items visibles.
 */
procesos.listarInputsVisibles = () => {
    const inputs = Array.from(document.querySelectorAll('input'))
        .filter(input => input.offsetParent !== null) // Filtra los visibles
        .map(input => ({
            name: input.name || input.id || 'Sin nombre',
            type: input.type,
            value: input.value,
            readOnly: input.readOnly // Indica si es de solo lectura
        })
    );

    safix.procesos.mensajesConsola.log(inputs);

    return inputs;
}

/**
 * @module procesos.recuperarEnfoque
 * @create Feb 14 2025. Johan Cardona. 
 * @description {funcion que retoma el enfoque cuando este se pierde, ubicandose en el item nulo proximo a llenar o el ultimo item enfocado}
 */
procesos.recuperarEnfoque = () => {
    const inputs = Array.from(document.querySelectorAll('input'))
        .filter(input => input.offsetParent !== null && input.value == "" && input.disabled == false)
        .map(input => ({
            name: input.name || input.id || 'Sin nombre'
        }));

    document.getElementById(inputs[0].name || safix.ultimoItemFocus).focus();
}

/**
 * @module procesos.insertarEstiloPersonalizado
 * @create Mar 07 2025. Johan Cardona. 
 * @description {Inserta una regla de estilo ::before en la hoja de estilos para un elemento específico}
 * @param {string} idObjetivo - El ID del elemento al que se aplicará el estilo (sin el #)
 * @param {string} textoContenido - El texto que se mostrará en el content
 * @param {Object} opciones - Opciones adicionales para personalizar el estilo
 * @param {string} opciones.colorFondo - Color de fondo (por defecto: "white")
 * @param {string} opciones.colorTexto - Color del texto (por defecto: "#479ea3")
 * @param {string} opciones.abajo - Posición inferior (por defecto: "5px")
 * @param {string} opciones.izquierda - Posición izquierda (por defecto: "20px")
 * @param {string} opciones.relleno - Padding (por defecto: "0 5px")
 */
procesos.insertarEstiloPersonalizado = (idObjetivo, textoContenido, opciones = {}) => {
    // Valores por defecto
    const valoresPorDefecto = {
        colorFondo: "white",
        colorTexto: "gray",
        abajo: "12px",//"5px",
        izquierda: "20px",
        relleno: "0 5px"
    };

    // Combinar opciones con valores por defecto
    const configuracion = { ...valoresPorDefecto, ...opciones };

    // Crear el estilo CSS
    const reglaCss = `
      #${idObjetivo}::before {
        content: '${textoContenido}';
        position: relative !important;
        bottom: ${configuracion.abajo} !important;
        left: ${configuracion.izquierda} !important;
        z-index: 9 !important;
        background: ${configuracion.colorFondo};
        padding: ${configuracion.relleno};
        color: ${configuracion.colorTexto};
        font-weight: 700;
      }
    `;

    // Verificar si ya existe el elemento de estilo global
    let elementoEstilo = document.getElementById(safix.idHojaEstilosInyectada);

    // Si no existe, crear uno nuevo
    if (!elementoEstilo) {
        safix.procesos.mensajesConsola.aviso(`No existe el elemento de estilo global. Creando uno nuevo.`);
        elementoEstilo = document.createElement('style');
        elementoEstilo.id = safix.idHojaEstilosInyectada;
        document.head.appendChild(elementoEstilo);
    }

    // Agregar la nueva regla CSS al elemento de estilo existente
    elementoEstilo.textContent += reglaCss;

    return {
        actualizar: function (nuevoTextoContenido, nuevasOpciones = {}) {
            // Actualizar el estilo con nuevos parámetros
            procesos.insertarEstiloPersonalizado(idObjetivo, nuevoTextoContenido, { ...configuracion, ...nuevasOpciones });
        },
        eliminar: function () {
            // Eliminar la regla específica del estilo global
            const estilosActuales = elementoEstilo.textContent;
            const nuevaRegla = `#${idObjetivo}::before {`;
            const inicioRegla = estilosActuales.indexOf(nuevaRegla);
            if (inicioRegla !== -1) {
                const finRegla = estilosActuales.indexOf('}', inicioRegla) + 1;
                elementoEstilo.textContent = estilosActuales.slice(0, inicioRegla) + estilosActuales.slice(finRegla);
            }
        }
    };
}

/**
 * @module procesos.controlarElemento
 * @create Mar 07 2025. Johan Cardona. 
 * @description Inhabilita o habilita cualquier elemento de entrada (input, select, textarea) y aplica estilos
 * @param {string} idElemento - El ID del elemento que se quiere modificar
 * @param {boolean} inhabilitar - true para inhabilitar, false para habilitar
 * @param {Object} opciones - Opciones de configuración visual adicionales
 * @param {string} opciones.colorTexto - Color del texto cuando está inhabilitado
 * @param {string} opciones.colorFondo - Color de fondo cuando está inhabilitado
 * @param {string} opciones.colorBorde - Color del borde cuando está inhabilitado
 * @param {number} opciones.opacidad - Nivel de opacidad cuando está inhabilitado (0-1)
 * @param {boolean} opciones.resaltarTexto - Si se debe resaltar el texto del elemento
 * @param {string} opciones.tipoResaltado - Tipo de resaltado: "negrita" o "color"
 * @param {string} opciones.colorResaltado - Color para resaltar (si tipoResaltado es "color")
 */
procesos.controlarElemento = (idElemento, inhabilitar, opciones = {}) => {
    // Valores por defecto
    const config = {
        colorTexto: safix.colores.VA_GRIS_OSCURO,
        colorFondo: safix.colores.VA_GRIS,
        colorBorde: safix.colores.VA_GRIS,
        opacidad: 0.6,
        resaltarTexto: true,
        tipoResaltado: "color", // negrilla o color
        colorResaltado: safix.colores.VA_AZUL, //    azul por defecto
        ...opciones
    };

    procesos.controlarElemento.configuracion = config;

    safix.procesos.mensajesConsola.log(`Configuración de control de elemento:`, config);

    // Obtener el elemento
    const elemento = document.getElementById(idElemento);

    if (!elemento) {
        safix.procesos.mensajesConsola.error(`El elemento con ID "${idElemento}" no existe.`);
        return;
    }

    // Identificar si es un elemento de entrada
    const esInputOSelect = ['INPUT', 'SELECT', 'TEXTAREA', 'BUTTON'].includes(elemento.tagName);

    // Controlar la clase para los estilos
    const claseDeshabilitado = 'elemento-deshabilitado';

    // Verificar si ya existe el elemento de estilo global
    let elementoEstilo = document.getElementById(safix.idHojaEstilosInyectada);

    // Si no existe, crear uno nuevo
    if (!elementoEstilo) {
        elementoEstilo = document.createElement('style');
        elementoEstilo.id = safix.idHojaEstilosInyectada;
        document.head.appendChild(elementoEstilo);
    }

    // Crear estilos CSS si no existen ya
    if (!elementoEstilo.textContent.includes(claseDeshabilitado)) {
        const estiloTextoNegrita = config.resaltarTexto && config.tipoResaltado === "negrilla" ? "font-weight: bold;" : "";
        const estiloTextoColor = config.resaltarTexto && config.tipoResaltado === "color" ? `color: ${config.colorResaltado} !important; -webkit-text-fill-color: ${config.colorResaltado} !important;` : "";

        const estilosCss = `
          .${claseDeshabilitado} {
            opacity: ${config.opacidad};
            cursor: not-allowed;
            background-color: ${config.colorFondo};
            border-color: ${config.colorBorde};
            color: ${config.colorTexto};
            -webkit-text-fill-color: ${config.colorTexto};
            pointer-events: none;
            user-select: none;
            -webkit-user-select: none;
            -moz-user-select: none;
            -ms-user-select: none;
            ${estiloTextoNegrita}
            ${estiloTextoColor}
          }
          
          /* Eliminar flechas en navegadores para inputs numéricos */
          input[type="number"].${claseDeshabilitado}::-webkit-inner-spin-button,
          input[type="number"].${claseDeshabilitado}::-webkit-outer-spin-button {
            -webkit-appearance: none;
            margin: 0;
          }
          
          /* Eliminar flechas en Firefox para inputs numéricos */
          input[type="number"].${claseDeshabilitado} {
            -moz-appearance: textfield;
          }
          
          /* Ajustes para móviles y tabletas */
          @media (pointer: coarse) {
            .${claseDeshabilitado} {
              font-size: 16px;
              -webkit-tap-highlight-color: transparent;
            }
          }
        `;

        elementoEstilo.textContent += estilosCss;
    }

    // Aplicar o quitar la clase según corresponda
    if (inhabilitar) {
        // Si es un elemento de entrada, usar el atributo disabled
        if (esInputOSelect) {
            elemento.disabled = true;
        }

        elemento.classList.add(claseDeshabilitado);

        // Aplicar estilos de resaltado directamente al elemento
        if (config.resaltarTexto) {
            if (config.tipoResaltado === "negrita") {
                elemento.style.fontWeight = "bold";
            } else if (config.tipoResaltado === "color") {
                elemento.style.color = config.colorResaltado;
                elemento.style.webkitTextFillColor = config.colorResaltado;
            }
        }

        // Guardar el valor original para poder restaurarlo después si es necesario
        if (elemento.value !== undefined) {
            elemento.setAttribute('data-valor-original', elemento.value);
        } else if (elemento.textContent) {
            elemento.setAttribute('data-texto-original', elemento.textContent);
        }

        // Preservar la funcionalidad de eventos pero impedir interacciones
        elemento.setAttribute('aria-disabled', 'true');
    } else {
        // Si es un elemento de entrada, quitar el atributo disabled
        if (esInputOSelect) {
            elemento.disabled = false;
        }

        elemento.classList.remove(claseDeshabilitado);

        // Quitar estilos de resaltado
        elemento.style.fontWeight = "";
        elemento.style.color = "";
        elemento.style.webkitTextFillColor = "";

        // Restaurar el foco si es necesario
        if (esInputOSelect) {
            elemento.blur();
        }

        // Restaurar accesibilidad
        elemento.removeAttribute('aria-disabled');
    }

    return {
        habilitar: function () {
            procesos.controlarElemento(idElemento, false);
        },
        inhabilitar: function () {
            procesos.controlarElemento(idElemento, true, config);
        },
        actualizarOpciones: function (nuevasOpciones) {
            procesos.controlarElemento(idElemento, true, { ...config, ...nuevasOpciones });
        },
        estaInhabilitado: function () {
            return elemento.classList.contains(claseDeshabilitado);
        }
    };
}

/**
 * @module procesos.DesenmascararValores
 * @create Jun 04 2025. Johan Cardona.
 * @description Desenmascara valores.
 * @param {string} valorEnmascarado - Valor con mascara.
 * @returns valor numerico.
 */
procesos.DesenmascararValores = (valorEnmascarado) => {
    // Eliminar espacios en blanco al inicio y final
    let valorLimpio = valorEnmascarado.trim();
    
    // Eliminar símbolo de moneda ($ y otros símbolos comunes)
    valorLimpio = valorLimpio.replace(/[$€£¥₹₽¢]/g, '');
    
    // Eliminar espacios
    valorLimpio = valorLimpio.replace(/\s/g, '');
    
    // Reemplazar comas como separadores de miles por nada
    valorLimpio = valorLimpio.replace(/\./g, '');
    
    // Reemplazar la coma decimal por punto (formato estándar)
    valorLimpio = valorLimpio.replace(',', '.');
    
    // Convertir a número flotante
    let valorNumerico = parseFloat(valorLimpio);
    
    // Verificar si el resultado es un número válido
    if (isNaN(valorNumerico)) {
        throw new Error('El valor proporcionado no es un formato de moneda válido');
    }
    
    return valorNumerico;
};

/**
 * @module procesos.generarHashSHA256
 * @create Jul 02 2025. Johan Cardona. 
 * @description generar hash para cadenas de texto.
 * @param {String} cadena texto que se va a encriptar.
 * @returns texto encriptado
 */
procesos.generarHashSHA256 = async (cadena) => {
    const encodedText = new TextEncoder().encode(cadena);
    const hashBuffer = await crypto.subtle.digest("SHA-256", encodedText);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, "0")).join("");
    return hashHex;
}

/**
 * @module procesos.ArmarParametrosPageItems
 * @example safix.procesos.ArmarParametrosPageItems();
 * @description Se llama para obtener los ids de los items de la pagina actual
 * @returns {Array} Retorna un array con los ids de los items de la pagina actual
 */
procesos.ArmarParametrosPageItems = () => {
    let pageItemIds = [];

    // // Selecciona todos los elementos que comienzan con "P" + número de página
    // $('input[id^="P' + paginaActual + '"], select[id^="P' + paginaActual + '"], textarea[id^="P' + paginaActual + '"], .radio_group[id^="P' + paginaActual + '"]')
    //     .each((i, it) => {
    //         const idLimpio = it.id.replaceAll('|input', '');
    //         if (!pageItemIds.includes(`#${idLimpio}`)) {
    //             pageItemIds.push(`#${idLimpio}`);
    //         }
    //     });
    $('input[id^="P' + paginaActual + '"], select[id^="P' + paginaActual + '"], textarea[id^="P' + paginaActual + '"]')
    .each((i, it) => {
        // Limpiar el ID removiendo sufijos comunes
        let idLimpio = obtenerNombreRealItem(it.id);
        
        // Verificar que el item existe en APEX antes de agregarlo
        if (apex.item(idLimpio).node && !pageItemIds.includes(`#${idLimpio}`)) {
            pageItemIds.push(`#${idLimpio}`);
        }
    });
    return pageItemIds;
};

/**
 * @module procesos.habilitarEditIG
 * @create Sep 03 2025. Juan Esteban Londoño. 
 * @description {Función que habilita el modo de edición de los interactive grid recibiendo el static ID de la región}
 */
procesos.habilitarEditIG = (gridId) => {
    try {
        var igRegion = apex.region(gridId);

        if (!igRegion) {
            console.error("No se encontró el IG con id:", gridId);
            return;
        }

        var igActions = igRegion.call("getActions");
        igActions.set("edit", true);

        //console.log("Modo edición habilitado en el IG:", gridId);
    } catch (e) {
        console.error("Error habilitando edición en IG:", e);
    }
}

/**
 * @module obtenerNombreRealItem
 * @example obtenerNombreRealItem('P1_MYITEM|input')
 * @create Sep 30 2025. Johan Cardona.
 * @param {String} itemId Id del item que se quiere limpiar
 * @description Limpia el id del item para obtener el nombre real del item en caso de que tenga sufijos como |input, _HIDDENVALUE, _DISPLAY, _input
 * @returns {String} Retorna el nombre real del item
 */
function obtenerNombreRealItem(itemId) {
    try {
        let limpio = itemId
            .replaceAll('|input', '')
            .replaceAll('_HIDDENVALUE', '')
            .replaceAll('_DISPLAY', '')
            .replaceAll('_input', '')
            .replaceAll('_month', '')
            .replaceAll('_year', '')
            ;

        let elemento = document.getElementById(limpio);

        // Si es un radio, el item real está en el atributo name
        if (elemento && elemento.type === "radio" && elemento.name) {
            return elemento.name;
        }

        return limpio;
    } catch (error) {
        safix.procesos.mensajesConsola.error(`Error limpiando el id del item ${itemId}`, error);
        return itemId;
    }
}
