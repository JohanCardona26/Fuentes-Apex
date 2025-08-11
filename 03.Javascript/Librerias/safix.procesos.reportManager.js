/**
 * @namespace procesos.reportManager
 * @description Funcionalidades de la barra de navegacion
 */

const reportManager = {}; //modulo para los procesos normales

safix.procesos.reportManager = reportManager; 
safix.reportManager = reportManager; /**NO USAR**/

/**
 * @class {GeneracionReporte}
 * @description {contiene los datos y procesos basicos que se deben de tener en cuenta para la generacion de reportes}
 * @createBy Jcardona Agosto 2023
 * @param {Nombre del reporte (como aparezca en yModulos)} nombreReporte 
 * @param {Se deben listar los parametros de la siguiente manera: P_Param1=valor1&P_Param2=valor2} parametrosReporte 
 * @param {Ruta o nombre del directorio donde caen los reportes una vez generados} directorio 
 * @param {Credenciales de la siguiente manera: SAFIX/SAFIXDBA/SAFIX (usuario/clave/nombrebasededatos@)} conexion 
 * @returns =)
 */
class GeneracionReporte {

    constructor(nombreReporte,parametrosReporte,directorio, conexion, nombrePdf) {
        this.ajaxGeneracion = "GenerarReporte",
        this.ajaxObtener    = "ObtenerReporte",
        this.nombreReporte  = `report=${nombreReporte}`,
        this.directorio     = directorio,
        this.conexion       = conexion,
        this.parametrosReporte = parametrosReporte,
        this.nombrePdf      = nombrePdf
    };

    /**
     * @module procesos.generarReporteAsync()
     * @CraeteBy Jcardona AGOSTO 2023 
     * @description Generacion de reportes de oracle desde apex
     * @param {Nombre del reporte (como aparezca en yModulos)} nombreReporte 
     * @param {Se deben listar los parametros de la siguiente manera: P_Param1=valor1&P_Param2=valor2} parametrosReporte 
     * @param {Ruta o nombre del directorio donde caen los reportes una vez generados} directorio 
     * @param {Credenciales de la siguiente manera: SAFIX/SAFIXDBA/SAFIX (usuario/clave/nombrebasededatos@)} conexion 
     * @returns =)
     */

    async generarReporteAsync (posicion) {
        let origen = this;
        return new Promise(resolve => {
            apex.server.process(this.ajaxGeneracion,
            {
                x01: this.nombreReporte,
                x02: `P_ADMISION=${this.parametrosReporte[posicion || 0]}`,
                x03: this.directorio,
                x04: this.conexion,
                x05: `${this.nombreReporte}_${this.parametrosReporte[posicion || 0]}`
            }, 
            {
                success: function(res) {
                    return res;
                },
                error: function(a) {

                    if(!origen || origen == undefined){
                        throw "Reporte Null"; // Levanta exception cuando el valor nombre del reporte llega null                        
                    }

                    safix.procesos.mensajesConsola.error(`Error obteniendo el reporte, ${a}`,a, origen, posicion);
                    origen.generarReporteAsync(posicion).then((e)=>{
                        safix.procesos.mensajesConsola.error(`Repeticion Res`,e);
                        resolve(e);
                    });
                }
            }).then ((e)=> 
            {
                resolve(e);
            })
        })
    }


    /**
     * @module GeneracionReporte.obtenerReporteAsync
     * @CraeteBy Jcardona AGOSTO 2023 
     * @param {posicion en array del reporte a generar por defecto es 0} posicion
     * @returns =)
     */
    async obtenerReporteAsync (posicion) {        
        return new Promise(resolve => {
            apex.server.process(this.ajaxObtener,
                {
                    x01: this.nombrePdf[posicion||0], 
                    x02: this.directorio, 
                    x03: this.nombreReporte, 
                    x04: this.origenUrl
                }).then((e) => {
                    resolve(e);
                })
        })
    };
}

reportManager.GeneracionReporte = GeneracionReporte; 

