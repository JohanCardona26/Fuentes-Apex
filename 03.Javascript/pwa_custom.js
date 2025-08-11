// La documentación y los archivos:
// https://github.com/vincentmorneau/apex-pwa/blob/master/doc/part2.md

/**
 * Juan David Castaño Usuga
 * app.js for all functionaity on the page and functions that can be reused in very common methods for the user experience
l */

/**
 * 
 * PROGRESIVE WEB APP (PWA)
 * 
 */
// https://redminexenco.com.co:4433/ords/xenco/r/105/files/static/v259/iconos

/**
 * @global variables
 **/
//Paginas
// Define el service worker
var apexServiceWorker = null;

// Valida y detecta si el usuario concedio el permiso de las notificaciones
var hasSubscribedNotifications = false;

// Objeto que instala el prompt
var installPrompt;

//VARIABLE QUE SE USARA PARA OBTENER LA COMPROBACION DE INSTALACION
var deferredPrompt = null;

// Llave publica del firebase
// CHANGE THIS VALUE
var firebaseVapidPublicKey = 'BOFoGrYiN1P70-UMcQ9vbfCJl9x5MXfxqCBbBqOVvim_s63i9xpM9P0PwqHvfNAs2D1rKYFOlMXhD3_Rtuybl2o';

// REST endpoint where we store requests for push notifications
// CHANGE THIS VALUE
var firebaseNotificationEndpoint = 'https://apex-pwa.firebaseio.com/notifications.json';

//RUTA DE LOS ICONOS QUE SE USARAN EN EL MANIFEST
let icons_route = `https://redminexenco.com.co:8082/apex212/xenco/r/105/files/static/v2875/pwa_icons/`

//const pages_to_save = [pagesPwa]

//let nombreTabla;

//RECONOCE SI ESTA EN UNA PAGINA CON ENCABEZADO
if($v('P0_NRO_HISTORIA')){
    //SI HAY ENCABEZADO(SE ESCOGIO CLIENTE) ENTONCES GUARDAR EL NUMERO DE LA HISTORIA
    nombreTabla = $v('P0_NRO_HISTORIA')

}else{
    //SI NO SE HA ESCOGIDO CLIENTE, LE DA A LA VARIABLE EL STRING DATOS_USUARIO, ESTE VA A SERVIR PARA DARLE EL NOMBRE A LA TABLA EN EL INDEXDB
    nombreTabla = 'DATOS_USUARIOS' 
}

//CONFIGURA EL INDEXDB, LE CAMBIA EL NOMBRE A LA BASE DE DATOS Y LE MODIFICA EL NOMBRE A LA TABLA SEGUN LA VARIABLE nombreTabla
localforage.config({
  //  NOMBRE BASE DATOS
    name: 'BaseDatosHce',
//    NOMBRE TABLA
    storeName : nombreTabla
});



