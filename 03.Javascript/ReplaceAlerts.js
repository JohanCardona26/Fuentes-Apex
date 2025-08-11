
/**
 * @namespace ReplaceAlerts
 * @CreateBy Jcastaño - XTLIMS
 * @description La idea es reemplazar las alertas nativas de apex por unas personalizadas con la libreria sweet alert
 */

// Estilo para la notificacion del lado izquierdo

const _left_alert = Swal.mixin({
    toast: true,
    position: `top-end`,
    returnFocus: false,
    showConfirmButton: false,
    timerProgressBar: true,
    timer: 3000,
    didOpen: (toast) => {
        toast.addEventListener(`mouseenter`, Swal.stopTimer)
        toast.addEventListener(`mouseleave`, Swal.resumeTimer)
    }
})

// Estilo para la notificacion del lado izquierdo
const _rigth_alert = Swal.mixin({
    toast: true,
    position: `bottom-end`,
    returnFocus: false,
    showConfirmButton: false,
    didOpen: (toast) => {
        toast.addEventListener(`mouseenter`, Swal.stopTimer)
        toast.addEventListener(`mouseleave`, Swal.resumeTimer)
    }
})

// Estilo para la notificación de preguntas cuando se necesita validar por primera vez
const _question_alert = Swal.mixin({
    icon: `question`,
    showCancelButton: true,
    cancelButtonText : 'Cancelar',
    confirmButtonText : 'Confirmar',
    confirmButtonColor: safix.colores.VA_VERDE,
    cancelButtonColor: safix.colores.VA_ROJO,
})

// Estilo para notificación de éxito
const ShowAlertPageSuccess = (mensaje) => {
    _left_alert.fire({
        icon: `success`,
        title: mensaje,
        width: CalculateWithAlert(mensaje)
    })
}

//Volver a la página posterior de la página actual
const ResetPage = () =>{
    let urlSplit = location.href.split(`:`)
    urlSplit.splice(7, 10)
    location.replace(urlSplit.join(`:`) + `:::::`)
}

// Notificación con temporizador para espera de usuario
var _finalTimer = ``
const AlertWaitTimer = (title, action) => {
    Swal.close()
    _finalTimer = ``
    let totalTimer = 0
    let timerInterval = null
    let points = []
    
    Swal.fire({
        title: title,
        html: `<p style="font-size: 24px">${action}<b id="points_loading"></b><br>Timer: <b id="timer_count"></b></p>`,
        timer: 1100,
        allowOutsideClick: false,
        didOpen: () => {
            Swal.showLoading()
            const b = Swal.getHtmlContainer().querySelector(`b`)
            timerInterval = setInterval(() => {
                Swal.increaseTimer(2000)  
                totalTimer = Swal.getTimerLeft()
                let timerFormat = new Date(`January 01, 0000 00:00:00:00`)
                timerFormat.setMilliseconds(totalTimer - 1000)
                _finalTimer = `${twoCharactersNumber(timerFormat.getHours())}:${twoCharactersNumber(timerFormat.getMinutes())}:${twoCharactersNumber(timerFormat.getSeconds())}` 
                if(points.length == 3){
                    points = [`.`]
                }else{
                    points.push(`.`)
                }
                try{
                    $(timer_count).text(_finalTimer)
                    $(points_loading).text(points.join(``))
                }catch{

                }
            }, 1000)
        },
        willClose: () => {
            clearInterval(timerInterval)
        }
    })

    return _finalTimer
}

// Cerrar todas las notificaciones en la pantalla
const CloseAllMessages = () => {
    Swal.close()
    apex.message.clearErrors()
}


// Calcule la alerta con para notificaciones dinámicas
const CalculateWithAlert = (text) => {
    return (text.length * 4.5) + 400
}

//Alerta de un server side code
apex.message.alert = (MensajeError) => {
    let MostrarError;
    
    if(MensajeError.includes(`Server-Side Code`)) MostrarError = MensajeError.substr(MensajeError.indexOf(`ORA-`) ).replace(`for Execute Server-Side Code.`, ``);
    
    safix.procesos.mensajesConsola.error(MensajeError, MostrarError);
    
    alertas.aviso(MostrarError)
}
/** 
 * @module alertas.enlistadas
 * @example safix.alertas.enlistadas([ 1 ,2 ,3 ])
 * @description Ejecutamos avisos que esten en un array configurado
 */
alertas.enlistadas = (lista) => {
    let posicion = 0;
    
    let ejecutarxPosicion = () => {
        if(posicion < lista.length){
            safix.alertas.aviso(lista[posicion]).then(() => {
                posicion++
                ejecutarxPosicion()
            })
        }
    }

    ejecutarxPosicion();
}


/**
 * Revisar nueva alerta con icono para apex
 */

//  // Swal.showLoading()
//  Swal.fire({
//     title: '',
//     html: `
//         <div style="display: flex; justify-content: center; align-items: center; height: 100%;">
//             <svg class="pl" width="240" height="240" viewBox="0 0 240 240">
//                 <g>
//                     <text x="120" y="140" font-size="80" font-weight="bold" font-style="italic" opacity="0.8" style="animation: fade 2s alternate infinite;">
//                         <tspan fill="#2EBFBC">X</tspan>
//                         <tspan dy="-0.2em" fill="purple">.</tspan>
//                         <tspan dy="-0.2em" fill="purple">.</tspan>
//                     </text>
//                 </g>
//             </svg>
//             <p>Por favor, espera mientras el video se carga.</p>
//         </div>
//     `,
//     showConfirmButton: false,
//     allowOutsideClick: false,
//     onBeforeOpen: () => {
//         Swal.showLoading();
//     }
// });

// // Agregar animación de desvanecimiento al SVG
// const style = document.createElement('style');
// style.innerHTML = `
//     @keyframes fade {
//         from {
//             opacity: 1;
//         }
//         to {
//             opacity: 0.2;
//         }
//     }
// `;
// document.head.appendChild(style);