/**
 * @class GeneracionReportesVarios
 * @description {contiene proceso para la generacion de varios reportes en una sola ejecucion}
 * @createBy Jcardona Agosto 2023
 * @param {Nombre del reporte (como aparezca en yModulos)} nombreReporte 
 * @param {Se deben listar los parametros de la siguiente manera: P_Param1=valor1&P_Param2=valor2} parametrosReporte 
 * @param {Ruta o nombre del directorio donde caen los reportes una vez generados} directorio 
 * @param {Credenciales de la siguiente manera: SAFIX/SAFIXDBA/SAFIX (usuario/clave/nombrebasededatos@)} conexion 
 * @param {Parametros como se indica en <generarReporteAsync>} listadoParametrosReportes 
 * @param {Nombres de los reportes} listadoNombreReportes 
 * @param {total de reportes} totalReportes 
 */

class GeneracionReportesVarios extends GeneracionReporte {

    constructor (nombreReporte,parametrosReporte,directorio, conexion, listadoParametrosReportes, listadoNombreReportes, totalReportes){

        super(nombreReporte,parametrosReporte,directorio, conexion, listadoNombreReportes)
        this.agrupacion                 = 5,
        this.listadoParametrosReportes  = listadoParametrosReportes,
        this.listadoNombreReportes      = listadoNombreReportes,
        this.totalReportes              = totalReportes ;
    }

    /**
     * @module generarVariosReportesAsync
     * @description {Proceso para generara varios reportes desde Oracle Apex}
     * @createBy {Johan Cardona Agosto 2023}
     * @param {Nombre del reporte que se va a generar} NombreReporte 
     * @param {Parametros como se indica en <generarReporteAsync>} listadoParametrosReportes 
     * @param {Nombre o ruta del reporte en el servidor} directorio 
     * @param {credenciales que se usan para el Reports} conexion 
     * @returns {Array con los resultados del callback}
     */

    async generarVariosReportesAsync  ()  {

        let totalReportes = this.listadoParametrosReportes.length; // tomamos total de reportes a generar
        let agrupacion    = this.agrupacion; //Indica en grupos de a cuantos se van a generar los reportes, este valor se cambia solo en el archivo safix.js
        let respuesta     = []; //array que tiene toda la respuestas del callback

        let contador = 0;

        for (let i = 0; i < totalReportes; i += agrupacion) { //loop que recorre cada x elementos
            
            const grupoReportes = []; // array para guardar las tareas agrupadas
        
            for (let j = i; j < i + agrupacion && j < totalReportes; j++) { //loop que reccore cada elemento del grupo

                grupoReportes.push( //llenamos el array con las tareas
                    //la tarea que se guarda como tal es la generacion del reporte
                    super.generarReporteAsync(j).then((resGenerarReporte) => {
                        contador =+
                        safix.procesos.mensajesConsola.log(
                            'Se genera el reporte',
                            (j + 1),
                            totalReportes
                        );

                        //Alerta update de proceso
                        safix.alertas.carga('Generando reporte ' + (j + 1) + ' de ' + totalReportes);

                        return resGenerarReporte.Resp;//retornamos todo el resultado del callback
                    })
                );
            }
            //Mensaje en consola
            safix.procesos.mensajesConsola.log(`Ejecutando grupo de reportes: ${i + 1} - ${i + grupoReportes.length}`)
            //Ejecucion de todas las promesas agrupdas
            const grupoResultados = await Promise.all(grupoReportes);
            //Adicion al array final de resultados
            respuesta.push(...grupoResultados);
        }
        //Mensaje en consola
        safix.procesos.mensajesConsola.aviso("Todos los reportes se generaron exitosamenete");
        //Retornamos la respuesta
        return respuesta;
    }

    /**
     * @module obtenerReportesVarios
     * @description {Obtener varios reportes en un .zip}
     * @createBy {Jcardona AGOSTO 2023}
     * 
     */

    obtenerReportesVarios () {

        this.listadoNombreReportes.forEach ((nombreReportes, posicion) => {
            safix.alertas.carga(`Obteniendo reporte ${posicion + 1} de ${this.totalReportes}`);

            this.obtenerReporteAsync(posicion).then((resObtenenerReporte)=> {
                safix.procesos.mensajesConsola.log(
                    'ENTRA A LA FUNCION DE OBTENCION DE REPORTES', 
                    'SE GENERA',
                    (posicion + 1) ,
                    this.totalReportes    
                );

                if ((posicion + 1) == this.totalReportes) {
                    safix.procesos.mensajesConsola.log(
                        'ENTRA A LA FUNCION DE OBTENCION ULTIMA DE REPORTES', 
                        'SE GENERA'
                    );
                    
                    Swal.close()
                    apex.submit('CrearZip');
                }
            })
        })
    }
}

