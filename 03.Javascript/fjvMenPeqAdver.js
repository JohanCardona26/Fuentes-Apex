//ALERTA CREADA CON SWEETALERT2, RECIBE EL MENSAJE DE LA ALERTA Y EL TIPO
//MENSAJE EN ESQUINA SUPERIOR DERECHA, PEQUEÑO
function fjvMenPeqAdver(alert, type){
    const Toast = Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,  
    timer: 4000
    })

    Toast.fire({ 
    icon: type,
    titleText: alert
    })
    
}
//
/// 17 ENE 23 MATEO PELAEZ HOLGUIN
//
