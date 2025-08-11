//FUNCION PARA USAR EL LOCALFORAGE, SE DEBE LLAMAR EN 'Execute when Page Loads' EN CADA PAGINA, SE INGRESA EL NUMERO DE LA HISTORIA Y EL NOMBRE DE LA FORMA
var nombrePag;
var object;
const bdIndex = "BaseDatosHce";


function fjvLocalSaveDate(numeroHistoria, nombreForma) {

    nombrePag = nombreForma; 

    //SE CONFIGURA EL LA BASE DE DATOS INDEXDB
   

    //var historia = localforage.createInstance({
    // name        : bdIndex,
    // storeName   : numeroHistoria,
    // description : 'Almacén de las historias clínicas'
    //});

     localforage.config({
        name: "BaseDatosHce",//NOMBRE DE LA BASE DE DATOS EN EL INDEXDB
        storeName: numeroHistoria //NOMBRE DE LA TABLA EN EL INDEXDB
    });


    //ESTA PARTE TOMA EL JSON QUE ESTA EN EL REGISTRO Y LOS DEVUELVE DE NUEVO A SU RESPECTIVO ITEM
    //OPTIENE LA TABLA QUE ESTA EN EL INDEXDB

    localforage.getItem(nombreForma).then((e) => {
        //OBTIENE EL JSON QUE TIENE TODOS LOS DATOS
        if (e) {
            //SI OBTUVO EL JSON, ENTONCES
            //RECORRE CADA ELEMENTO DE EL JSON
            e.forEach((item) => {
                //VALIDA SI EL ARREGLO QUE ESTA TOMANDO NO TENGA LA CLAVE idgrid (EN RESUMEN VALIDA QUE NO TOME ELEMENTOS QUE PERTENESCAN A ALGUN GRID) Y QUE NO TENGA LA CLAVE idig
                if (!item.idgrid && !item.idig) {
                    //LE DEVUELVE EL VALOR CORRESPONDIENTE A EL ITEM
                    apex.item(item.id).setValue(item.valor);

                }
            });
        }

    });

     //DETECTAR CAMBIOS EN LOS GRIDS
     $(".a-GV-columnItem input, .a-GV-columnItem textarea").change(async (elemento) => {

        let idGrid;

        $(`.t-IRR-region`).each((i, e) => {
            apex.region(e.id).widget().interactiveGrid(`getViews`, `grid`).getColumns().forEach((el) => {
                if (el.elementId === elemento.target.id) {
                idGrid = e.id;
                }
            });
        });

        console.log(idGrid);
        await recover_modules.save_grid(idGrid)

    });


    //EN ESTA PARTE SE DECLARAN LOS DIFERENTE EVENTOS LOS DIFERENTES ITEMS QUE HAY EN LA PAGINA Y QUE EL USUARIO PODRA INTERATUAL CON ELLOS(PODRA MODIFICARLO)
    //SI UN INPUT CAMBIA, ENTONCES EJECUTA EL PROCEDIMIENTO QUE SUBE LOS DATOS EN EL INDEXDB
    $("input").change(() => {
        Respaldo(nombreForma);
    });
    //SI SE OPRIME UNA TECLA EN UN CAMPO INPUT, ENTONCES EJECUTA EL PROCEDIMIENTO QUE SUBE LOS DATOS EN EL INDEXDB
    $("input").keyup(() => {
        Respaldo(nombreForma);
    });
    //SI UN SELECT CAMBIA, ENTONCES EJECUTA EL PROCEDIMIENTO QUE SUBE LOS DATOS EN EL INDEXDB
    $("select").change(() => {
        $("select").focusout()
        Respaldo(nombreForma);
    });
    //SI SE OPRIME UNA TECLA EN UN CAMPO SELECT, ENTONCES EJECUTA EL PROCEDIMIENTO QUE SUBE LOS DATOS EN EL INDEXDB
    $("select").click(() => {
        Respaldo(nombreForma);
    });
    //SI UN ITEM CON LA CLASE RADIO-GROUP CAMBIA, ENTONCES EJECUTA EL PROCEDIMIENTO QUE SUBE LOS DATOS EN EL INDEXDB
    $(".radio_group").change(() => {
        $(".radio_group").focusout()
        Respaldo(nombreForma);
    });
    //SI UN ITEM CON LA CLASE RADIO-GROUP LE DAS CLICK, ENTONCES EJECUTA EL PROCEDIMIENTO QUE SUBE LOS DATOS EN EL INDEXDB
    $(".radio_group").click(() => {
        Respaldo(nombreForma);
    });
    //SI UN ITEM TIPO TEXTAREA CAMBIA, ENTONCES EJECUTA EL PROCEDIMIENTO QUE SUBE LOS DATOS EN EL INDEXDB
    $("textarea").change(() => {
        Respaldo(nombreForma);
    });
    //SI SE OPRIME UNA TECLA EN UN CAMPO TEXTAREA, ENTONCES EJECUTA EL PROCEDIMIENTO QUE SUBE LOS DATOS EN EL INDEXDB
    $("textarea").keyup(() => {
        Respaldo(nombreForma);
    });
    //SI UN DATEPICKER CAMBIA USANDO EL MOUSE PARA ESCOJER LA FECHA, ENTONCES EJECUTA EL PROCEDIMIENTO QUE SUBE LOS DATOS EN EL INDEXDB
    $(".apex-item-datepicker-jet").change(() => {
        $(".apex-item-datepicker-jet").focusout()
        Respaldo(nombreForma);
    });

    //SE TOMAN LOS GRID QUE HAYAN EN LA PÁGINA

    // if ($(".gridspage")) {
    //     //RECORRE TODAS LAS REGIONES CON LA CLASE gridspage
    //     $(".gridspage").each(function () {
    //         //debugger;
    //         recover_modules.load_grid(this.id); //SE CARGA LA INFORMACIÓN DEL GRID DEL LOCALFORAGE AL GRID
    //     });
    // }
}