reportManager.GeneracionReportesVarios = GeneracionReportesVarios;


/**
 * @module reportManager.generarReportesFLaLuz
 * @createBy Jcardona y Jcastaño Diciembre 2022
 * @modify01By Jcardona Agosto 2023 
 * @param {Parametro de fecha inicial para la generacion de reportes desde FdeLaLuz} FechaIni 
 * @param {Parametro de fecha final para la genracion de reportes desde FdeLaLuz} FechaFin 
 * @returns =)
 */


reportManager.generarReportesFLaLuz = async (FechaIni, FechaFin) => {
    return new Promise(resolve => {
        var UltimaRespuesta; // Ultima respuesta obtenida del callback
       
        apex.server.process('Contar_registros', // Callback que devuelve todo el listado de reportes por generar
            {
                x01: FechaIni,
                x02: FechaFin

            }).then((RespuestaConteo) => {
                
                UltimaRespuesta = RespuestaConteo;

                //Alerta de confirmacion con el total de registros tomados
                safix.alertas.centrales.fire(

                    'Desea continuar?',
                    'Se realiza consulta y se encontraron ' + RespuestaConteo.Total + ' Registros'

                ).then((RespuestaAlerta) => {
                    //Cuando haya una respuesta de parte del usuario tomamos la respuesta en la variable UltimaRespuesta
                    UltimaRespuesta = RespuestaAlerta;

                    //Validamos si confirmo en la alerta
                    if (RespuestaAlerta.isConfirmed) {
                       
                        try {
                             //Avisao en Consola
                            safix.procesos.mensajesConsola.aviso('EL USUARIO ACEPTO LA IMPRESION DE ' + RespuestaConteo.Total + ' REPORTES');

                            //Alerta en pantalla para mostrar al usuario que se esta realizando el proceso
                            safix.alertas.carga('Preparando proceso');

                            //En caso de que se confirme se ejecuta la siguiente promesa
                            recorrerReportesPromise = new Promise(resolve => {
                                
                                //Ejecutamos funcion declarada en safix.procesos, que lo nos va a realizar es recorrer todas las admisiones y realizar peticiones 
                                //agrupdas al generador de reportes
                                const generacionReportesVarios = new GeneracionReportesVarios (
                                    'vhistoriame',
                                    RespuestaConteo.ListadoAdmisones,
                                    'REPFLALUZ',
                                    'userid=safix/safixdba@',
                                    RespuestaConteo.ListadoAdmisones,
                                    null,
                                    RespuestaConteo.total
                                );

                                generacionReportesVarios.generarVariosReportesAsync().then((e)=> {
                                    resolve(e)
                                });
                            })

                            main = async () => {
                                const obtenerReportes = await recorrerReportesPromise;

                                safix.procesos.mensajesConsola.log(
                                    'Respuesta de promesa de obtener reportes', 
                                    obtenerReportes                       
                                );
                                
                                const obtenerReportesVarios = new GeneracionReportesVarios (
                                    'vhistoriame',
                                    null,
                                    'REPFLALUZ',
                                    'userid=safix/safixdba@',
                                    RespuestaConteo.ListadoAdmisones,
                                    obtenerReportes,
                                    RespuestaConteo.Total
                                );
                                
                                obtenerReportesVarios.obtenerReportesVarios();
                            } 

                            main().then((e)=> {
                                resolve(e)
                            })    
                        } catch (error) {
                            safix.alertas.superiores.error(`Ha ocurrido un error en la ejecucion del reporte ${error}`);
                            safix.procesos.mensajesConsola.error(
                                `Ha ocurrido un error en la ejecucion del reporte ${error}`, 
                            );
                        }
                                            

                    }else {
                        safix.procesos.mensajesConsola.aviso('EL USUARIO DENEGO LA IMPRESION DE ' + RespuestaConteo.Total + ' REPORTES');
                    }

                })
            }
        )
    })
}