//OBTIENE LOS REGISTROS DE LA CLAVE SESSION
localforage.getItem('session').then(function(ses){
    //VALDIA SI HAY REGISTROS
    if(ses){
        //SI HAY REGISTROS, VALIDA QUE SE ESTE EJECUTANDO ESTA FUNCION EN LA PAGINA 10064 

        let url = "https://redminexenco.com.co:8082/apex212/f?p=105:10064"
            
        if($v('pFlowStepId') == '10064'){
            url = `https://redminexenco.com.co:8082/apex212/f?p=105:10064:${ses}:::::`
        }

        //if($v('pFlowStepId') == '10064'){
            //SI SE ESTA EJECUTANDO EN LA PAGINA 10064, ENTONCES CREA LA VARIABLE QUE CONTENDRA EL MANIFEST
            //Y CONCATENA EL VALOR QUE SE OBTUVO DEL LOCALFORAGE EN LA START_URL
            //SE CONCATENA LA RUTA LA VARIABLE ICONS_ROUTE(CONTIENE LA RUTA INICIAL DE LAS IMAGENES) CON EL NOMBRE DE LAS IMAGENES


            var manifest_pwa_app =  
            `{
                "name": "Safix Mobile",
                "short_name": "Safix",
                "start_url": ${url}
                "display": "standalone",
                "orientation": "portrait-primary",
                "background_color": "#fff",
                "theme_color": "#3f51b5",
                "description": "Safix Mobile App",
                "dir": "ltr",
                "lang": "es-CO",
                "gcm_sender_id": "103953800507",
                "prefer_related_applications": false,
                "icons": [
                    {
                        "src": "${icons_route}windows/SmallTile.scale-100.png",
                        "sizes": "71x71"
                    },
                    {
                        "src": "${icons_route}windows/SmallTile.scale-125.png",
                        "sizes": "89x89"
                    },
                    {
                        "src": "${icons_route}windows/SmallTile.scale-150.png",
                        "sizes": "107x107"
                    },
                    {
                        "src": "${icons_route}windows/SmallTile.scale-200.png",
                        "sizes": "142x142"
                    },
                    {
                        "src": "${icons_route}windows/SmallTile.scale-400.png",
                        "sizes": "284x284"
                    },
                    {
                        "src": "${icons_route}windows/Square150x150Logo.scale-100.png",
                        "sizes": "150x150"
                    },
                    {
                        "src": "${icons_route}windows/Square150x150Logo.scale-125.png",
                        "sizes": "188x188"
                    },
                    {
                        "src": "${icons_route}windows/Square150x150Logo.scale-150.png",
                        "sizes": "225x225"
                    },
                    {
                        "src": "${icons_route}windows/Square150x150Logo.scale-200.png",
                        "sizes": "300x300"
                    },
                    {
                        "src": "${icons_route}windows/Square150x150Logo.scale-400.png",
                        "sizes": "600x600"
                    },
                    {
                        "src": "${icons_route}windows/Wide310x150Logo.scale-100.png",
                        "sizes": "310x150"
                    },
                    {
                        "src": "${icons_route}windows/Wide310x150Logo.scale-125.png",
                        "sizes": "388x188"
                    },
                    {
                        "src": "${icons_route}windows/Wide310x150Logo.scale-150.png",
                        "sizes": "465x225"
                    },
                    {
                        "src": "${icons_route}windows/Wide310x150Logo.scale-200.png",
                        "sizes": "620x300"
                    },
                    {
                        "src": "${icons_route}windows/Wide310x150Logo.scale-400.png",
                        "sizes": "1240x600"
                    },
                    {
                        "src": "${icons_route}windows/LargeTile.scale-100.png",
                        "sizes": "310x310"
                    },
                    {
                        "src": "${icons_route}windows/LargeTile.scale-125.png",
                        "sizes": "388x388"
                    },
                    {
                        "src": "${icons_route}windows/LargeTile.scale-150.png",
                        "sizes": "465x465"
                    },
                    {
                        "src": "${icons_route}windows/LargeTile.scale-200.png",
                        "sizes": "620x620"
                    },
                    {
                        "src": "${icons_route}windows/LargeTile.scale-400.png",
                        "sizes": "1240x1240"
                    },
                    {
                        "src": "${icons_route}windows/Square44x44Logo.scale-100.png",
                        "sizes": "44x44"
                    },
                    {
                        "src": "${icons_route}windows/Square44x44Logo.scale-125.png",
                        "sizes": "55x55"
                    },
                    {
                        "src": "${icons_route}windows/Square44x44Logo.scale-150.png",
                        "sizes": "66x66"
                    },
                    {
                        "src": "${icons_route}windows/Square44x44Logo.scale-200.png",
                        "sizes": "88x88"
                    },
                    {
                        "src": "${icons_route}windows/Square44x44Logo.scale-400.png",
                        "sizes": "176x176"
                    },
                    {
                        "src": "${icons_route}windows/StoreLogo.scale-100.png",
                        "sizes": "50x50"
                    },
                    {
                        "src": "${icons_route}windows/StoreLogo.scale-125.png",
                        "sizes": "63x63"
                    },
                    {
                        "src": "${icons_route}windows/StoreLogo.scale-150.png",
                        "sizes": "75x75"
                    },
                    {
                        "src": "${icons_route}windows/StoreLogo.scale-200.png",
                        "sizes": "100x100"
                    },
                    {
                        "src": "${icons_route}windows/StoreLogo.scale-400.png",
                        "sizes": "200x200"
                    },
                    {
                        "src": "${icons_route}windows/SplashScreen.scale-100.png",
                        "sizes": "620x300"
                    },
                    {
                        "src": "${icons_route}windows/SplashScreen.scale-125.png",
                        "sizes": "775x375"
                    },
                    {
                        "src": "${icons_route}windows/SplashScreen.scale-150.png",
                        "sizes": "930x450"
                    },
                    {
                        "src": "${icons_route}windows/SplashScreen.scale-200.png",
                        "sizes": "1240x600"
                    },
                    {
                        "src": "${icons_route}windows/SplashScreen.scale-400.png",
                        "sizes": "2480x1200"
                    },
                    {
                        "src": "${icons_route}windows/Square44x44Logo.targetsize-16.png",
                        "sizes": "16x16"
                    },
                    {
                        "src": "${icons_route}windows/Square44x44Logo.targetsize-20.png",
                        "sizes": "20x20"
                    },
                    {
                        "src": "${icons_route}windows/Square44x44Logo.targetsize-24.png",
                        "sizes": "24x24"
                    },
                    {
                        "src": "${icons_route}windows/Square44x44Logo.targetsize-30.png",
                        "sizes": "30x30"
                    },
                    {
                        "src": "${icons_route}windows/Square44x44Logo.targetsize-32.png",
                        "sizes": "32x32"
                    },
                    {
                        "src": "${icons_route}windows/Square44x44Logo.targetsize-36.png",
                        "sizes": "36x36"
                    },
                    {
                        "src": "${icons_route}windows/Square44x44Logo.targetsize-40.png",
                        "sizes": "40x40"
                    },
                    {
                        "src": "${icons_route}windows/Square44x44Logo.targetsize-44.png",
                        "sizes": "44x44"
                    },
                    {
                        "src": "${icons_route}windows/Square44x44Logo.targetsize-48.png",
                        "sizes": "48x48"
                    },
                    {
                        "src": "${icons_route}windows/Square44x44Logo.targetsize-60.png",
                        "sizes": "60x60"
                    },
                    {
                        "src": "${icons_route}windows/Square44x44Logo.targetsize-64.png",
                        "sizes": "64x64"
                    },
                    {
                        "src": "${icons_route}windows/Square44x44Logo.targetsize-72.png",
                        "sizes": "72x72"
                    },
                    {
                        "src": "${icons_route}windows/Square44x44Logo.targetsize-80.png",
                        "sizes": "80x80"
                    },
                    {
                        "src": "${icons_route}windows/Square44x44Logo.targetsize-96.png",
                        "sizes": "96x96"
                    },
                    {
                        "src": "${icons_route}windows/Square44x44Logo.targetsize-256.png",
                        "sizes": "256x256"
                    },
                    {
                        "src": "${icons_route}windows/Square44x44Logo.altform-unplated_targetsize-16.png",
                        "sizes": "16x16"
                    },
                    {
                        "src": "${icons_route}windows/Square44x44Logo.altform-unplated_targetsize-20.png",
                        "sizes": "20x20"
                    },
                    {
                        "src": "${icons_route}windows/Square44x44Logo.altform-unplated_targetsize-24.png",
                        "sizes": "24x24"
                    },
                    {
                        "src": "${icons_route}windows/Square44x44Logo.altform-unplated_targetsize-30.png",
                        "sizes": "30x30"
                    },
                    {
                        "src": "${icons_route}windows/Square44x44Logo.altform-unplated_targetsize-32.png",
                        "sizes": "32x32"
                    },
                    {
                        "src": "${icons_route}windows/Square44x44Logo.altform-unplated_targetsize-36.png",
                        "sizes": "36x36"
                    },
                    {
                        "src": "${icons_route}windows/Square44x44Logo.altform-unplated_targetsize-40.png",
                        "sizes": "40x40"
                    },
                    {
                        "src": "${icons_route}windows/Square44x44Logo.altform-unplated_targetsize-44.png",
                        "sizes": "44x44"
                    },
                    {
                        "src": "${icons_route}windows/Square44x44Logo.altform-unplated_targetsize-48.png",
                        "sizes": "48x48"
                    },
                    {
                        "src": "${icons_route}windows/Square44x44Logo.altform-unplated_targetsize-60.png",
                        "sizes": "60x60"
                    },
                    {
                        "src": "${icons_route}windows/Square44x44Logo.altform-unplated_targetsize-64.png",
                        "sizes": "64x64"
                    },
                    {
                        "src": "${icons_route}windows/Square44x44Logo.altform-unplated_targetsize-72.png",
                        "sizes": "72x72"
                    },
                    {
                        "src": "${icons_route}windows/Square44x44Logo.altform-unplated_targetsize-80.png",
                        "sizes": "80x80"
                    },
                    {
                        "src": "${icons_route}windows/Square44x44Logo.altform-unplated_targetsize-96.png",
                        "sizes": "96x96"
                    },
                    {
                        "src": "${icons_route}windows/Square44x44Logo.altform-unplated_targetsize-256.png",
                        "sizes": "256x256"
                    },
                    {
                        "src": "${icons_route}windows/Square44x44Logo.altform-lightunplated_targetsize-16.png",
                        "sizes": "16x16"
                    },
                    {
                        "src": "${icons_route}windows/Square44x44Logo.altform-lightunplated_targetsize-20.png",
                        "sizes": "20x20"
                    },
                    {
                        "src": "${icons_route}windows/Square44x44Logo.altform-lightunplated_targetsize-24.png",
                        "sizes": "24x24"
                    },
                    {
                        "src": "${icons_route}windows/Square44x44Logo.altform-lightunplated_targetsize-30.png",
                        "sizes": "30x30"
                    },
                    {
                        "src": "${icons_route}windows/Square44x44Logo.altform-lightunplated_targetsize-32.png",
                        "sizes": "32x32"
                    },
                    {
                        "src": "${icons_route}windows/Square44x44Logo.altform-lightunplated_targetsize-36.png",
                        "sizes": "36x36"
                    },
                    {
                        "src": "${icons_route}windows/Square44x44Logo.altform-lightunplated_targetsize-40.png",
                        "sizes": "40x40"
                    },
                    {
                        "src": "${icons_route}windows/Square44x44Logo.altform-lightunplated_targetsize-44.png",
                        "sizes": "44x44"
                    },
                    {
                        "src": "${icons_route}windows/Square44x44Logo.altform-lightunplated_targetsize-48.png",
                        "sizes": "48x48"
                    },
                    {
                        "src": "${icons_route}windows/Square44x44Logo.altform-lightunplated_targetsize-60.png",
                        "sizes": "60x60"
                    },
                    {
                        "src": "${icons_route}windows/Square44x44Logo.altform-lightunplated_targetsize-64.png",
                        "sizes": "64x64"
                    },
                    {
                        "src": "${icons_route}windows/Square44x44Logo.altform-lightunplated_targetsize-72.png",
                        "sizes": "72x72"
                    },
                    {
                        "src": "${icons_route}windows/Square44x44Logo.altform-lightunplated_targetsize-80.png",
                        "sizes": "80x80"
                    },
                    {
                        "src": "${icons_route}windows/Square44x44Logo.altform-lightunplated_targetsize-96.png",
                        "sizes": "96x96"
                    },
                    {
                        "src": "${icons_route}windows/Square44x44Logo.altform-lightunplated_targetsize-256.png",
                        "sizes": "256x256"
                    },
                    {
                        "src": "${icons_route}android/android-launchericon-512-512.png",
                        "sizes": "512x512"
                    },
                    {
                        "src": "${icons_route}android/android-launchericon-192-192.png",
                        "sizes": "192x192"
                    },
                    {
                        "src": "${icons_route}android/android-launchericon-144-144.png",
                        "sizes": "144x144"
                    },
                    {
                        "src": "${icons_route}android/android-launchericon-96-96.png",
                        "sizes": "96x96"
                    },
                    {
                        "src": "${icons_route}android/android-launchericon-72-72.png",
                        "sizes": "72x72"
                    },
                    {
                        "src": "${icons_route}android/android-launchericon-48-48.png",
                        "sizes": "48x48"
                    },
                    {
                        "src": "${icons_route}ios/16.png",
                        "sizes": "16x16"
                    },
                    {
                        "src": "${icons_route}ios/20.png",
                        "sizes": "20x20"
                    },
                    {
                        "src": "${icons_route}ios/29.png",
                        "sizes": "29x29"
                    },
                    {
                        "src": "${icons_route}ios/32.png",
                        "sizes": "32x32"
                    },
                    {
                        "src": "${icons_route}ios/40.png",
                        "sizes": "40x40"
                    },
                    {
                        "src": "${icons_route}ios/50.png",
                        "sizes": "50x50"
                    },
                    {
                        "src": "${icons_route}ios/57.png",
                        "sizes": "57x57"
                    },
                    {
                        "src": "${icons_route}ios/58.png",
                        "sizes": "58x58"
                    },
                    {
                        "src": "${icons_route}ios/60.png",
                        "sizes": "60x60"
                    },
                    {
                        "src": "${icons_route}ios/64.png",
                        "sizes": "64x64"
                    },
                    {
                        "src": "${icons_route}ios/72.png",
                        "sizes": "72x72"
                    },
                    {
                        "src": "${icons_route}ios/76.png",
                        "sizes": "76x76"
                    },
                    {
                        "src": "${icons_route}ios/80.png",
                        "sizes": "80x80"
                    },
                    {
                        "src": "${icons_route}ios/87.png",
                        "sizes": "87x87"
                    },
                    {
                        "src": "${icons_route}ios/100.png",
                        "sizes": "100x100"
                    },
                    {
                        "src": "${icons_route}ios/114.png",
                        "sizes": "114x114"
                    },
                    {
                        "src": "${icons_route}ios/120.png",
                        "sizes": "120x120"
                    },
                    {
                        "src": "${icons_route}ios/128.png",
                        "sizes": "128x128"
                    },
                    {
                        "src": "${icons_route}ios/144.png",
                        "sizes": "144x144"
                    },
                    {
                        "src": "${icons_route}ios/152.png",
                        "sizes": "152x152"
                    },
                    {
                        "src": "${icons_route}ios/167.png",
                        "sizes": "167x167"
                    },
                    {
                        "src": "${icons_route}ios/180.png",
                        "sizes": "180x180"
                    },
                    {
                        "src": "${icons_route}ios/192.png",
                        "sizes": "192x192"
                    },
                    {
                        "src": "${icons_route}ios/256.png",
                        "sizes": "256x256"
                    },
                    {
                        "src": "${icons_route}ios/512.png",
                        "sizes": "512x512"
                    },
                    {
                        "src": "${icons_route}ios/1024.png",
                        "sizes": "1024x1024"
                    }
                ]
            } `
       /* }else{
            //SI SE ESTA EJECUTANDO EL CODIGO EN OTRA PAGINA QUE NO SEA 10064, ENTONCES, SE DECLARA EL MANIFEST SIN TENER EN CUENTA EL REGISTRO DEL LOCALFORAGE
            var manifest_pwa_app =  
            `{
                "name": "Safix Mobile",
                "short_name": "Safix",
                "start_url": "https://redminexenco.com.co:8082/apex212/f?p=105:10064",
                "display": "standalone",
                "orientation": "portrait-primary",
                "background_color": "#fff",
                "theme_color": "#3f51b5",
                "description": "Safix Mobile App",
                "dir": "ltr",
                "lang": "es-CO",
                "gcm_sender_id": "103953800507",
                "prefer_related_applications": false,
                "icons": [
                    {
                        "src": "${icons_route}windows/SmallTile.scale-100.png",
                        "sizes": "71x71"
                    },
                    {
                        "src": "${icons_route}windows/SmallTile.scale-125.png",
                        "sizes": "89x89"
                    },
                    {
                        "src": "${icons_route}windows/SmallTile.scale-150.png",
                        "sizes": "107x107"
                    },
                    {
                        "src": "${icons_route}windows/SmallTile.scale-200.png",
                        "sizes": "142x142"
                    },
                    {
                        "src": "${icons_route}windows/SmallTile.scale-400.png",
                        "sizes": "284x284"
                    },
                    {
                        "src": "${icons_route}windows/Square150x150Logo.scale-100.png",
                        "sizes": "150x150"
                    },
                    {
                        "src": "${icons_route}windows/Square150x150Logo.scale-125.png",
                        "sizes": "188x188"
                    },
                    {
                        "src": "${icons_route}windows/Square150x150Logo.scale-150.png",
                        "sizes": "225x225"
                    },
                    {
                        "src": "${icons_route}windows/Square150x150Logo.scale-200.png",
                        "sizes": "300x300"
                    },
                    {
                        "src": "${icons_route}windows/Square150x150Logo.scale-400.png",
                        "sizes": "600x600"
                    },
                    {
                        "src": "${icons_route}windows/Wide310x150Logo.scale-100.png",
                        "sizes": "310x150"
                    },
                    {
                        "src": "${icons_route}windows/Wide310x150Logo.scale-125.png",
                        "sizes": "388x188"
                    },
                    {
                        "src": "${icons_route}windows/Wide310x150Logo.scale-150.png",
                        "sizes": "465x225"
                    },
                    {
                        "src": "${icons_route}windows/Wide310x150Logo.scale-200.png",
                        "sizes": "620x300"
                    },
                    {
                        "src": "${icons_route}windows/Wide310x150Logo.scale-400.png",
                        "sizes": "1240x600"
                    },
                    {
                        "src": "${icons_route}windows/LargeTile.scale-100.png",
                        "sizes": "310x310"
                    },
                    {
                        "src": "${icons_route}windows/LargeTile.scale-125.png",
                        "sizes": "388x388"
                    },
                    {
                        "src": "${icons_route}windows/LargeTile.scale-150.png",
                        "sizes": "465x465"
                    },
                    {
                        "src": "${icons_route}windows/LargeTile.scale-200.png",
                        "sizes": "620x620"
                    },
                    {
                        "src": "${icons_route}windows/LargeTile.scale-400.png",
                        "sizes": "1240x1240"
                    },
                    {
                        "src": "${icons_route}windows/Square44x44Logo.scale-100.png",
                        "sizes": "44x44"
                    },
                    {
                        "src": "${icons_route}windows/Square44x44Logo.scale-125.png",
                        "sizes": "55x55"
                    },
                    {
                        "src": "${icons_route}windows/Square44x44Logo.scale-150.png",
                        "sizes": "66x66"
                    },
                    {
                        "src": "${icons_route}windows/Square44x44Logo.scale-200.png",
                        "sizes": "88x88"
                    },
                    {
                        "src": "${icons_route}windows/Square44x44Logo.scale-400.png",
                        "sizes": "176x176"
                    },
                    {
                        "src": "${icons_route}windows/StoreLogo.scale-100.png",
                        "sizes": "50x50"
                    },
                    {
                        "src": "${icons_route}windows/StoreLogo.scale-125.png",
                        "sizes": "63x63"
                    },
                    {
                        "src": "${icons_route}windows/StoreLogo.scale-150.png",
                        "sizes": "75x75"
                    },
                    {
                        "src": "${icons_route}windows/StoreLogo.scale-200.png",
                        "sizes": "100x100"
                    },
                    {
                        "src": "${icons_route}windows/StoreLogo.scale-400.png",
                        "sizes": "200x200"
                    },
                    {
                        "src": "${icons_route}windows/SplashScreen.scale-100.png",
                        "sizes": "620x300"
                    },
                    {
                        "src": "${icons_route}windows/SplashScreen.scale-125.png",
                        "sizes": "775x375"
                    },
                    {
                        "src": "${icons_route}windows/SplashScreen.scale-150.png",
                        "sizes": "930x450"
                    },
                    {
                        "src": "${icons_route}windows/SplashScreen.scale-200.png",
                        "sizes": "1240x600"
                    },
                    {
                        "src": "${icons_route}windows/SplashScreen.scale-400.png",
                        "sizes": "2480x1200"
                    },
                    {
                        "src": "${icons_route}windows/Square44x44Logo.targetsize-16.png",
                        "sizes": "16x16"
                    },
                    {
                        "src": "${icons_route}windows/Square44x44Logo.targetsize-20.png",
                        "sizes": "20x20"
                    },
                    {
                        "src": "${icons_route}windows/Square44x44Logo.targetsize-24.png",
                        "sizes": "24x24"
                    },
                    {
                        "src": "${icons_route}windows/Square44x44Logo.targetsize-30.png",
                        "sizes": "30x30"
                    },
                    {
                        "src": "${icons_route}windows/Square44x44Logo.targetsize-32.png",
                        "sizes": "32x32"
                    },
                    {
                        "src": "${icons_route}windows/Square44x44Logo.targetsize-36.png",
                        "sizes": "36x36"
                    },
                    {
                        "src": "${icons_route}windows/Square44x44Logo.targetsize-40.png",
                        "sizes": "40x40"
                    },
                    {
                        "src": "${icons_route}windows/Square44x44Logo.targetsize-44.png",
                        "sizes": "44x44"
                    },
                    {
                        "src": "${icons_route}windows/Square44x44Logo.targetsize-48.png",
                        "sizes": "48x48"
                    },
                    {
                        "src": "${icons_route}windows/Square44x44Logo.targetsize-60.png",
                        "sizes": "60x60"
                    },
                    {
                        "src": "${icons_route}windows/Square44x44Logo.targetsize-64.png",
                        "sizes": "64x64"
                    },
                    {
                        "src": "${icons_route}windows/Square44x44Logo.targetsize-72.png",
                        "sizes": "72x72"
                    },
                    {
                        "src": "${icons_route}windows/Square44x44Logo.targetsize-80.png",
                        "sizes": "80x80"
                    },
                    {
                        "src": "${icons_route}windows/Square44x44Logo.targetsize-96.png",
                        "sizes": "96x96"
                    },
                    {
                        "src": "${icons_route}windows/Square44x44Logo.targetsize-256.png",
                        "sizes": "256x256"
                    },
                    {
                        "src": "${icons_route}windows/Square44x44Logo.altform-unplated_targetsize-16.png",
                        "sizes": "16x16"
                    },
                    {
                        "src": "${icons_route}windows/Square44x44Logo.altform-unplated_targetsize-20.png",
                        "sizes": "20x20"
                    },
                    {
                        "src": "${icons_route}windows/Square44x44Logo.altform-unplated_targetsize-24.png",
                        "sizes": "24x24"
                    },
                    {
                        "src": "${icons_route}windows/Square44x44Logo.altform-unplated_targetsize-30.png",
                        "sizes": "30x30"
                    },
                    {
                        "src": "${icons_route}windows/Square44x44Logo.altform-unplated_targetsize-32.png",
                        "sizes": "32x32"
                    },
                    {
                        "src": "${icons_route}windows/Square44x44Logo.altform-unplated_targetsize-36.png",
                        "sizes": "36x36"
                    },
                    {
                        "src": "${icons_route}windows/Square44x44Logo.altform-unplated_targetsize-40.png",
                        "sizes": "40x40"
                    },
                    {
                        "src": "${icons_route}windows/Square44x44Logo.altform-unplated_targetsize-44.png",
                        "sizes": "44x44"
                    },
                    {
                        "src": "${icons_route}windows/Square44x44Logo.altform-unplated_targetsize-48.png",
                        "sizes": "48x48"
                    },
                    {
                        "src": "${icons_route}windows/Square44x44Logo.altform-unplated_targetsize-60.png",
                        "sizes": "60x60"
                    },
                    {
                        "src": "${icons_route}windows/Square44x44Logo.altform-unplated_targetsize-64.png",
                        "sizes": "64x64"
                    },
                    {
                        "src": "${icons_route}windows/Square44x44Logo.altform-unplated_targetsize-72.png",
                        "sizes": "72x72"
                    },
                    {
                        "src": "${icons_route}windows/Square44x44Logo.altform-unplated_targetsize-80.png",
                        "sizes": "80x80"
                    },
                    {
                        "src": "${icons_route}windows/Square44x44Logo.altform-unplated_targetsize-96.png",
                        "sizes": "96x96"
                    },
                    {
                        "src": "${icons_route}windows/Square44x44Logo.altform-unplated_targetsize-256.png",
                        "sizes": "256x256"
                    },
                    {
                        "src": "${icons_route}windows/Square44x44Logo.altform-lightunplated_targetsize-16.png",
                        "sizes": "16x16"
                    },
                    {
                        "src": "${icons_route}windows/Square44x44Logo.altform-lightunplated_targetsize-20.png",
                        "sizes": "20x20"
                    },
                    {
                        "src": "${icons_route}windows/Square44x44Logo.altform-lightunplated_targetsize-24.png",
                        "sizes": "24x24"
                    },
                    {
                        "src": "${icons_route}windows/Square44x44Logo.altform-lightunplated_targetsize-30.png",
                        "sizes": "30x30"
                    },
                    {
                        "src": "${icons_route}windows/Square44x44Logo.altform-lightunplated_targetsize-32.png",
                        "sizes": "32x32"
                    },
                    {
                        "src": "${icons_route}windows/Square44x44Logo.altform-lightunplated_targetsize-36.png",
                        "sizes": "36x36"
                    },
                    {
                        "src": "${icons_route}windows/Square44x44Logo.altform-lightunplated_targetsize-40.png",
                        "sizes": "40x40"
                    },
                    {
                        "src": "${icons_route}windows/Square44x44Logo.altform-lightunplated_targetsize-44.png",
                        "sizes": "44x44"
                    },
                    {
                        "src": "${icons_route}windows/Square44x44Logo.altform-lightunplated_targetsize-48.png",
                        "sizes": "48x48"
                    },
                    {
                        "src": "${icons_route}windows/Square44x44Logo.altform-lightunplated_targetsize-60.png",
                        "sizes": "60x60"
                    },
                    {
                        "src": "${icons_route}windows/Square44x44Logo.altform-lightunplated_targetsize-64.png",
                        "sizes": "64x64"
                    },
                    {
                        "src": "${icons_route}windows/Square44x44Logo.altform-lightunplated_targetsize-72.png",
                        "sizes": "72x72"
                    },
                    {
                        "src": "${icons_route}windows/Square44x44Logo.altform-lightunplated_targetsize-80.png",
                        "sizes": "80x80"
                    },
                    {
                        "src": "${icons_route}windows/Square44x44Logo.altform-lightunplated_targetsize-96.png",
                        "sizes": "96x96"
                    },
                    {
                        "src": "${icons_route}windows/Square44x44Logo.altform-lightunplated_targetsize-256.png",
                        "sizes": "256x256"
                    },
                    {
                        "src": "${icons_route}android/android-launchericon-512-512.png",
                        "sizes": "512x512"
                    },
                    {
                        "src": "${icons_route}android/android-launchericon-192-192.png",
                        "sizes": "192x192"
                    },
                    {
                        "src": "${icons_route}android/android-launchericon-144-144.png",
                        "sizes": "144x144"
                    },
                    {
                        "src": "${icons_route}android/android-launchericon-96-96.png",
                        "sizes": "96x96"
                    },
                    {
                        "src": "${icons_route}android/android-launchericon-72-72.png",
                        "sizes": "72x72"
                    },
                    {
                        "src": "${icons_route}android/android-launchericon-48-48.png",
                        "sizes": "48x48"
                    },
                    {
                        "src": "${icons_route}ios/16.png",
                        "sizes": "16x16"
                    },
                    {
                        "src": "${icons_route}ios/20.png",
                        "sizes": "20x20"
                    },
                    {
                        "src": "${icons_route}ios/29.png",
                        "sizes": "29x29"
                    },
                    {
                        "src": "${icons_route}ios/32.png",
                        "sizes": "32x32"
                    },
                    {
                        "src": "${icons_route}ios/40.png",
                        "sizes": "40x40"
                    },
                    {
                        "src": "${icons_route}ios/50.png",
                        "sizes": "50x50"
                    },
                    {
                        "src": "${icons_route}ios/57.png",
                        "sizes": "57x57"
                    },
                    {
                        "src": "${icons_route}ios/58.png",
                        "sizes": "58x58"
                    },
                    {
                        "src": "${icons_route}ios/60.png",
                        "sizes": "60x60"
                    },
                    {
                        "src": "${icons_route}ios/64.png",
                        "sizes": "64x64"
                    },
                    {
                        "src": "${icons_route}ios/72.png",
                        "sizes": "72x72"
                    },
                    {
                        "src": "${icons_route}ios/76.png",
                        "sizes": "76x76"
                    },
                    {
                        "src": "${icons_route}ios/80.png",
                        "sizes": "80x80"
                    },
                    {
                        "src": "${icons_route}ios/87.png",
                        "sizes": "87x87"
                    },
                    {
                        "src": "${icons_route}ios/100.png",
                        "sizes": "100x100"
                    },
                    {
                        "src": "${icons_route}ios/114.png",
                        "sizes": "114x114"
                    },
                    {
                        "src": "${icons_route}ios/120.png",
                        "sizes": "120x120"
                    },
                    {
                        "src": "${icons_route}ios/128.png",
                        "sizes": "128x128"
                    },
                    {
                        "src": "${icons_route}ios/144.png",
                        "sizes": "144x144"
                    },
                    {
                        "src": "${icons_route}ios/152.png",
                        "sizes": "152x152"
                    },
                    {
                        "src": "${icons_route}ios/167.png",
                        "sizes": "167x167"
                    },
                    {
                        "src": "${icons_route}ios/180.png",
                        "sizes": "180x180"
                    },
                    {
                        "src": "${icons_route}ios/192.png",
                        "sizes": "192x192"
                    },
                    {
                        "src": "${icons_route}ios/256.png",
                        "sizes": "256x256"
                    },
                    {
                        "src": "${icons_route}ios/512.png",
                        "sizes": "512x512"
                    },
                    {
                        "src": "${icons_route}ios/1024.png",
                        "sizes": "1024x1024"
                    }
                ]
            } `
        }
        */
    }
    //CREA UN OBJETO QUE CONTENDRA LA TRANFORMACION DE EL MANIFEST A UN BLOB
    const blob = new Blob([manifest_pwa_app], {type: 'application/json'});
    //DECLARA OTRO OBJETO QUE GUARDARA LA URL RESULTANTE DE PASARLE COMO PARAMETRO UN OBJETO A LA FUNCION createObjectURL()
    const manifestURL   = URL.createObjectURL(blob);
    //REEMPLAZA EL HREF DE UN ITEM SEGUN SU ID, LO REEMPLAZA POR UNA URL QUE CONTENDRA EL MANIFEST ANTERIOR
    $('#manifest_apex212').attr('href', manifestURL)
})
//SE CREA UNA CONSTANTE QUE CONTENDRA LA RUTA DEL SERVICE WORKER 
const nameSw = '/sw_safix.js';
/**
 * @namespace pwa
 **/