//FUNCION QUE SE ENCARGA DE SUBIR LOS DATOS DE CADA ITEM A LA BASE DE DATOS EN EL INDEXDB, TAMBIEN SUBE LOS DATOS DE LOS GRIDS AL LOCALFORAGE
function Respaldo(nombreForma) {
    //TOMA EL NUMERO DE LA PAGINA EN LA QUE SE LLAME ESTA FUNCION
    let current_page = $('#pFlowStepId').val();
    //DECLARA EL RECUPERAR(ESTE ES UNA VARIBLE TIPO ARRAY QUE GUARDARA LOS VALORES EN FORMATO CLAVE VALOR)
    let recuperar = [];
    //EN ESTA PARTE DEL CODIGO SE AÑADE LOS DATOS DE LOS INTERATIVE GRID A LA VARIABLE RECUPERAR
    //VALIDA SI EXISTE ALGUNA REGION CON CLASE gridspage, ESTA CLASE SE LE DA SOLO A LOS GRIDS Y ES NECESARIO DARCELA PARA QUE FUNCIONE LA SUBIDA DE SUS REGISTROS AL INDEXDB

    //VALIDA SI ES UN ITEM TIPO INPUT, QUE NO ESTE VACIO, QUE NO FUESE DE TIPO 'radio', 
    //QUE NO TENGA LA CLASE 'a-Toolbar-input' Y QUE EL ID CONTENGA EN SU NOMBRE 'P338'.
    $("input").each(function () {
        if (
            this.id &&
            this.value &&
            this.type != "radio" &&
            !$(this).hasClass("a-Toolbar-input") &&
            this.id.match('P' + current_page)
        ) {
            //INGRESA A EL OBJETO RECUPERAR LOS DATOS EN FORMATO 'LLAVE' -> 'VALOR', AÑADIENDO ASI TODOS LOS INPUT A EL OBJETO
            recuperar.push({
                id: this.id,
                valor: apex.item(this.id).getValue()
            });
        }
        
    });
    //VALIDA SI ES UN ITEM TIPO SELECT, QUE NO TENGA LA CLASE 'a-Toolbar-item',
    //QUE NO TENGA LA CLASE 'js-tabbable' Y QUE EL ID CONTENGA EN SU NOMBRE 'P338'.
    $("select").each(function () {
        if (
            !$(this).hasClass("a-Toolbar-item") &&
            !$(this).hasClass("js-tabbable") &&
            this.id.match('P' + current_page)
        ) {
            //VALIDA SI HAY ALGUN VALOR EN EL ITEM
            if (apex.item(this.id).getValue()) {
                //INGRESA A EL OBJETO RECUPERAR LOS DATOS EN FORMATO 'LLAVE' -> 'VALOR', AÑADIENDO ASI TODOS LOS SELECT A EL OBJETO
                recuperar.push({
                    id: this.id,
                    valor: apex.item(this.id).getValue()
                });
            }
        }
    });
    //VALIDA SI ES UN ITEM CON CLASE RADIO-GROUP, QUE NO ESTE VACIO, QUE EL ID CONTENGA EN SU NOMBRE 'P338'.
    $(".radio_group").each(function () {
        if (this.id && apex.item(this.id).getValue() && this.id.match('P' + current_page)) {
            //INGRESA A EL OBJETO RECUPERAR LOS DATOS EN FORMATO 'LLAVE' -> 'VALOR', AÑADIENDO ASI TODOS LOS RADIO BUTTONS A EL OBJETO
            recuperar.push({
                id: this.id,
                valor: apex.item(this.id).getValue()
            });
        }
    });
    //VALIDA SI ES UN ITEM TIPO TEXTAREA, QUE NO ESTE VACIO, QUE EL ID CONTENGA EN SU NOMBRE 'P338'.
    $("textarea").each(function () {
        if (this.id && apex.item(this.id).getValue() && this.id.match('P' + current_page)) {
            //INGRESA A EL OBJETO RECUPERAR LOS DATOS EN FORMATO 'LLAVE' -> 'VALOR', AÑADIENDO ASI TODOS LOS TEXTAREA A EL OBJETO
            recuperar.push({
                id: this.id,
                valor: apex.item(this.id).getValue()
            });
        }
    });
    //INSERTA EL OBJETO 'recuperar' QUE LLEVA DENTRO LOS ITEMS DE LA PAGINA EN LA RESPECTIVA BASE DE DATOS INDEXDB QUE SE CONFIGURO PARA ESTE EL USUARIO CONECTADO
    setTimeout(function () {
        localforage.setItem(nombreForma, recuperar)
    }, 200);
}


// ULTIMO CAMBIO
/// 2023 MATEO PELAEZ HOLGUIN
// 