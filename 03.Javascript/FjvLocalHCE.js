// ULTIMO CAMBIO
/// 02 MAR 2023 MATEO PELAEZ HOLGUIN
//
class FjvLocalHCE{
    //
    constructor (numeroHistoria, nombreForma, classGrid){
        this.nombreForma = nombreForma;
        this.numeroHistoria = numeroHistoria;
        this.classGrid = classGrid;
    }
    
    //
    configLocalForage(){
        localforage.config({
            name: "BaseDatosHce",//NOMBRE DE LA BASE DE DATOS EN EL INDEXDB
            storeName: this.numeroHistoria //NOMBRE DE LA TABLA EN EL INDEXDB
        });
    };

    getDataLocal(){
        //ESTA PARTE DEL CODIGO TOMA LOS DATOS GUARDADOS EN INDEXDB Y LOS PONE DE NUEVO DONDE DEBEN IR
        //OPTIENE LA TABLA QUE ESTA EN EL INDEXDB
        localforage.getItem(this.nombreForma).then((e) => {            
            //OBTIENE EL JSON QUE TIENE TODOS LOS DATOS
            if (e){
                //SI OBTUVO EL JSON, ENTONCES
                //BUSCA TODOS LOS ELEMENTOS EN LA PAGINA CON LA CLASE gridspage Y RECORRE CADA UNO EN UN CICLO
                $(this.classGrid).each(function () {
                    debugger;
                    //SE DECLARA EL MODEL, QUE TRAE UN JSON CON LAS DIFERENTES FILAS QUE TENGA EL GRID(EN EL _DATA)
                    modeldata = apex.region(this.id).widget().interactiveGrid("getViews").grid.model._data
                    model = apex.region(this.id).widget().interactiveGrid("getViews").grid.model._changes
                    //RECORRE EL JSON QUE TIENE LOS DATOS DEL LOCALFORAGE
                    e.forEach((item) => {
                        console.log(e)
                        //VALIDA SI EL REGISTRO TIENE LA CLAVE(KEY) idig Y SI TIENE COMO VALOR LO MISMO QUE EL ID DEL GRID(EL THIS.ID SERIA EL ID DE EL INTERATIVE GRID, ESTO SE TOMA SEGUN LA CLASE gridspage)
                        if(item.idig == this.id){
                            //ESTE FOR ES EL QUE CREA LAS FILAS, LOS GRID GUARDAN LA CANTIDAD DE REGISTROS(FILAS DEL GRID) QUE LLEGARON DE LA BASE DE DATOS, ENTONCES, SI EL USUARIO CREA UNA FILA ADICIONAL
                            //VA A OCURRIR UN PROBLEMA AL RECARGAR LA PAGINA, Y ES QUE VAN A HABER MAS FILAS EN EL INDEXDB GUARDADAS QUE FILAS EN EL INTERATIVE GRID, POR TAL MOTIVO NO PODRIA IDENTIFICAR DONDE VA A RETORNAR LAS FILAS DEL INDEXDB
                            //ENTONCES AQUI SE RESTA LA CANTIDAD DE FILAS FINALES Y LAS FILAS INICIALES DE EL GRID, PARA QUE CADA VEZ QUE CARGUE LA PAGINA SE CREEN LAS FILAS CORRESPONDIENTES Y NO OCURRAN ERRORES
                            for (i=0;i<(item.filasfinales-item.filasiniciales);i++) {
                                //CREA UNA FILA EN EL INTERATIVE GRID ACTUAL
                                //prueba.push({valor : e})
                                apex.region(this.id).widget().interactiveGrid("getActions").invoke("selection-add-row");
                                //console.log(prueba)
                            }
                            
                        }
                        //VALIDA SI EL REGISTRO TIENE LA CLAVE idgrid Y SI TIENE COMO VALOR LO MISMO QUE EL ID DE EL GRIS(EL THIS.ID SERIA EL ID DE EL INTERATIVE GRID, ESTO SE TOMA SEGUN LA CLASE gridspage)
                        if(item.idgrid == this.id){
                            //console.log(item);
                            //AQUI REEMPLAZA EL MODEL DATA(LA FILA DE VALORES DEL INTERATIVE GRID) POR LOS VALORES QUE ESTABAN GUARDADOS EN EL INDEXDB
                            //console.log(this.id + ' = '+item.idgrid)
                            /*for (i=0;i<model.length;i++){
                                if(model[i].index == item.id){
                                    model[i].record = item.datos
                                    console.log(model[i])
                                }
                            }
                            modeldata[item.id] = item.datos;*/
                        }//else{
                            // apex.item(item.id).setValue(item.valor);
                        //}
                    });
                    //AQUI SE REFRESCA CADA INTERATIVE GRID PARA QUE MUESTRE LOS VALORES QUE LE DIMOS ANTERIORMENTE
                    apex.region(this.id).widget().interactiveGrid("getViews").grid.refresh()
                });
                //DE NUEVO RECORRE CADA ITEM DE EL JSON, PERO, EN ESTA OCACION SOLO VA A TOMAR LOS VALORES QUE VAN A IR EN LOS ITEMS
                e.forEach((item) => {
                    //VALIDA SI EL ARREGLO QUE ESTA TOMANDO NO TENGA EL LA CLAVE idgrid (EN RESUMEN VALIDA QUE NO TOME ELEMENTOS QUE PERTENESCAN A ALGUN GRID) Y QUE NO TENGA LA CLAVE idig
                    if(!item.idgrid && !item.idig){
                        //LE DEVUELVE EL VALOR CORRESPONDIENTE A EL ITEM
                        apex.item(item.id).setValue(item.valor);
                    }
                });
            }
        });
    }