//SE DECLARA EL ARREGLO PWA QUE SERVIRA PARA ALMACENAR DIFERENTES METODOS
var pwa = {};
/**
 * @module pwa.init
 * @example pwa.init();
 * Se llama cuando la página cargue.
 * Es usado para registrar el service worker.
 **/
//OBJETO PWA, METODO INIT
pwa.init = function () {
	// Validar si el serviceWorker esta disponible en el navegador
	if ('serviceWorker' in navigator) {
        // Si esta disponible en el navegador, procede a registrar el sw(service worker)
        navigator.serviceWorker.register(nameSw).then(function (registeredServiceWorker) {
            //RESPUESTA
            console.log('[XENCO] Service worker registrado correctamente!');
            apexServiceWorker = registeredServiceWorker;

            /**
             * Funcionalidad offline
             */
			//Actualizar páginas en cache
            //VALIDA SI EL NAVEGADOR SE ENCUENTRAN CONECTADO A INTERNET
			if(navigator.onLine){
				// Consulta ó creación de la cache estatica donde se guardan las páginas
				let cache_st = caches.open('static-cache')
				// Obtener la cache de la siguiente forma
				cache_st.then(function(c){
					// Obtener las páginas dentro de la cache
					c.keys().then(function(r) {
						// Obtener la sesión en la que el usuario se logueo
						localforage.getItem('session').then(function(ses){
							// Números de las páginas que se guardan en cache
							let paginas = ['296','297','323','324','328','330','333','337','338','339','340','341','342','343','345','347','348','349','350','426','10064']
							/* Obtener la estructura que tienen las url () 
								origin: "https://redminexenco.com.co:8082"
								pathname: "/apex212/f"
								search: "?p=105:numero_pagina:id_session:::::
							*/
							let pr = new URL(window.location.href)
							// Eliminar las páginas que se guardaron anteriormente en el cache static_fie
							r.map(e => {
                                //ELIMINA LA PAGINA EN CONCRETO EN EL CACHE
								c.delete(e)
							})
                            //DECLARA EL OBJETO SEAR
                            //SE TOMA EL VALOR DE SEARCH QUE ES UN ELEMENTO DENTRO DE PR
                            //A EL ELEMENTO SEARCH SE LE LLAMA LA FUNCION SPLIT, QUE SEPARA EN ELEMENTO DISTINTOS CADA QUE ENCUENTRE LOS ':'
                            //AL FINAL EL ARREGLO RESULTANTE SE LO PASAN AL OBJETO SEAR
                            let sear = pr.search.split(':')
                            //REEMPLAZA EL VALOR ACTUAL DEL ELEMENTO EN POSICION 2 POR EL VALOR DE SES(LA SESSION PROVENIENTE DEL LOCALFORAGE)
                            sear[2] = ses
							//RECORRE LAS PAGINAS DECLARADAS Y UNA POR UNA REALIZA LO SIGUIENTE
							paginas.forEach(e => {
								//let sear = pr.search.split(':')
								//REEMPLAZA EL VALOR ACTUAL DEL ELEMENTO EN POSICION 1 POR EL VALOR DE E(EL NUMERO DE LA PAGINA)
								sear[1] = e
                                //sear[2] = $v('pInstance')
                                //REEMPLAZA EL VALOR ACTUAL DEL ELEMENTO EN POSICION 6 POR UN ESPACIO VACIO 
								sear[6] = ''
                                //REEMPLAZA EL VALOR ACTUAL DEL ELEMENTO EN POSICION 7 POR UN ESPACIO VACIO
								sear[7] = ''
                                //ESTE CODIGO AÑADE EL NUMERO URL A EL CACHE ESTATICO
								c.add(pr.origin + pr.pathname + sear.join(':'))
							})
						})
					})
				})
			}
		}).catch(function (err) {
				console.error('[XENCO] Service worker fallo en el registro.', err);
		});

		// Recibe un mensaje del service worker en caso de alguna alerta
		navigator.serviceWorker.addEventListener('message', function (event) {
			if (event.data.refreshReportIds) {
				for (var key in event.data.refreshReportIds) {
					if (event.data.refreshReportIds.hasOwnProperty(key)) {X	
						apex.region(event.data.refreshReportIds[key]).refresh();
						console.log(event, key)
					}
				}
			}
		});

	} else {
		console.warn('Service workers no esta disponible en este navegador.');
		// pwa.ui.refresh();
	}
};

