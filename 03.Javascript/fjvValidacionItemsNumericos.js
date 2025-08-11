//CON ESTA FUNCION SE BLOQUEAN TECLAS, EN ESTE CASO ESTAN HABILITADAS SOLO LAS TECLAS NUMERICAS
function fjvValidacionItemsNumericos(){
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
//