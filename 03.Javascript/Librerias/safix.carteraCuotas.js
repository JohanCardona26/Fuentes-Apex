/**
 * @namespace safix.carteraCuotas
 */

const carteraCuotas = {};

safix.carteraCuotas = carteraCuotas;

carteraCuotas.cargaFacturas = (jsonValor) => {

    let jsonFacturas = safix.carteraCuotas.xml_To_Json(jsonValor);

    jsonFacturas = safix.nvl(jsonFacturas, 'N');

    if (jsonFacturas != 'N') {

        let totalFacturas = safix.nvl((jsonFacturas.length), 0);

        if (totalFacturas == 0) {
            totalFacturas   = 0;

            jsonFacturas    = [
                jsonFacturas
            ];

        } else{
            totalFacturas = totalFacturas - 1;
        }

        safix.procesos.mensajesConsola.log(`jsonFacturas`, jsonFacturas, `totalFacturas`, totalFacturas);

        safix.alertas.carga('Obteniendo facturas', 15000);

        try {
            Object.keys(jsonFacturas).forEach(function (posicion) {
                let codigoFactura = safix.nvl(jsonFacturas[posicion]['No_x0020_Factura'], 'N');

                if (codigoFactura != `N`) {

                    if (totalFacturas == posicion) {
                        var ultima = `S`;
                    };

                    if (posicion == 0) {
                        var borrarTemp = `S`;
                    }

                    try {
                        apex.server.process('PU_ALMACENAR_FACTURAS_TEMP',
                            {
                                x01: safix.procesos.ArmarParametrosX01(),
                                x02: null,
                                x03: null,
                                x04: JSON.stringify(jsonFacturas[posicion]),
                                x05: safix.nvl(ultima, `N`),
                                x06: safix.nvl(borrarTemp, `N`)
                            },
                            {
                                success: function(resAlmacenamiento) {
                                    safix.procesos.mensajesConsola.log('Respuesta del llamado callback', resAlmacenamiento);

                                    if (resAlmacenamiento.Errores == "S") {
                                        safix.procesos.mensajesConsola.error('Con errores', resAlmacenamiento.Mensaje);
                                        //cuando hay errores solo se mostarara la alerta con el error
                                        safix.alertas.toast.error(resAlmacenamiento.Mensaje);
                                    } else {
                                        safix.procesos.mensajesConsola.aviso('Sin errores');
                                        if (resAlmacenamiento.MensajeExito) {
                                            safix.procesos.mensajesConsola.aviso('Con mensaje de exito');
                                            // alertas.exito(res.MensajeExito, 15000);
                                            safix.alertas.toast.exito(resAlmacenamiento.MensajeExito);
                                        };
                                    }

                                    /**
                                     * @MostrarRegion 
                                     * Se toma el id mostrado se ubica la region y se muestra
                                     * Apex_Json.write('MostrarRegion', 'Id de la region')
                                     */

                                    let idRegionM = safix.nvl(resAlmacenamiento.MostrarRegion, 'N');

                                    if (idRegionM != 'N' || ultima == `S`) {
                                        safix.procesos.mensajesConsola.aviso(`Muestra la region ${idRegionM}`);
                                        safix.procesos.mostrarRegion(idRegionM);
                                    }

                                    Swal.close();
                                },
                                error: function(errorAlmacenamiento) {
                                    safix.procesos.mensajesConsola.error('Con errores', errorCalback);
                                    //cuando hay errores solo se mostarara la alerta con el error
                                    safix.alertas.toast.error(errorCalback);                                
                                }
                            }).then((e) => {
                                safix.procesos.mensajesConsola.log('Respuesta del llamado callback', e);
                            })
                    } catch (errorCalback) {
                        safix.procesos.mensajesConsola.error('Con errores', errorCalback);
                        //cuando hay errores solo se mostarara la alerta con el error
                        safix.alertas.toast.error(errorCalback);
                    }
                }
            })
        } catch (errorLoop) {
            safix.procesos.mensajesConsola.error('Con errores', errorCalback);
            //cuando hay errores solo se mostarara la alerta con el error
            safix.alertas.toast.error(errorCalback);
        }
    } else {
        safix.alertas.toast.error(`FACTURAS NO ENCONTRADAS`);
    }

}

/**
 * @module carteraCuotas.xml_To_Json
 * @description Conversion de un xml a Json
 * @param {Xml a convertir} dataXml 
 * @returns {Json convertido}
 */
carteraCuotas.xml_To_Json = (dataXml) => {
    safix.procesos.mensajesConsola.log(`Entra a convertir el XML a Json Valor`);

    try {
        var conversor   = new X2JS();

        var jsonvalor = conversor.xml_str2json(dataXml) 

        safix.procesos.mensajesConsola.log(`jsonvalor`, jsonvalor);

        jsonvalor = jsonvalor.Envelope.Body.IntegracionXencoResponse.IntegracionXencoResult.diffgram.NewDataSet.Table;

        return (jsonvalor);
        
    } catch (error) {
        safix.procesos.mensajesConsola.error(`ERROR EN LA CONVERSION DEL XML A JSON!`, error);
        return null;
    }
    
} 

carteraCuotas.cargarFormulario = async () => {
    let url = document.location.href.split(':'); // array con las particiones de la url.
    let urlred = url[0] + ':' + url[1] + ':' + url[2] + ':' + url[3]; // url a la que se va a redirigir una vez termine el proceso.
    safix.procesos.mensajesConsola.log('urlred. ' + urlred );

    let reference = P186_REFERENCE.value;
    let monto = P186_AMOUNT_CENTS.value + "00";
    let tipoMoneda = P186_CURRENCY.value;
    let secret = P186_PUBLIC_KEY.value;
    let integrity = P186_SIGNATURE_INT.value;

    const cadena = reference+monto+tipoMoneda+integrity;
    const hash = await calcularSHA256(cadena);

    const widgetData = {
        currency : tipoMoneda,
        amountInCents: monto,
        reference: reference,
        publicKey:secret,
        signature:{
            integrity:hash
        },
        redirectUrl:urlred
    };

    safix.procesos.mensajesConsola.log('WidGet Data', widgetData);

    var checkout = new WidgetCheckout(widgetData);

    safix.procesos.ejecutarCallback('Llenar_Item');
    
    checkout.open(function (result) {
        safix.procesos.mensajesConsola.log('Result',result );
    });
} 