/**
 * @module pwa.install
 * @example pwa.install();
 **/
 //OBJETO PWA, METODO ISNTALL
pwa.install = function () {
    //SI EXISTE LA VARIBLE ENTONCES
    //if (deferredPrompt) {
        //SACA UN "ALERTA" EN LA QUE EL USUARIO DEBERA ACEPTAR O RECHAZAR LA INSTALACION
        deferredPrompt.prompt();
        //SI EL OBJETO OBTUVO RESPUESTA DEL USAURIO(SELECIONO ALGUNA DE LAS 2 OPCIONES)
        deferredPrompt.userChoice.then((choiceResult) => {
            //SI EL MENSAJE RESULTANTE DE LA ELECION ES ACCEPTED(ACEPTO INSTALACION)
            if (choiceResult.outcome === 'accepted') {
                console.log('El usuario ha aceptado la instalación');
            } else {
                console.log('El usuario ha rechazado la instalación');
            }
            //LE DA EL VALOR NULL A LA VARIABLE
            deferredPrompt = null;
            // document.getElementById('installBtn').style.display = 'none';
        });
    //}
    //console.log('no entra');

	// Show the installation prompt, using the global variable previously set
	// installPrompt.prompt();
	// // Wait for the user to respond to the prompt
	// installPrompt.userChoice
	// 	.then(function (choiceResult) {
	// 		console.log('[XENCO] User instalando la aplicacion ' + choiceResult.outcome);
	// 		// Reset the install prompt
	// 		installPrompt = null;
	// 		// pwa.ui.refresh();
	// 	});
};