    Respaldo(nombreForma){
        //TOMA EL NUMERO DE LA PAGINA EN LA QUE SE LLAME ESTA FUNCION
        let current_page = $('#pFlowStepId').val();
        //DECLARA EL RECUPERAR(ESTE ES UNA VARIBLE TIPO ARRAY QUE GUARDARA LOS VALORES EN FORMATO CLAVE VALOR)
        let recuperar = [];
        //
        /*if (model.length != 0){
            recuperar.push({
                            id : model[i].index,
                            datos : model[i].record});
            for (i=0;i<model.length;i++) {
                modeldata[model[i].index] = model[i].record}
            for (i=0;i<modeldata.length;i++) {
                recuperar.push({
            id : i,
            datos : modeldata[i]});

            }
        }else{
            for (i=0;i<modeldata.length;i++) {
            recuperar.push({
                            id : i,
                            datos : modeldata[i]});
            }
        }*/
        //VALIDA SI ALGUNA REGION CUENTA CON LA CLASE gridspage(ESTA CLASE SE LE DEBE DAR A CADA GRID PARA QUE FUNCIONE LA SUBIDA DE DATOS A EL INDEX DB)
        if($(".gridspage")){
            //RECORRE TODAS LAS REGIONES CON LA CLASE gridspage
            $(".gridspage").each(function () {
                //alert('')
                //INICIA EL MODEL, ESTE MODEL TENDRA DENTRO EL JSON CON LOS CAMBIOS QUE SE REALIZARON EN EL GRID
                model = apex.region(this.id).widget().interactiveGrid("getViews").grid.model._changes;
                //INICIA EL MODELDATA, ESTE MODEL TENDRA DENTRO EL JSON CON LOS DATOS INICIALES DE EL INTERATIVE GRID
                modeldata = apex.region(this.id).widget().interactiveGrid("getViews").grid.model._data
                //OPTIENE EN ESTE EN LA VARIBLE EL NUMERO DEM FILA QUE SE CREARON AL ENTRAR POR PRIMERA VEZ A LA PAGINA, ESTAS FILAS SE CREAN SEGUN EL QUERY QUE TENGA EL INTERITIVE GRID
                gridfilasiniciales = apex.region(this.id).widget().interactiveGrid("getViews").grid.model._totalRecords;
                //POR CADA INTERATIVE GRID INGRESA UN REGISTRO EN LA VARIBLE recuperar, ESTE REGISTRO VA A TENER EL ID DE EL INTERATIVE GRID, LAS FILAS INCIALES Y ALS FIALS FINALES 
                recuperar.push({
                    idig : this.id, filasiniciales : gridfilasiniciales, filasfinales : modeldata.length
                });
                //VALIDA SI SE HICIERON CAMBIOS EN EL INTERATIVE GRID
                //console.log('1')
                if (model.length != 0){
                    //console.log('existe cambio')
                    //RECORRE CADA ELEMENTO DE EL JSON CON CAMBIOS
                    //console.log('2')
                    //console.log(model.length)
                    for (i=0;i<model.length;i++) {
                        //console.log(i + ' registro del model' )
                        //RECORRE POR CADA DATO
                        //console.log('3')
                        //console.log(model)
                        for (j=0;j<model[i].record.length;j++) {
                            //console.log(i + 'record')
                            //VALIDA SI EL DATO NO ES VACIO
                            //console.log('4')
                            //console.log(model[i].record)

                            if (model[i].record[j].length === undefined){
                                //console.log('5')
                                //console.log(model[i].record[j].length)
                                //console.log('valor de record posicion ' + j + ' es '+model[i].record[j])
                                //VALIDA SI EL DATO QUE SE MODIFICO ES DISTINTO A EL DATO ACTUAL
                                if(model[i].record[j]['v'] !== undefined){
                                    if(model[i].original){
                                            console.log('------------------------------------------------------------------------')
                                        if (model[i].record[j]['v'] != modeldata[model[i].index][j]['v']){
                                            console.log('se va a cambiar '+ model[i].record[j]['v'] + ' por ' + modeldata[model[i].index][j]['v'])
                                            //REEMPLAZA EL DATO MODIFICADO POR EL DATO ACTUAL
                                            console.log('6')
                                            //console.log(model[i].record[j])
                                            modeldata[model[i].index][j] = model[i].record[j]
                                        }
                                    }
                                }
                            }else{
                                if (model[i].record[j].length > 0){
                                    /*console.log('5')
                                    console.log(model[i].record[j].length)
                                    //console.log('valor de record posicion ' + j + ' es '+model[i].record[j])
                                    //VALIDA SI EL DATO QUE SE MODIFICO ES DISTINTO A EL DATO ACTUAL
                                    if(model[i].record[j]['v'] !== undefined){
                                        console.log('6')
                                        if (model[i].record[j]['v'] != modeldata[model[i].index][j]){
                                        console.log('6')
                                        //console.log('se va a cambiar '+ model[i].record[j] + ' por ' + modeldata[model[i].index][j])
                                        //REEMPLAZA EL DATO MODIFICADO POR EL DATO ACTUAL
                                            modeldata[model[i].index][j] = model[i].record[j]['v']
                                        }
                                    }*/
                                
                                    if (model[i].record[j] != modeldata[model[i].index][j]){
                                        console.log('entro aqui')

                                        //console.log('se va a cambiar '+ model[i].record[j] + ' por ' + modeldata[model[i].index][j])
                                        //REEMPLAZA EL DATO MODIFICADO POR EL DATO ACTUAL
                                        
                                        
                                        modeldata[model[i].index][j] = model[i].record[j]
                                    }
                                }   
                            }
                        }
                    }
                }
                //RECORRE CADA FILA DE EL GRID ACTUAL
                for (i=0;i<modeldata.length;i++) {
                    //console.log(modeldata[i])
                    //LE INGRESA A EL ARREGLO recuperar UN ARREGLO CON IDGRID, ID Y UN ARREGLO ANIDADO CON LOS DATOS DE LA FILA CORRESPONDIENTE
                    recuperar.push({
                                        idgrid : this.id, //ID ESTATICO DE EL INTERATIVE GRID
                                        id : i, //POSICION DE LA FILA EN LA TABLA
                                        datos : modeldata[i] //DATOS DE LA FILA
                                    });
                }
            });
        }
        //VALIDA SI ES UN ITEM TIPO INPUT, QUE NO ESTE VACIO, QUE NO SEHA DE TIPO 'radio', 
        //QUE NO TENGA LA CLASE 'a-Toolbar-input' Y QUE EL ID CONTENGA EN SU NOMBRE 'P338'.
        $("input").each(function () {
        if (
        this.id &&
        this.value &&
        this.type != "radio" &&
        !$(this).hasClass("a-Toolbar-input") &&
        this.id.match('P'+current_page)
        ) {
                //INGRESA A EL OBJETO RECUPERAR LOS DATOS EN FORMATO 'LLAVE' -> 'VALOR', AÑADIENDO ASI TODOS LOS INPUT A EL OBJETO
                recuperar.push({
                    id: this.id,
                    valor: apex.item(this.id).getValue(),
                });
        }
    });
        //VALIDA SI ES UN ITEM TIPO SELECT, QUE NO TENGA LA CLASE 'a-Toolbar-item',
        //QUE NO TENGA LA CLASE 'js-tabbable' Y QUE EL ID CONTENGA EN SU NOMBRE 'P338'.
    $("select").each(function () {
        if (
        !$(this).hasClass("a-Toolbar-item") &&
        !$(this).hasClass("js-tabbable") &&
        this.id.match('P'+current_page)
        ) {
        //VALIDA SI HAY ALGUN VALOR EN EL ITEM
        if (apex.item(this.id).getValue()) {
            //INGRESA A EL OBJETO RECUPERAR LOS DATOS EN FORMATO 'LLAVE' -> 'VALOR', AÑADIENDO ASI TODOS LOS SELECT A EL OBJETO
            recuperar.push({
                    id: this.id,
                    valor: apex.item(this.id).getValue(),
                });
        }
        }
    }); 
    //VALIDA SI ES UN ITEM CON CLASE RADIO-GROUP, QUE NO ESTE VACIO, QUE EL ID CONTENGA EN SU NOMBRE 'P338'.
    $(".radio_group").each(function () {
        if (this.id && apex.item(this.id).getValue() && this.id.match('P'+current_page)) {
        //INGRESA A EL OBJETO RECUPERAR LOS DATOS EN FORMATO 'LLAVE' -> 'VALOR', AÑADIENDO ASI TODOS LOS RADIO BUTTONS A EL OBJETO
        recuperar.push({
            id: this.id,
            valor: apex.item(this.id).getValue(),
        });
        }
    });
    //VALIDA SI ES UN ITEM TIPO TEXTAREA, QUE NO ESTE VACIO, QUE EL ID CONTENGA EN SU NOMBRE 'P338'.
    $("textarea").each(function () {
        if (this.id && apex.item(this.id).getValue() && this.id.match('P'+current_page)) {
        //INGRESA A EL OBJETO RECUPERAR LOS DATOS EN FORMATO 'LLAVE' -> 'VALOR', AÑADIENDO ASI TODOS LOS TEXTAREA A EL OBJETO
        recuperar.push({
            id: this.id,
            valor: apex.item(this.id).getValue(),
        });
        }
    });
    //INSERTA EL OBJETO 'recuperar' QUE LLEVA DENTRO LOS ITEMS DE LA PAGINA EN LA RESPECTIVA BASE DE DATOS INDEXDB QUE SE CONFIGURO PARA ESTE EL USUARIO CONECTADO
    setTimeout(function () {
            localforage.setItem(nombreForma, recuperar);
    }, 1000);
    }

