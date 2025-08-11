//OCULTA Y LIMPIA LOS ITEMS QUE RECIBE LA FUNCION
//RECIBE UN ARREGLO CON EL NOMBRE DE LOS RESPECTIVOS ITEMS
function fjvMostraOcultar1(nameItems){
 	for(var i=0; i<nameItems.length; i++){
        apex.item(nameItems[i]).setValue(null);
        apex.item(nameItems[i]).hide();
    }
}
//
/// 17 FEB 23 MATEO PELAEZ HOLGUIN
//