/**
 * @module pwa.event
 **/
//OBJETO PWA, METODO EVENT
pwa.event = {
	/**
	 * @function online
	 * @example pwa.event.online
	 * Show a message to the user that he's back online
	 **/
    //FUNCION ONLINE, LEE EL ESTADO DE ONLINE
	online: function () {
		//SI ESTA ONLINE MUESTRA EL SIGUIENTE MENSAJE
        apex.message.showPageSuccess('Estas online!');
	},

	/**
	 * @function offline
	 * @example pwa.event.offline
	 * Show a message to the user that he's lost connection
	 **/
    //FUNCION OFFLINE, LEE EL ESTADO DE OFFLINE
	offline: function () {
        //ELIMINA EL ITEM QUE TENGA EL SIGUIENTE ID
		$('#t_Alert_Success').remove();
        //LIMPIA LOS ERRORES ANTERIORES
		apex.message.clearErrors();
        //MUESTRA UNA MENSAJE SEÑALANDO QUE SE ENCUENTRA OFFLINE
		apex.message.showErrors([{
			type: 'error',
			location: 'page',
			message: 'Conexión perdida'
		}]);
	},

	/**
	 * @function beforeinstallprompt
	 * @example pwa.event.beforeinstallprompt
	 * This event will be triggered after installation criteria are met
	 **/
	beforeinstallprompt: function (event) {
		// Stop the automatic installation prompt
		event.preventDefault();
		deferredPrompt = event;
		// Store the event in a global variable so it can be triggered later
		installPrompt = event;
		// pwa.ui.refresh();
        $(`.hide_download_app`).removeClass('hide_download_app')
	},

	/**
	 * @function appinstalled
	 * @example pwa.event.appinstalled
	 * This event will be triggered after the app is installed
	 **/
	appinstalled: function (event) {
		console.log('[XENCO] Aplicacion instalada', event);
        $(`.hide_download_app`).removeClass('hide_download_app')
	}
};
/**
 * IIFE (Immediately-Invoked Function Expression)
 **/
