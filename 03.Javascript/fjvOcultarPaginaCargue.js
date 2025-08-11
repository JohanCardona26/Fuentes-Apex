//OCULTA LOS ITEMS QUE RECIBE LA FUNCION
function fjvOcultarPaginaCargue(nameItems){
    arguments = nameItems;
 	for(var i=0; i<arguments.length; i++){
        apex.item(arguments[i]).hide();
    }
}
//
/// 17 FEB 2023 MATEO PELAEZ HOLGUIN
//