function fjxAccionarCrud(accion, callback) {
    //Pagina actual
    var page_actual = $('#pFlowStepId').val();
    //items
    let page_id_new = $v('P' + page_actual + '_ID'),
        page_name   = $v('P' + page_actual + '_NAME'),
        page_title  = $v('P' + page_actual + '_STEP_TITLE'),
        group_id    = $v('P' + page_actual + '_GROUP_ID'),
        is_library  = $v('P' + page_actual + '_ES_LIBRERIA');
        alias       = $v('P' + page_actual + '_ALIAS');
        //sin plantilla o libreria
    let page_type   = $v('P' + page_actual + '_PAGE_MODE' ),
        template    = $v('P' + page_actual + '_STEP_TEMPLATE'),
        help_text   = $v('P' + page_actual + '_HELP_TEXT'),
        rol         = $v('P' + page_actual + '_REQUIRED_ROLE')
        js_file     = $v('P' + page_actual + '_JAVASCRIPT_FILE_URLS'),
        css_file    = $v('P' + page_actual + '_CSS_FILE_URLS'),
        autcomplete = $v('P' + page_actual + '_AUTOCOMPLETE_ON_OFF'),
        pageComment = $v('P' + page_actual + '_PAGE_COMMENT');
        //con plantilla o libreria
    let id_libreria = $v('P' + page_actual + '_ID_LIBRERIAS');
    //nommbre de items para mandarlos al navegador y facilitarle tareas al proceso
    var itemsToSubmit = '#P' + page_actual + '_ID' + ',' +
                        '#P' + page_actual + '_NAME' + ',' +
                        '#P' + page_actual + '_STEP_TITLE' + ',' +
                        '#P' + page_actual + '_GROUP_ID' + ',' +
                        '#P' + page_actual + '_ES_LIBRERIA' + ',' +
                        '#P' + page_actual + '_PAGE_MODE' + ',' +
                        '#P' + page_actual + '_STEP_TEMPLATE' + ',' +
                        '#P' + page_actual + '_HELP_TEXT' + ',' +
                        '#P' + page_actual + '_REQUIRED_ROLE' + ',' +
                        '#P' + page_actual + '_JAVASCRIPT_FILE_URLS' + ',' +
                        '#P' + page_actual + '_CSS_FILE_URLS' + ',' +
                        '#P' + page_actual + '_AUTOCOMPLETE_ON_OFF' + ',' +
                        '#P' + page_actual + '_PAGE_COMMENT' + ',' +
                        '#P' + page_actual + '_ID_LIBRERIAS'+ ',' +
                        '#P' + page_actual + '_DSP_TIPCOMP'+ ',' +
						'#P' + page_actual + '_DSP_ICON'+ ',' +
                        '#P' + page_actual + '_DSP_PROPOSITO'
                        '#P' + page_actual + '_ALIAS'
                        ;
    //items display
    let vTipoComponete  = $v('P' + page_actual + '_DSP_TIPCOMP'),
        vIcon           = $v('P' + page_actual + '_DSP_ICON'),
		vProposito		= $v('P' + page_actual + '_DSP_PROPOSITO');

    //abre alerta
    let titulo_alerta, tituloConfirmacion;
    if (accion == 'SAVE'){
        titulo_alerta       = 'Creando la página!';
        tituloConfirmacion  = '¿Está seguro que desea crear la página?';
    }
    else{
        if(accion == 'DELETE'){
            titulo_alerta       = 'Borrando la página!';
            tituloConfirmacion  = '¿Está seguro que desea borrar la página?';
        }else{
            titulo_alerta       = 'Actualizando la información!';
            tituloConfirmacion  = '¿Está seguro que actualizarla pagina?';
        }
    }

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
                apex.server.process(callback,
                    {
                        pageItems: itemsToSubmit,
                         x01: accion
						,x02: page_id_new
						,x03: page_name
						,x04: page_title  
						,x05: group_id    
						,x06: is_library  
						,x07: page_type   
						,x08: template    
						,x09: help_text   
						,x10: rol         
						,x11: js_file     
						,x12: css_file    
						,x13: autcomplete 
						,x14: pageComment 
						,x15: id_libreria
						,x16: vTipoComponete
						,x17: vIcon
						,x18: vProposito
						,x19: alias
                    },
                    {
                        success: function (res) {
                            Swal.close();  
                            console.log(res);              
                            if (res.Errores == 'N') {
                                Swal.fire({
                                    position: 'top-end',
                                    icon: 'success',
                                    title: res.Mensajes,
                                    showConfirmButton: false,
                                    timer: 1500
                                })
                            }else {
                                Swal.fire({
                                    icon: 'error',
                                    title: 'Oops...',
                                    text: res.Mensajes
                                })
                            }
                        
                                
                            
                        },
                        error: function (res) {
                            console.log(res);
                            Swal.fire({
                                icon: 'error',
                                title: 'Oops...',
                                text: "Favor valide, el proceso no quedo bien instalado"
                                })
                        }
                    }
                );
            }
    })
    //
    
};