(function () {
	window.addEventListener('online', function(){
		pwa.event.online()
		pwa.historias.guardar()
	} );
	window.addEventListener('offline', pwa.event.offline);
	window.addEventListener('beforeinstallprompt', pwa.event.beforeinstallprompt);
	window.addEventListener('appinstalled', pwa.event.appinstalled);
})();

$(document).ready(function () {
    if(![`9999`, `10064`].indexOf($v(`pFlowStepId`))) pwa.init()
    $('.t-TabsRegion-items').attr('style', '')
});


/**
 * @module pwa.login
 **/
////OBJETO PWA, METODO LOGIN
pwa.login = {
	/**
	 * Logea al aplicativo offline
	 * @function pwa.login.logear()
	 * @returns 
	 */
    //FUNCION LOGGGEAR
	logear : function(){
		// ENCRIPTA EL USERNAME QUE EL USUARIO INGRESE Y LUEGO LO GUARDA EN UNA VARIABLE, SE ENCRIPTA POR MEDIO DE LA LIBREARIA MD5, USANDO LA FUNCION MD5
		let us = md5($(`#P${$v('pFlowStepId')}_USERNAME`).val().toUpperCase())
        //INGRESA A EL REGISTRO EN EL ELEMENTO LOG DEL LOCALFORAGE
        return localforage.getItem('log').then(function(datos){
            //DEL ARREGLO DATOS BUSCA LA POSICION CON NOMBRE IGUAL A EL VALOR DE LA VARIABLE US Y VALIDA
            //SI EL ARREGLO DATOS(QUE CONTIENE COMO NOMBRE DE LA POSICON US Y EL VALOR SIENDO IGUAL A LA CLAVE)
            //TIENE COMO VALOR LO MISMO QUE LA CLAVE INGRESADA POR EL USUARIO ENTONCES
            if(datos[us] ==  md5($(`#P${$v('pFlowStepId')}_PASSWORD`).val().toUpperCase()) ){
                //ELIMINA EL ITEM ANTERIOR EN EL LOCALFORAGE
				localforage.removeItem('ses')
                //VUELVE A CREAR EL ITEM PERO CON EL ELEMNTO USUARIO IGUAL A US Y LA SESSION EN TRUE
				localforage.setItem('ses', {
					"usuario" : us,
					"session" : true
				})
                //RETORNA TRUE
                return true;
            }
            //RETORNA FALSE
            return false;
        })
    },

	/**
	 * Valida si esta logeado
	 * @function pwa.login.session()
	 * @returns 
	 */
	session : function(){
		localforage.getItem('ses').then(function(session){
			if(!session){
			    localforage.getItem('session').then(function(sesi){
					location.replace(`https://redminexenco.com.co:8082/apex212/f?p=105:10064:${sesi}:::::`)
				})
			}
		})
	}
}