    events(){
       //EN ESTA PARTE SE DECLARAN LOS DIFERENTE EVENTOS QUE IRAN DESENCADENANDO LOS DIFERENTES ELEMENTOS EN LA PAGINA
        //SI UN INPUT CAMBIA, ENTONCES EJECUTA EL PROCEDIMIENTO QUE SUBE LOS DATOS EN EL INDEXDB
        $("input").change(() => { 
            var fjvLocalHCE = new FjvLocalHCE(this.numeroHistoria, this.nombreForma, this.classGrid);
            fjvLocalHCE.Respaldo(this.nombreForma);
        });
        //SI UN SE OPRIME UNA TECLA EN UN CAMPO INPUT, ENTONCES EJECUTA EL PROCEDIMIENTO QUE SUBE LOS DATOS EN EL INDEXDB
        $("input").keyup(() => {
                var fjvLocalHCE = new FjvLocalHCE(this.numeroHistoria, this.nombreForma, this.classGrid);
            fjvLocalHCE.Respaldo(this.nombreForma);
        });
        //SI UN SELECT CAMBIA, ENTONCES EJECUTA EL PROCEDIMIENTO QUE SUBE LOS DATOS EN EL INDEXDB
        $("select").change(() => {
                var fjvLocalHCE = new FjvLocalHCE(this.numeroHistoria, this.nombreForma, this.classGrid);
            fjvLocalHCE.Respaldo(this.nombreForma);
        });
        //SI UN SE OPRIME UNA TECLA EN UN CAMPO SELECT, ENTONCES EJECUTA EL PROCEDIMIENTO QUE SUBE LOS DATOS EN EL INDEXDB
        $("select").click(() => {
                var fjvLocalHCE = new FjvLocalHCE(this.numeroHistoria, this.nombreForma, this.classGrid);
            fjvLocalHCE.Respaldo(this.nombreForma);
        });
        //SI UN ITEM CON LA CLASE RADIO-GROUP CAMBIA, ENTONCES EJECUTA EL PROCEDIMIENTO QUE SUBE LOS DATOS EN EL INDEXDB
        $(".radio_group").change(() => {
                var fjvLocalHCE = new FjvLocalHCE(this.numeroHistoria, this.nombreForma, this.classGrid);
            fjvLocalHCE.Respaldo(this.nombreForma);
        });
        //SI UN ITEM CON LA CLASE RADIO-GROUP LE DAS CLICK, ENTONCES EJECUTA EL PROCEDIMIENTO QUE SUBE LOS DATOS EN EL INDEXDB
        $(".radio_group").click(() => {
                var fjvLocalHCE = new FjvLocalHCE(this.numeroHistoria, this.nombreForma, this.classGrid);
            fjvLocalHCE.Respaldo(this.nombreForma);
        });
        //SI UN ITEM TIPO TEXTAREA CAMBIA, ENTONCES EJECUTA EL PROCEDIMIENTO QUE SUBE LOS DATOS EN EL INDEXDB
        $("textarea").change(() => {
                var fjvLocalHCE = new FjvLocalHCE(this.numeroHistoria, this.nombreForma, this.classGrid);
            fjvLocalHCE.Respaldo(this.nombreForma);
        });
        //SI UN SE OPRIME UNA TECLA EN UN CAMPO TEXTAREA, ENTONCES EJECUTA EL PROCEDIMIENTO QUE SUBE LOS DATOS EN EL INDEXDB
        $("textarea").keyup(() => {
                var fjvLocalHCE = new FjvLocalHCE(this.numeroHistoria, this.nombreForma, this.classGrid);
            fjvLocalHCE.Respaldo(this.nombreForma);
        });
        /*$(".textarea").change(() => {
                var fjvLocalHCE = new FjvLocalHCE(this.numeroHistoria, this.nombreForma, this.classGrid);
            fjvLocalHCE.Respaldo(this.nombreForma);
        });
        //SI UN SE OPRIME UNA TECLA EN UN CAMPO TEXTAREA, ENTONCES EJECUTA EL PROCEDIMIENTO QUE SUBE LOS DATOS EN EL INDEXDB
        $(".textarea").keyup(() => {
                var fjvLocalHCE = new FjvLocalHCE(this.numeroHistoria, this.nombreForma, this.classGrid);
            fjvLocalHCE.Respaldo(this.nombreForma);
        });*/
        //SI UN DATEPICKER CAMBIA USANDO EL MAUSE PARA ESCOJER LA FECHA, ENTONCES EJECUTA EL PROCEDIMIENTO QUE SUBE LOS DATOS EN EL INDEXDB
        $(".apex-item-datepicker-jet").change(() => {
                var fjvLocalHCE = new FjvLocalHCE(this.numeroHistoria, this.nombreForma, this.classGrid);
            fjvLocalHCE.Respaldo(this.nombreForma);
        });
        //AQUI DEBERIA IR LOS EVENTOS PARA LOS GRIDS, AUN NO ESTA LISTO
        /*
        $(".gridspage").change(() => {
                var fjvLocalHCE = new FjvLocalHCE(this.numeroHistoria, this.nombreForma, this.classGrid);
            fjvLocalHCE.Respaldo(this.nombreForma);
                //console.log('cambi algo ')
        });

        $(".gridspage").keyup(() => {
                var fjvLocalHCE = new FjvLocalHCE(this.numeroHistoria, this.nombreForma, this.classGrid);
            fjvLocalHCE.Respaldo(this.nombreForma);
                //console.log('se presiono tecla')
        });*/
    }
}

