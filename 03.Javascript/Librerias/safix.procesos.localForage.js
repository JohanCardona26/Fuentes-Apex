/**
 * @Namespace procesos.localForage
 * @description proceso de guardado en en localForage
 */

const localDB = {};

safix.procesos.localForage = localDB;

safix.procesos.localForage.Offline = Offline;

class Offline {
    constructor () {
        this.nombreDB       = safix.nombreDbOffline,
        this.nuevoPendiente = JSON.parse(safix.procesos.ArmarParametrosX01()),
        this.itemsNoNulos   = JSON.parse(safix.procesos.tomarItemsNoNulos())
    };
    /**
     * @module jsonAnexar
     * @CreateBy Jcardona - Nov 16 2023
     * @param {posicion que ocupa el elemento en el local forage} posicion 
     * @returns {Json con la posicion que ocupara en el localforage y la pagina actual}
     */
    jsonAnexar (posicion) {
        return {
            'posicion':posicion,
            'pagina':paginaActual
        }
    };

    /**
     * @module agregar
     * @CreateBy Jcardona - Nov 16 2023
     * @returns {null}
     * @description Funcion para agregar elementos al local forage
     */
    agregar () {
        //Obtenemos los elementos almacenados en el localforage en la variable "pendientes"
        localforage.getItem(this.nombreDB).then(function(pendientes){
            
            let nuevaRamaLocal;
            
            // Si hay pendientes debemos de agregar el elemento o rama de la siguiente forma
            if(pendientes){
                
                // Asignamos a la rama local. 
                // 1. Json con todos los elementos de la pagina. 
                // 2. Lo que retorne la funcion del json enviandole el total de elementos que hay locales
                nuevaRamaLocal = {...this.nuevoPendiente, ...this.jsonAnexar(pendientes.length)};
                
                // Agregamos la rama al array del local forage
                pendientes.push(nuevaRamaLocal);
                
                // Lo retornamos al localforage
                localforage.setItem(this.nombreDB, pendientes);
            
                safix.procesos.mensajesConsola.aviso('[safix.pwa] agregando a pendientes..', pendientes);
            
            }
            // Si no hay pendientes debemos de agregar el elemento de la siguiente manera
            else{
                
                // Asignamos a la rama local.
                // 1. Json con todos los elementos de la pagina. 
                // 2. Lo que retorne la funcion del json enviando 0
                nuevaRamaLocal = {...this.nuevoPendiente, ...this.jsonAnexar(0)};
                
                // Debemos de agregar al local forage dentro de un array la rama local
                localforage.setItem(this.nombreDB, [nuevaRamaLocal])
                
                safix.procesos.mensajesConsola.aviso('[safix.pwa] agregando a pendientes..', nuevaRamaLocal);        
            }
        })
    };

    /**
     * @module actualizar
     * @CreateBy Jcardona - Nov 16 2023
     * @returns {null}
     * @description Funcion para agregar elementos al local forage
     */
    actualizar () {
        localforage.getItem(this.nombreDB).then(function(pendientes){
            
            let modificaPendiente = {...this.nuevoPendiente, ...this.jsonAnexar($v('P0_POSICIONPEDNIENTE'))};
    
            let posicion = pendientes.indexOf(
                pendientes.find(elemento => elemento.posicion == $v('P0_POSICIONPEDNIENTE') && elemento.pagina == paginaActual )
            );

            pendientes[posicion]  =  modificaPendiente
            
            localforage.setItem(this.nombreDB, pendientes);
        })
    };

    /**
     * @module borrar
     * @CreateBy Jcardona - Nov 16 2023
     * @returns {null}
     * @description Funcion para agregar elementos al local forage
     */
    borrar () {
        localforage.getItem(this.nombreDB).then(function(pendientes){
                
            let posicion = pendientes.indexOf(
                pendientes.find(elemento => elemento.posicion == $v('P0_POSICIONPEDNIENTE') && elemento.pagina == paginaActual )
            );

            pendientes.splice(posicion, 1);
            
            localforage.setItem(this.nombreDB, pendientes);
        })
    };

    /**
     * @module jsonAnexar
     * @CreateBy Jcardona - Nov 16 2023
     * @returns {null}
     * @description Funcion para agregar elementos al local forage
     */
    consultar () {
        localforage.getItem(this.nombreDB).then(function(pendientes){

            P0_POSICIONPEDNIENTE.value = null;

            const keys = Object.keys(this.itemsNoNulos);

            if(keys){
                let contador = 0;
                let posicion;
                let scripConsultarPosicion = `posicion = pendientes.indexOf(pendientes.find(elemento =>`

                for (const key of keys) {
                    if (key != `P0_POSICIONPEDNIENTE`){
                        if(contador == 0) {
                            scripConsultarPosicion = `${scripConsultarPosicion} elemento.${key} == ${keys[key]}`;
                        } else {
                            scripConsultarPosicion = `${scripConsultarPosicion} && elemento.${key} == ${keys[key]}`;                        
                        }
                        contador =+ 1;
                    }
                }

                scripConsultarPosicion = `${scripConsultarPosicion});`;
                
                safix.procesos.mensajesConsola.log(`Script de consultar`, scripConsultarPosicion, `posicion`, posicion);

                eval(scripConsultarPosicion);

                if (posicion){
                    let elementoEncontrado = pendientes[posicion];

                    safix.procesos.asignaciones2(elementoEncontrado);

                    P0_POSICIONPEDNIENTE.value = elementoEncontrado.posicion;

                }else{
                    safix.procesos.mensajesConsola.error(`Script de consultar`, scripConsultarPosicion, `posicion`, posicion);
                    safix.alertas.superiores.error(`El registro no fue encontrado`);
                }
            }
        })
    };
}