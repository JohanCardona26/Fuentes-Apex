// function test_ia(id){
//     console.log($("#" + id).val())
// }

function fjvValidacionItemsObs(oBservacion){
    //IDENTIFICA EL CAMPO EN EL QUE VA A ESCRIBIR Y EMPIEZA A ACTUAR EL EVENTO KEYDOWN(DESENCADENA ALGO CUANDO SE PRESIONE UNA TECLA EN ESE ITEM)
    $("#" + oBservacion).keydown(function(event){
        //SI PRESIONA LA TECLA SHITF O LA TECLA 187(SE IDENTIFICA MEDIANTE KEYCODE) NO MUESTRA NADA
        if ((event.shiftKey || event.which == 187)
        ){
            //ESTE RETURN FALSE HACE QUE LA TECLA PRESIONADA NO SE VEA REFLEJADA EN EL CAMPO, EN RESUMEN QUE NO ESCRIBA NADA
            return false;
        }else{
            //LAS TECLAS QUE DECLAREMOS EN ESTA SENTENCIA NO SERAN ACEPTADAS EN EL CAMPO Y NO LAS VEREMOS REFLEJADAS CUANDO PRESIONEMOS UNA TECLA
            if  ( event.which == 188
                || event.which == 189
                || event.which == 107
                || event.which == 187
                || event.which == 220
                || event.which == 172
                || event.which == 190
                || event.which == 109
                || event.which == 111
                || event.which == 221
                || event.which == 219
                || event.which == 186
                || event.which == 106
                || event.which == 226
                || event.which == 222
                || event.which == 191
                || event.which == 192
                ){
                    //SI ES UNA TECLA DISTINTA A LAS DECLARADAS EN LA SENTENCIA IF, HACE QUE LA TECLA PRESIONADA SE VEA REFLEJADA EN EL CAMPO.
                return false;
            }
        }
    });
}

