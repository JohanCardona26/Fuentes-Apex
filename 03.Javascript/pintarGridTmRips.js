pintarGridTmRips = () => {
    // clase de filas de los grids
    const fila = $(".a-GV-row");
    
    // loop para recorrer cada fila
    for (let i = 0; i < fila.length; i++) {
        // fila actual en el reccorrido
        let row = fila[i];
        // declaracion de variables que nos indican las condiciones para pintar o no la fila
        let avalar, origen, ripsLinea; 
        // obtencion del dato  de avalar
        try{
            avalar = fila[i].children[9].textContent;
        } catch (e) {
            safix.procesos.mensajesConsola.error(`Error Avalar ${e}`)
        }

        // Obtencion de dato de origen
        try{
            origen = $nvl(fila[i].children[8].textContent, '-1');
        } catch (e) {
            safix.procesos.mensajesConsola.error(`Error origen ${e}`)
        }
        
        // obtencion de dato de rips
        try{
            ripsLinea = fila[i].children[10].textContent;
        } catch (e) {
            safix.procesos.mensajesConsola.error(`Error rips ${e}`)
        }
        
        if (avalar > 0){
        
            $(row).attr('style', `background-color:${safix.coloresPastel.VA_AZUL} !important`);
        
        } else if (origen != 'Programada') {
        
            $(row).attr('style', `background-color:${safix.coloresPastel.VA_ROJO} !important`);
        
        } else if (ripsLinea) {
            
            $(row).attr('style', `background-color:${safix.coloresPastel.VA_VERDE} !important`);
        
        }
    }
}