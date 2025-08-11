function AjustarColumnasLovs (options) {
    var col, 
        columns = options.columns,
        col2;

    col             = columns.POS; 
    col.width       = 10;
    col.noStretch   = true;

    col2             = columns.CONTROL; 
    col2.width       = 10;
    col2.noStretch   = true;
    //pendiente estandarizar


    console.log('Atributos LOV', options)
    console.log('Atributos LOV columns' , columns)
    
    return options;
}