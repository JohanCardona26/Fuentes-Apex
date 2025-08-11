function borrar_localforage(nombreForma){
    localforage.dropInstance({ name: 'HCE', storeName: nombreForma + "_" + current_page });
}