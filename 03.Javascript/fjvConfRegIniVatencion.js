//CONFIGURA QUE REGION SE MOSTRARA, ESTO SE CONFIGURA SEGUN EL TIPO DE HISTORIA
//LA FUNCION RECIBE EL NO,BRE DE LA REGION A MOSTRAR
function fjvConfRegIniVatencion(region){
    //OCULTA TODAS LAS REGIONES
    $('#atencion').hide();
    $('#motivo').hide();
    $('#nutricion').hide();
    $('#estado').hide();
    $('#ingresos').hide();
    $('#causa').hide();
    //SE CREA LA SENTNCIA SWITCH Y RECIBE LA REGION
    switch (region) {
        //SEGUN LA REGION QUE RECIBIO EL SWITCH MUESTRA LA REGION
        case 'ATENCION':
            $('ATENCION')
            $('#atencion').show();
            $('#atencion_heading')[0].outerText = 'Datos de la Atención';
            break;
        case 'MOTIVO':
        //SEGUN LA REGION QUE RECIBIO EL SWITCH MUESTRA LA REGION
            $('#motivo').show();
            $('#motivo_heading')[0].outerText = 'Motivo / Enfermedad Actual';
            break;
        case 'NUTRICION':
        //SEGUN LA REGION QUE RECIBIO EL SWITCH MUESTRA LA REGION
            $('#nutricion').show();
            $('#nutricion_heading')[0].outerText = 'Nutricion';
            break;
        case 'ESTADO':
        //SEGUN LA REGION QUE RECIBIO EL SWITCH MUESTRA LA REGION
            $('#estado').show();
            $('#estado_heading')[0].outerText = 'Estado General';
            break;
        case 'INGRESOS':
        //SEGUN LA REGION QUE RECIBIO EL SWITCH MUESTRA LA REGION
            $('#ingresos').show();
            $('#ingresos_heading')[0].outerText = 'Ingresos';
            break;
        case 'CAUSA':
        //SEGUN LA REGION QUE RECIBIO EL SWITCH MUESTRA LA REGION
            $('#causa').show();
            $('#causa_heading')[0].outerText = 'Causa Externa';      
            break;
        default:
        //EN CASO DE QUE LA REGION NO EXISTA
            console.log(`No se encontro la historia`);
            break;
    }
}
//
/// 17 FEB 2023 MATEO PELAEZ HOLGUIN
//