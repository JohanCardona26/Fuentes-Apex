
function fjvCrearHistoria(idConfigurado) {
    //Pagina actual
    var page_actual = $('#pFlowStepId').val();

    //items
    let idAdmision  = $v('P0_P_ADMISION'),
    idPaciente      = $v('P0_P_HISTORIA'),
    sexo            = $v('P0_P_SEXO');


    //nommbre de items para mandarlos al navegador y facilitarle tareas al proceso
    var itemsToSubmit = '#P0_P_SEXO' + ',' +
                        '#P0_P_HISTORIA' + ',' +
                        '#P0_P_ADMISION';

    //abre alerta
    let titulo_alerta, tituloConfirmacion;

    titulo_alerta       = 'Creando la historia!';
    tituloConfirmacion  = '¿Está seguro que desea crear la historia?';

    Swal.fire({
        title: tituloConfirmacion,
        text: "¡No podrás revertir esto!",
        icon: 'warning',
        showCancelButton: true,
        allowOutsideClick: false,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Confirmar'
        }).then((result) => {
            if (result.isConfirmed) {
                
                Swal.fire({
                    title: titulo_alerta,
                    html: 'Este proceso puede tardar unos segundos',
                    timerProgressBar: true,
                    allowOutsideClick: false,
                    didOpen: () => {
                        Swal.showLoading()
                    }
                    }).then((result) => {
                    if (result.dismiss === Swal.DismissReason.timer) {
                        console.log('I was closed by the timer')
                    }
                })
                //
                apex.server.process('PU_CREAR_HISTORIA',
                    {
                        pageItems: itemsToSubmit,
                         x01: idConfigurado
						,x02: idAdmision
						,x03: idPaciente
                        ,x04: sexo
                    },
                    {
                        success: function (res) {
                            Swal.close();  
                            console.log(res);              
                            if (res.Errores == 'N') {
                                location.reload();
                                Swal.fire({
                                    position: 'top-end',
                                    icon: 'success',
                                    title: res.Mensaje,
                                    showConfirmButton: false,
                                    timer: 1500
                                })
                                apex.item('P' + page_actual + '_TIPO_HISTORIA').setValue(idConfigurado);
                                
                            }else {
                                Swal.fire({
                                    icon: 'error',
                                    title: 'Oops...',
                                    text: res.Mensaje
                                })
                                apex.item('P' + page_actual + '_TIPO_HISTORIA').setValue("");
                            }
                        
                                
                            
                        },
                        error: function (res) {
                            console.log(res);
                            Swal.fire({
                                icon: 'error',
                                title: 'Oops...',
                                text: "Favor valide, el proceso no quedo bien instalado, revisar consola"
                                })
                        }
                    }
                );
            }
    })
    //
    
};