function fjxBuscador(callback){
	//Pagina actual
    var page_actual = $('#pFlowStepId').val();
	//items
	let destino = $v('P' + page_actual + '_BUSCADOR');
	//items to submit
	var itemsToSubmit = '#P' + page_actual + '_BUSCADOR';
	
	 Swal.fire({
        title: 'Buscando',
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
    });
	
	apex.server.process(callback,
        {
            pageItems: itemsToSubmit,
            x01: destino
        },
        {
            success: function (res) {
                Swal.close();  
				if (res.Errores == 'N') {
					vUrl = res.Path;
                    window.open(vUrl, target="_blank" );
                } else if(res.Errores == 'A'){
                    null;
                }else {
                    Swal.fire({
                        icon: 'error',
                        title: 'Oops...',
                        text: res.Respuesta
                        })
                }
            },
            error: function (res) {
                Swal.close();  
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