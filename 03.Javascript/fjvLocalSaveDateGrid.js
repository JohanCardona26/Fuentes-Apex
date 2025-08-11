//ESTA FUNCION SIRVE PARA ELIMINAR/CREAR UNA COLECCION CON LOS DATOS QUE ESTEN EN EL LOCALFORAGE, SE LLAMA ENVIANDOLE EL NOMBRE DE LA PAGINA, !PERO¡, NO FUNCIONA OFFLINE
function fjvLocalSaveDateGrid(nombreForma){
    //RECUPERA LOS REGISTROS QUE HAY EN EL LOCALFORAGE PARA LA PAGINA ACTUAL
    localforage.getItem(nombreForma).then((e) => {
        //OBTIENE EL JSON QUE TIENE TODOS REGISTROS
        if (e){
            //SI OBTUVO EL JSON, ENTONCES
            //BUSCA TODOS LOS ELEMENTOS EN LA PAGINA CON LA CLASE gridspage Y RECORRE CADA UNO
            $(".gridspage").each(function () {
                //DECLARA EL ARREGLO JSONGRID
                let jsongrid = []
                //ESTE ARREGLO SE USARA PARA ESPECIFICAR LAS COLUMNAS QUE TENDRA LA COLECCION 
                let columnasini = "";
                //RECORRE LOS DIFERENTES ITEMS QUE HAY EN EL JSON
                e.forEach((item) => {
                    //VALIDA SI EXISTE UN ITEM QUE CONTENGA EL ELEMENTO idgrid
                    if(item.idgrid){
                        //SI LO CONTIENE, VALIDA SI EL ITEM.IDGRID CONTIENE UN VALOR IGUAL A EL ID DEL INTERATIVE GRID ACTUAL
                        if(item.idgrid == this.id){
                            //SI SON IGUALES, ENTONCES DEL ELEMENTO DATOS QUE ESTA EN ITEM LE ELIMINA EL ULTIMO ELEMENTO DE DATOS
                            item.datos.pop()
                            //RECORRE EL UNO POR UNO LOS ELEMENTO QUE ESTAN DENTRO DE DATOS
                            for (j=0;j<item.datos.length;j++) {
                                //VALIDA SI EL ELEMENTO EN LA POSICION J ES IGUAL A UNDEFINED(VALIDA SI ES UN ARREGLO) 
                                if (item.datos[j].length === undefined){
                                    //SI ES IGUAL, ENTONCES, VALIDA SI ESE ARREGLO TIENE EL ELEMENTO DE NOMBRE V
                                    if(item.datos[j]['v'] !== undefined){
                                        //SI EXISTE, ENTONCES, REEMPLAZA ESE ARREGLO CON UN CARATER QUE SERIA EL VALOR QUE TIENE V(EL ELEMENTO DEJA DE SER ARREGLO Y SE VUELVE UN CARACTER)
                                        item.datos[j] = item.datos[j]['v'];
                                    }
                                }
                            }
                            //CAMBIA EL DATOS EN LA POSICION 0 EN EL ITEM ACTUAL, LO CAMBIA POR UN ID ALEATORIO CON EL FIN DE QUE SE REPITAN LOS ID DE LAS FILAS
                            item.datos[0] = fjvCrearIdRandom(11)
                            //INGRESA EN EL ARREGLO JSONGRID LOS DIFERENTES DATOS, CADA UNO ES UN ARREGLO
                            jsongrid.push(item.datos)
                        }
                    }
                });
                //ESTA VARIABLE TOMARA EL ID DE LA REGION, EN ESTE CASO EL INTERATIVE GRID ACTUAL
                estegrid = this.id
                //VALIDA SI EL ARREGLO JSONGRID NO ESTA VACIO
                if(jsongrid != ''){
                    //RECORRE LOS DATOS QUE HAY EL ARREGLO JSONGRID EN LA PASICION 1(RECORRE LAS COLUMNAS QUE TENDRA LA COLECCION)
                    for (i=0;i<jsongrid[0].length;i++) {
                        //LA SIGUIENTE PARTE DEL CODIGO ES LA ENCARGADA DE DARLE LAS COLUMNAS QUE TENDRA LA COLECCION
                        //VALIDA SI LAS COLUMNAS EN ESTE GRID SON MAS O IGUALES A 10
                        if(i >= '10'){
                            //AÑADE UNA COLUMNA CUANDO ES MAYOR A 10("c011 path coma$[10]coma,")
                            columnasini = columnasini + " c0"+(i+1)+" path coma$["+i+"]coma,";    
                        }else{
                            //AÑADE UNA COLUMNA, MIENTRAS NO ESTE VACIO EL COLUMNID
                            if(columnasini != ''){
                                columnasini = columnasini + " c00"+(i+1)+" path coma$["+i+"]coma,";    
                            }else{
                                columnasini = "c00"+(i+1)+" path coma$["+i+"]coma,";    
                            }
                        } 
                    }
                    //.SLICE(0,-1), ESTA FUNCION NOS SIRVE PARA ELIMINAR EL ULTIMO CARATER UNA DE UNA CADENA DE CARACTERES, EN ESTE CASO ELIMINA UNA (,) QUE ESTA AL FINAL DE LA CADENA DE CARATERES EN COLUMNASINI
                    columnasini = columnasini.slice(0,-1);
                    //ESTE CODIGO SIRVE PARA EJECUTAR UN AJAXCALLBACK DESDE JS
                    apex.server.process('GRIDTRAE', 
                        { 
                            //LE ENVIA LOS SIGUIENTES PARAMETROS COMO VARIABLES QUE SE PODRAN USAR EN PL/SQL
                            x01: JSON.stringify(jsongrid),//LE DA LA ESTRUCTURA JSON A EL ARREGLO JSONGRID
                            x02: columnasini,//LE ENVIA LA CADENA DE CARACTERES QUE CONTIENE LAS COLUMNAS QUE TENDRA LA COLECCION
                            x03: estegrid.toUpperCase()//LE ENVIA EL ID DEL INTERATIVE GRID
                        },
                        {
                            success: function(resultado){
                                console.log(resultado.text)
                            },
                            error: function(e){
                                console.log('Error: ' + JSON.stringify(e));
                            }
                        }
                    )
                }else{ 
                    //ESTA PARTE NO ES FUNCIONAL PERO LA IDEA ES QUE NO GUARDE LOS GRIDS QUE ESTEN EN BLANCO
                    let arregloprueba = 'B';
                    apex.server.process('GRIDTRAE', 
                        { 
                            //LE ENVIA LOS SIGUIENTES PARAMETROS COMO VARIABLES QUE SE PODRAN USAR EN PL
                            x01: arregloprueba,//LE DA LA ESTRUCTURA JSON A EL ARREGLO JSONGRID
                            x02: estegrid.toUpperCase()//LE ENVIA EL ID DEL INTERATIVE GRID
                        },
                        {
                            success: function(resultado){
                                console.log(resultado.text)
                            },
                            error: function(e){
                                console.log('Error: ' + JSON.stringify(e));
                            }
                        }
                    )
                }
            });
        }
    });
    console.clear()
}
//
/// 2023 MATEO PELAEZ HOLGUIN
//