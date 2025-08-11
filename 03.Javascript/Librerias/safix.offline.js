const managmentOffline = {};

safix.offline = managmentOffline;

/**
 * @module managmentOffline.ArmarParametrosOffline
 **/
managmentOffline.ArmarParametrosOffline = (accion) => {
    let datos = {}

    $('input[id^="P' + paginaActual + '"]').each((i, it) => {
        datos[it.id.replaceAll('|input', ``).replaceAll('_input', ``)] = $v(it);
    });

    $('select[id^="P' + paginaActual + '"]').each((i, it) => {
        datos[it.id.replaceAll('|input', ``).replaceAll('_input', ``)] = $v(it);
    });

    $('.radio_group[id^="P' + paginaActual + '"]').each((i, it) => {
        datos[it.id.replaceAll('|input', ``).replaceAll('_input', ``)] = $v(it);
    });

    $('textarea[id^="P' + paginaActual + '"]').each((i, it) => {
        datos[it.id.replaceAll('|input', ``).replaceAll('_input', ``)] = $v(it);
    });

    let objectoCompleto = {
        "idAplicacion": aplicacionActual,
        "idPagina": paginaActual,
        "accion": accion,
        "items": datos
    };

    safix.procesos.mensajesConsola.log('Recoleccion de información', objectoCompleto);
    return objectoCompleto;
};

managmentOffline.validarConexion = (accion) => {
    const items = managmentOffline.ArmarParametrosOffline(accion);
    if (navigator.onLine) {
        apex.submit({
            request:accion,
            set: items.items
        })
    } else {
        apex.message.clearErrors();
        apex.message.showErrors([{
            type: 'error',
            location: 'page',
            message: 'No hay conexión a internet. Los datos se guardarán offline.'
        }]);
        managmentOffline.guardarDatosOffline(items);
    }
}

managmentOffline.guardarDatosOffline = (items) => {
    const request = indexedDB.open(safix.IndexDB.dbName, safix.IndexDB.dbVersion);  
    request.onupgradeneeded = function(event) {
        const db = event.target.result;
        if (!db.objectStoreNames.contains(safix.IndexDB.storeName)) {
            db.createObjectStore(safix.IndexDB.storeName, { autoIncrement: true });
        }
    };
    request.onsuccess = function(event) {
        const db = event.target.result;
        if (!db.objectStoreNames.contains(safix.IndexDB.storeName)) {
            console.log(`El object store '${safix.IndexDB.storeName}' no existe aún.`);
            apex.message.showErrors([{
                type: 'error',
                location: 'page',
                message: `El almacenamiento offline no está listo. Por favor intenta más tarde.`
            }]);
            return;
        }
        const tx = db.transaction(safix.IndexDB.storeName, 'readwrite');
        const store = tx.objectStore(safix.IndexDB.storeName);
        store.add(items);
        apex.message.clearErrors();
        apex.message.showPageSuccess('Registro guardado localmente');

        mostrarRegistrosOffline();
    };
};
 











// Evento de alerta cuando se pierde la conexión a internet
window.addEventListener('offline', () => {
    apex.message.clearErrors();
    apex.message.showErrors([{
        type: 'info',
        location: 'page',
        message: 'Sin conexión a internet. Los registros se guardarán offline.'
    }]);
});

// Evento de alerta cuando se recupera la conexión a internet
window.addEventListener('online', () => {
    apex.message.clearErrors();
    apex.message.showPageSuccess('Conexión a internet recuperada.!');
    const req = indexedDB.open(safix.indexedDB.dbName, safix.indexedDB.dbVersion);
    req.onsuccess = event => {
        const db = event.target.result;
        const tx = db.transaction(safix.indexedDB.storeName, 'readonly');
        const store = tx.objectStore(safix.indexedDB.storeName);
        const all = store.getAll();
        all.onsuccess = () => {
            all.result.forEach(reg => {
                // apex.server.process('insercion', {
                //     x01: JSON.stringify(reg)
                // }, {
                //     success: () => {
                //         const txDel = db.transaction(storeName, 'readwrite');
                //         const storeDel = txDel.objectStore(storeName);
                //         storeDel.clear(); // Borra todos
                //         apex.message.showPageSuccess('Registros sincronizados!');
                //         $.event.trigger("daSubmit");
                //     }
                // });
            });
        };
    };
});