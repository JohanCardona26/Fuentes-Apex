function fjvValidacionPantalla (){

    if (screen.width > 1180 && screen.height > 820) { //pantalla de pc
        $('#volver').hide();
        $('#AGREGARSIGNOS').hide();
        $('#AGREGARGLUCOMETRIA').hide();
        $('#botondetallesM').hide();
        $('#AGREGARFETALES').hide();
        $('.a-Toolbar-toggleButton.js-actionCheckbox.a-Toolbar-item').hide();
        $('.a-Button.a-Toolbar-item.js-actionButton').show();
        $('.a-Toolbar-toggleButton.js-actionCheckbox.a-Toolbar-item').hide();

    }else {//pantalla pequeña
        $('#AGREGARSIGNOS').show();
        $('.a-Button.a-Toolbar-item.js-actionButton.a-Button--hot').hide();
        $('.a-Toolbar-toggleButton.js-actionCheckbox.a-Toolbar-item').hide();
        $('.a-Button.a-Toolbar-item.js-actionButton').hide();
        $('.a-Toolbar-toggleButton.js-actionCheckbox.a-Toolbar-item').hide();
        $('#AGREGARGLUCOMETRIA').show(); 
        $('#botondetallesM').hide();
        $('#AGREGARFETALES').show();
        $('#volver').hide();


    }
}