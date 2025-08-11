// 26-12-2022 Sebastian Cardona y Juan Castaño: Se crea funcion que genera el extracto y obtiene el base64 del pdf para retonarlo en la region 
function generateExtracto(opcion){    
    Swal.fire({
        title: 'Generando Extracto!',
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

    apex.server.process('Generate_Report'
    /*{
        pageItems: '#P171_CLIENTE',
        x01: id
    }*/
    ).then((nomArchivo) => {
		swal.close();
        if (nomArchivo.Resp !=  'false'){
            apex.server.process(opcion,
            {
                x01: nomArchivo.Resp
            }).then((e) => {
                if (e.res != 'false'){
                    if (opcion == 'Get_Clob2'){
                        console.log(e.res);
                    } else{
						 
                        $('#report_pdf').attr('src', 'data:application/pdf;base64,' + e.res);
                    }
					 const Toast = Swal.mixin({
					  toast: true,
					  position: 'top-end',
					  showConfirmButton: false,
					  timer: 3000,
					  timerProgressBar: true,
					  didOpen: (toast) => {
						toast.addEventListener('mouseenter', Swal.stopTimer)
						toast.addEventListener('mouseleave', Swal.resumeTimer)
					  }
					})

					Toast.fire({
					  icon: 'success',
					  title: 'Extracto Generado'
					})                    
                } else {
					 const Toast = Swal.mixin({
					  toast: true,
					  position: 'top-end',
					  showConfirmButton: false,
					  timer: 3000,
					  timerProgressBar: true,
					  didOpen: (toast) => {
						toast.addEventListener('mouseenter', Swal.stopTimer)
						toast.addEventListener('mouseleave', Swal.resumeTimer)
					  }
					})

					Toast.fire({
					  icon: 'error',
					  title: 'No fue posible generar el extracto'
					}) 
				}
            })
        }
		else{
			const Toast = Swal.mixin({
			  toast: true,
			  position: 'top-end',
			  showConfirmButton: false,
			  timer: 3000,
			  timerProgressBar: true,
			  didOpen: (toast) => {
				toast.addEventListener('mouseenter', Swal.stopTimer)
				toast.addEventListener('mouseleave', Swal.resumeTimer)
			  }
			})

			Toast.fire({
			  icon: 'error',
			  title: 'No fue posible generar el extracto'
			})                    
		}

    })
}