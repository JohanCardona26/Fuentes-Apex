//CON ESTA FUNCION SE BLOQUEAN TECLAS, EN ESTE CASO ESTAN HABILITADAS LAS TECLAS NUMERICAS, EL SIMBOLO / Y EL SHIFT+7
function fjvValidacionItemsDate(){
    //IDENTIFICA EL TIPO DE ITEM EN EL QUE VA A ESCRIBIR Y EMPIEZA A ACTUAR EL EVENTO KEYDOWN(DESENCADENA ALGO CUANDO SE PRESIONE UNA TECLA EN ESE ITEM)
    $('.apex-item-datepicker-jet').keydown(function(event){
        //SI PRESIONA LA TECLA SHITF MAS CUALQUIER TECLA QUE NO SEHA LA TECLA 55(SE IDENTIFICA MEDIANTE KEYCODE) O LA TECLA CTRL MAS LA TECLA 86, NO MUESTRA NADA
        if ((event.shiftKey && event.which !== 55)||(event.ctrlKey && event.which == 86)){
            //ESTE RETURN FALSE HACE QUE LA TECLA PRESIONADA NO SE VEA REFLEJADA EN EL CAMPO, EN RESUMEN QUE NO ESCRIBA NADA
            return false;
        }else{
            if
                //LAS TECLAS QUE DECLAREMOS EN ESTA SENTENCIA SERAN LAS ACEPTADAS EN EL CAMPO Y LAS VEREMOS REFLEJADAS CUANDO PRESIONEMOS UNA TECLA
                ((event.which < 48 || event.which > 57) 
                && (event.which < 96 || event.which > 105)  
                && event.which !== 8 
                && event.which !== 9
                && event.which !== 13
                && event.which !== 111
                && event.which !== 193
                && event.which !== 109  
                && event.which !== 189
                && event.which !== 37
                && event.which !== 39
                && event.which !== 116){
                    //ESTE RETURN FALSE HACE QUE LA TECLA PRESIONADA NO SE VEA REFLEJADA EN EL CAMPO, EN RESUMEN QUE NO ESCRIBA NADA
                return false;
            }
        }
    });
}
//EL KEYCODE SE PUEDE IDENTIFICAR EN https://www.toptal.com/developers/keycode
//
/// 16 FEB 2023 MATEO PELAEZ HOLGUIN
//