// /**
//  * @module pwa.historias
//  **/
// pwa.historias = {
// 	/**
// 	 * @function 
// 	 * @example pwa.historias.consultar;
// 	 **/
// 	consultar : function(){
		
// 		apex.item('P175_HORA_REMICION').setValue(new Date().toLocaleString('es-CO', { hour: 'numeric', minute: 'numeric', second : 'numeric',  hour12: false }).replace(' p. m.', '').replace(' a. m.', ''))
//  		apex.item('P175_FECHA_REMICION').setValue(new Date().toLocaleString('es-CO', { day: 'numeric', month: 'numeric', year : 'numeric' }).replace(' p. m.', '').replace(' a. m.', ''))

// 		if(navigator.onLine){    
// 			apex.submit()
// 		}else{

// 			localforage.getItem('usuarios').then(function(usuarios){
// 				let usuario = usuarios.find(e => e.doc == $('#P175_DNI').val())

// 				apex.item('P175_TDNI').setValue(usuario.tipo_doc)
// 				apex.item('P175_ADMISION').setValue(usuario.admision)
// 				apex.item('P175_HISTORIA').setValue(usuario.historia)
// 				apex.item('P175_NOMBRES').setValue(usuario.nombre)
// 				apex.item('P175_EDAD').setValue(usuario.edad)
// 				apex.item('P175_ENFERMEDAD').setValue(usuario.enfermedad)
// 				apex.item('P175_ENTIDAD').setValue(usuario.entidad)
// 				apex.item('P175_UH').setValue(usuario.uh)
// 				apex.item('P175_FUNCIONARIO').setValue(usuario.profesional)
// 				apex.item('P175_CARGO').setValue(usuario.cargo)
// 				apex.item('P175_AMBULANCIA').setValue(usuario.ambulancia)
// 				apex.item('P175_CONDUCTOR').setValue(usuario.conductor)
// 				apex.item('P175_TRIPULANTE').setValue(usuario.tripulante)
// 				apex.item('P175_LINEA').setValue(usuario.linea)
// 				apex.item('P175_ADMISION').setValue(usuario.admision)
// 				apex.item('P175_NUMERO_HISTORIA').setValue(usuario.historia)
// 				apex.item('P175_LINEA_HISTORIA').setValue(usuario.linea_historia)

// 				// Nuevos campos
// 				apex.item('P175_DIAG_REL').setValue(usuario.diagnostico_re)
// 				apex.item('P175_SOLICITANTE').setValue(usuario.solicitante)
// 				apex.item('P175_FECHA_SOLICI').setValue(usuario.fecha_soli)
// 				apex.item('P175_HORA_SOLICI').setValue(usuario.hora_soli)
// 				apex.item('P175_DOC_CONDUC').setValue(usuario.doc_conductor)
// 				apex.item('P175_DOC_TRIPULANTE').setValue(usuario.doc_tripulante)
// 				apex.item('P175_FECHA_TRAS').setValue(usuario.fecha_traslado)
// 				apex.item('P175_HORA_TRAS').setValue(usuario.hora_traslado)
				
// 			})
// 		}
// 	},
// 	/**
// 	 * @function 
// 	 * @example pwa.historias.agregar();
// 	 **/
// 	agregar : function(){

// 		// Validar que no este nulo	
// 		if($('#P175_DNI').val()){

// 			// GUARDAR DATOS DE HISTORIA EN EL INDEX DB
// 			localforage.getItem('historias').then(function(historias){
// 				let hi = {

// 					'linea'             : apex.item('P175_LINEA').getValue(),
// 					'admision'          : apex.item('P175_ADMISION').getValue(),
// 					'historia'          : apex.item('P175_NUMERO_HISTORIA').getValue(),
// 					'lineah'            : apex.item('P175_LINEA_HISTORIA').getValue(),
					
						
// 					'hora'				: apex.item('P175_FECHA_REMICION').getValue(),
// 					'hora'				: apex.item('P175_HORA_REMICION').getValue(),

// 					'acompannante'      : apex.item('P175_ACOMPANA').getValue(),
// 					'dni_acompannante'  : apex.item('P175_DNI_ACOMPANA').getValue(),
// 					'parentesco'        : apex.item('P175_PARENTESCO').getValue(),
// 					'auxiliar'          : apex.item('P175_AUXIILIAR').getValue(),
// 					'otro'              : apex.item('P175_OTRO').getValue(),
	
// 					'tipo_servicio'     : apex.item('P175_TIPO_SERVI').getValue(),
// 					'cualdx'            : apex.item('P175_CUALDX').getValue(),
// 					'presion_sistolica' : apex.item('P175_PRESIONS').getValue(),
// 					'presion_diastolica': apex.item('P175_PRESIOND').getValue(),
// 					'pulso'             : apex.item('P175_PULSO').getValue(),
// 					'fcia_respira'      : apex.item('P175_FRESPIRA').getValue(),
// 					'temperatura'       : apex.item('P175_TEMPERATURA').getValue(),
// 					'sat_co2'           : apex.item('P175_SAT_CON_O2').getValue(),
// 					'sat_so2'           : apex.item('P175_SAT_SIN_O2').getValue(),
// 					'fcf'               : apex.item('P175_FCF').getValue(),
// 					'dilatacion'        : apex.item('P175_DILATACION').getValue(),
// 					'estado_conciencia' : apex.item('P175_ESTADO_CONCIENCIA').getValue(),
// 					'glasgow'           : apex.item('P175_GLASGOW').getValue(),
// 					'cambios_clinicos'  : apex.item('P175_CAMBIOS_TRASLADO').getValue(),
// 					'cambios_registro'  : apex.item('P175_CAMBIOS_REGISTRADOS').getValue(),

// 					'downton'  			: apex.item('P175_DOWNTON').getValue(),
// 					'caidas_previas'  	: apex.item('P175_CAIDAS_PREV').getValue(),
// 					'medicamentos'  	: apex.item('P175_MEDICAMENTOS').getValue(),
// 					'defic_sensoriales' : apex.item('P175_DEFSENSORIALES').getValue(),
// 					'estado_mental'  	: apex.item('P175_ESTADOMENTAL').getValue(),
// 					'deambulacion'  	: apex.item('P175_DEAMBULACION').getValue(),
// 					'estado_clinico'  	: apex.item('P175_ESTADOCLINICO').getValue(),	
// 					'medidas_prevencion': apex.item('P175_CONOCIMIENTOMEDIDAS').getValue(),

