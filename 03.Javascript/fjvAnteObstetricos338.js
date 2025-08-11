//ESTA FUNCION ES UNICAMENTE USADA EN LA PAGINA 338
function fvjAnteObstetricos338(){
    //VALIDA SI EL ITEM P311_NGESTAS ESTA VACIO O TIENE 0
    if($v('P338_NGESTAS') == '' || $v('P338_NGESTAS') == 0){
    //SI ES VERDADERO CREA EL ARREGLO nameItems Y LE AÑADE LOS NOMBRE DE LOS ITEMS QUE VA A USAR
        var nameItems = [
                'P338_NVAGINALES'
                ,'P338_FRINSTRUMENTAL'
                ,'P338_NECTOPICOS'
                ,'P338_NVIVOS'
                ,'P338_NVIVEN'
                ,'P338_NPARTOS'
                ,'P338_NABORTOS'
                ,'P338_FRABORTOSCONSEC'
                ,'P338_NGESTACIONALMORTINATOS'
                ,'P338_NMUEREN'
                ,'P338_NMENOR'
                ,'P338_NCESAREA'
                ,'P338_NMORTINATOS'
                ,'P338_NPREMATURO'
                ,'P338_NGESTACIONALPREMATUROS'
                ,'P338_NMAYOR'
                ,'P338_FRMULTIPLES'
                ,'P338_VFECHAMORTINATOS'
                ,'P338_VFECHAPREMATUROS'
                ,'P338_NMUEREND1S'
                ,'P338_NMUEREN1S'
                ,'P338_VINTERGENESICO'
                ,'P338_FESMENORA1O5'
                ,'P338_VXLACTANCIA'
                ,'P338_VOBSERVACIONESLACTANCIA'
                ,'P338_VTRATAMIENTOS'
                ,'P338_VOBSERVACIONES'];
        //EJECUTA LA FUNCION fjvMostraOcultar1 CON LOS ELEMNTOS DE EL ARREGLO nameItems
        fjvMostraOcultar1(nameItems);
        //SOBRE ESCRIBE EL ARREGLO ANTERIOR CON NUEVOS ITEMS
        var nameItems = [
                'P338_FRNINGUNA'
                ,'P338_FRRPM'
                ,'P338_FROLIGOHIDRAMNIOS'
                ,'P338_FRRCIU'
                ,'P338_FRAMENABORTO'
                ,'P338_FRPREMATURO'
                ,'P338_FRPOLHIDRAMNIOS'
                ,'P338_FREMBARAZOMOLAR'
                ,'P338_FRPROLONGADO'
                ,'P338_FRECLAMPSIA'
                ,'P338_FRSIFILISCONGENITA'
                ,'P338_FRSIFILISGESTACIONAL'
                ,'P338_FRDEPRESIONPOSPARTO'
                ,'P338_FRDIABETESGESTA'
                ,'P338_FRTOXOPLASMOSIS'
                ,'P338_FRMACROSOMIA'
                ,'P338_FRANOMALIASFETALES'
                ,'P338_FRATONIAUTERINA'
                ,'P338_FRPRESENTACIONANORMAL'
                ,'P338_FRHIPERPLACENTARIA'
                ,'P338_FRHEMOGRAFIA'
                ,'P338_FREBARAZOGEMELAR'
                ,'P338_FRCIRUGIAGINECO'
                ,'P338_FRCESAREAPREVIA'
                ,'P338_FRCARDIACA'
                ,'P338_FRHISTINFERTILIDAD'
                ,'P338_FRAUTOINMUNE'
                ,'P338_FRBACTERIANA'
                ,'P338_FRANEMIA'
                ,'P338_FRENFRENALCRONICA'
                ,'P338_FRPRECLAMPSIA'
                ,'P338_FRMELLITUS'
                ,'P338_FRPARTOPROLONGADO'
                ,'P338_FRPRIMIPARIEDAD'
                ,'P338_VXDESGARRO'
        ];
        //EJECUTA LA FUNCION fjvPonerNull ENVIANDOLE EL ARREGLO nameItems 
        fjvPonerNull(nameItems);
        //EJECUTA LA FUNCION fvjHideRegion Y LE ENVIA EL ID ESTATICO formPatoEmbarazos1
        fvjHideRegion('#formPatoEmbarazos1');
    }else{
        ////SI ES FALSO CREA EL ARREGLO nameItems Y LE AÑADE LOS NOMBRE DE LOS ITEMS QUE VA A USAR
        var nameItems = [
            'P338_NVAGINALES'
            ,'P338_FRINSTRUMENTAL'
            ,'P338_NECTOPICOS'
            ,'P338_NVIVOS'
            ,'P338_NVIVEN'
            ,'P338_NPARTOS'
            ,'P338_NABORTOS'
            ,'P338_FRABORTOSCONSEC'
            ,'P338_NGESTACIONALMORTINATOS'
            ,'P338_NMUEREN'
            ,'P338_NMENOR'
            ,'P338_NCESAREA'
            ,'P338_NMORTINATOS'
            ,'P338_NPREMATURO'
            ,'P338_NGESTACIONALPREMATUROS'
            ,'P338_NMAYOR'
            ,'P338_FRMULTIPLES'
            ,'P338_VFECHAMORTINATOS'
            ,'P338_VFECHAPREMATUROS'
            ,'P338_NMUEREND1S'
            ,'P338_NMUEREN1S'
            ,'P338_VINTERGENESICO'
            ,'P338_FESMENORA1O5'
            ,'P338_VXLACTANCIA'
            ,'P338_VOBSERVACIONESLACTANCIA'
            ,'P338_VTRATAMIENTOS'
            ,'P338_VOBSERVACIONES'];
        //EJECUTA LA FUNCION fjvMostarItems CON LOS ELEMENTOS DE EL ARREGLO nameItems    
        fjvMostarItems(nameItems);
        //EJECUTA LA FUNCION fvjShowRegion ENVIANDOLE EL ID ESTATICO formPatoEmbarazos1 
        fvjShowRegion('#formPatoEmbarazos1');
        //VALIDA SI P338_VXLACTANCIA ESTA EN BLANCO
        if($v('P338_VXLACTANCIA') == ''){
            //SI ES VERDAD, INICIA EL ITEM P338_VXLACTANCIA EN S 
            apex.item('P338_VXLACTANCIA').setValue('S')
        }
    }
}
//
/// 17 FEB 2023 MATEO PELAEZ HOLGUIN
//