// 					//DESPLAZAMIENTO
// 					'presencia_unidad' 		: apex.item('P175_PRESENCIA_UH').getValue(),
// 					'recepcion_paciente' 	: apex.item('P175_RECEPCION_PACIENTE').getValue(),
// 					'salida_ips' 			: apex.item('P175_SALIDA_IPS').getValue(),
// 					'presencia_ips' 		: apex.item('P175_PRESENCIA_IPS').getValue(),
// 					'entrega_ips' 			: apex.item('P175_ENTREGA_PACI_IPS').getValue(),
// 					'reporte_dispo' 		: apex.item('P175_REPORTE_DISPONIBILIDAD').getValue(),

// 					'h_presencia_unidad' 	: apex.item('P175_PRESENCIA_IPS_HORA').getValue(),
// 					'h_recepcion_paciente' 	: apex.item('P175_RECEPCION_PACIENTE_HORA').getValue(),
// 					'h_salida_ips' 			: apex.item('P175_SALIDA_IPS_HORA').getValue(),
// 					'h_presencia_ips' 		: apex.item('P175_PRESENCIA_IPS_HORA').getValue(),
// 					'h_entrega_ips'			: apex.item('P175_ENTREGA_PACI_IPS_HORA').getValue(),
// 					'h_reporte_dispo' 		: apex.item('P175_REPORTE_DISPONIBILIDAD_HO').getValue(),
// 					'user_connect' 			: apex.item('P175_USERCON').getValue()

// 					}
// 				if(historias){
// 					historias.push(hi)
// 					localforage.setItem('historias', historias)
// 					console.log('[XENCO] agregando a historias..', historias)
// 				}else{
// 					localforage.setItem('historias', [hi])
// 				}
// 			})

// 			// GUARDAR DATOS DE REFERENCIA (FIRMAS ETC...) EN EL INDEX DB
// 			localforage.getItem('referencias').then(function(referencias){
// 				document.getElementById('E_signature_canvas').toBlob(function(fe) {
// 					document.getElementById('R_signature_canvas').toBlob(function(fr) {
// 						document.getElementById('A_signature_canvas').toBlob(function(fa) {


// 							let ref =  {
// 								'remision'        : apex.item('P175_LINEA').getValue(),
// 								'admision'        : apex.item('P175_ADMISION').getValue(),
								
// 								'hospital'        : apex.item('P175_INST_RECIBE').getValue(),
// 								'funcionario'     : apex.item('P175_FUNCIONARIO_RECIBE').getValue(),
// 								'cargo'           : apex.item('P175_CARGOF_RECIBE').getValue(),
// 								'observaciones'   : apex.item('P175_OBSERVACIONES').getValue(),
// 								// 'hora_llegada'    : apex.item('P175_HORA_LL').getValue(),
// 								// 'hora_aceptacion' : apex.item('P175_HORA_AC').getValue(),

// 								'firma_e' : fe,
// 								'firma_r' : fr,
// 								'firma_a' : fa
// 							}

// 							if(referencias){
// 								referencias.push(ref)
// 								localforage.setItem('referencias', referencias)
// 								console.log('[XENCO] agregando a referencias..', referencias)
// 							}else{
// 								localforage.setItem('referencias', [ref] )
// 							}

// 						}, "image/jpeg", 1)
// 					}, "image/jpeg", 1)
// 				}, "image/jpeg", 1)
// 			})

// 			// Validar cuando se encuentre online y guardar directamente
// 			if(navigator.onLine){
// 				console.log('[XENCO] Intentando guardar en modo online validacion')
// 				apex.message.showPageSuccess('Guardando...');
// 				setTimeout( () => { pwa.historias.guardar() }, 3000)
// 			}else{
// 				console.log('[XENCO] Guardando como pendiente')
// 				apex.message.showPageSuccess('Se esta guardando como pendiente!');
// 				setTimeout( () => { pwa.historias.limpiar() }, 2000)
// 			}
//         }
// 	},
// 	/**
// 	 * @function 
// 	 * @example pwa.historias.guardar();
// 	 **/
// 	guardar : function(){

// 		console.log('[XENCO] Intentando guardar..')

// 		localforage.getItem('historias').then(function(historias){
//             if(historias){
// 				historias.forEach(function(hist){
// 					var url = 'xenco/ambulancia/pwa/guardar'
// 					var opciones = {
// 						method: 'PUT',
// 						body: JSON.stringify(hist)
// 					}
// 					fetch(url, opciones)
// 					.then(function () {
// 						localforage.removeItem('historias')
// 						console.log('[XENCO] se ha guardado la historia')

// 						localforage.getItem('referencias').then(function(referencia){
// 							if(referencia){
// 								referencia.forEach(function(ref){
// 									var urli = `xenco/ambulancia/pwa/guardar_imagen?ADMISION=${ref.admision}&LINEA=${ref.remision}`
				
// 									var urlf = 'xenco/ambulancia/pwa/guardar_referencia'
// 									var opciones = {
// 										method: 'PUT',
// 										body: JSON.stringify(ref)
// 									}
				
// 									fetch(urli + '&TIPO=E', {
// 										method: 'PUT',
// 										body : ref.firma_e
// 									})
									
// 									fetch(urli + '&TIPO=R', {
// 										method: 'PUT',
// 										body : ref.firma_r
// 									})
				
// 									fetch(urli + '&TIPO=A', {
// 										method: 'PUT',
// 										body : ref.firma_a
// 									})
									
									
// 									fetch(urlf, opciones)
// 									.then(function () {
// 										localforage.removeItem('referencias')
// 										apex.message.showPageSuccess('Se ha guardado!');
// 										console.log('[XENCO] Se ha guardado')
										
// 										if(navigator.onLine){
// 											console.log('[XENCO] limpiando..' , )
// 											localforage.removeItem('recuperar')
// 											setTimeout(() => {
// 												$('#LIMPIAR_DATOS').click()
// 											}, 3000)
// 										}

// 									}).catch(function (err) {
// 										console.error('[XENCO] Error en el fetch ' + urlf + opciones, err);
// 										apex.message.clearErrors();
// 										apex.message.showErrors([{
// 											type: 'error',
// 											location: 'page',
// 											message: '[R] Error al guardar'
// 										}]);
// 									}); 
// 								})
// 							}
// 						})
						
// 					}).catch(function (err) {
// 						apex.message.clearErrors();
// 						apex.message.showErrors([{
// 							type: 'error',
// 							location: 'page',
// 							message: '[H] Error al guardar'
// 						}]);
// 						console.error('[XENCO] Error en el fetch ' + url + opciones, err);
// 					});
// 				})
//             }
//         })

// 	},
// 	/**
// 	 * @function 
// 	 * @example pwa.historias.limpiar();
// 	 **/
// 	limpiar : function(){
// 		console.log('[XENCO] limpiando los datos recuperados..' , )
// 		localforage.removeItem('recuperar')
// 		setTimeout(() => {
// 			location.reload()
// 		}, 2000);
// 	}
// };

// /**
//  * @module pwa.funciones
//  */
// pwa.funciones = {
// 	blobPng: function (canvas) {
// 		var img = new Image();
// 		img.src = canvas.toDataURL("image/jpeg");
// 		fetch(img.src) 
// 		.then(function (response) {
// 			return response.blob();
// 		})
// 		.then(function (blob) {
// 			return blob
// 		});

// 	}
// }

/**
 * 
 * END PROGRESIVE WEB APP (PWA)
 * 
**/