/**
 * 
 * 2023
 * JUAN DAVID CASTAÑO USUGA
 * SANTIAGO RAMÍREZ
 * 
 * 
 * @module recover_modules
 */
const idGridIndexDb = "Grids"
const idIndexDb = nombrePag + idGridIndexDb
const recover_modules = {}


/**
 * 
 * Guardar información de los grids en el Localforage
 * @function save_grid
 * 
 */

recover_modules.save_grid = async (id_region) => {

    let grid = apex.region( id_region ).widget().interactiveGrid(`getViews`).grid

    const options_to_save = [`_aggregateRecs` ,`_aggregatedFields` ,`_breakEndIds` ,`_calculatedFields` ,`_changes` ,`_data` ,`_dependentFields` ,`_errors` ,`_haveAllData` ,`_identityKeys` ,`_index` ,`_metaKey` ,`_nextInsertId` ,`_numAggregateRecords` ,`_numDeletedRecords` ,`_numInsertedRecords` ,`_offset` ,`_options` ,`_requestsInProgress` ,`_selectAll` ,`_selectAllExcept` ,`_selectAnchor` ,`_selectRange` ,`_selection` ,`_staleAggFields` ,`_totalRecords` ,`_waitingPages` ,`dataOverflow` ,`instance` ,`name`]
	
    let _grid_config = {}

    let estructuraGrid = {
        id : null,
        grid : null
    }   

    Object.keys(grid.model).forEach((e) => {
        if(options_to_save.some(value => value === e)){
            _grid_config[e] = grid.model[e]
        }
    })

    estructuraGrid.id = id_region
    estructuraGrid.grid = _grid_config

    const newGridStructure = await update_save_grid(id_region, estructuraGrid)
    
    localforage.setItem(idIndexDb, newGridStructure)

}

/**
 *
 *  Recuperar el grid y cargarlo en el DOM
 *  @function load_grid
 * 
 */

recover_modules.load_grid = (id_region, ) => {    
    
    grid = apex.region(id_region).widget().interactiveGrid(`getViews`).grid

    try{

        localforage.getItem(id_region).then((data) => {
        
            Object.keys(data).forEach((e) => {
                grid.model[e] = data[e]
            })
            grid.refresh()
        })

     }catch(e){
         console.log(`Error recover_modulesload_grid ${e}`)
    }

}

async function update_save_grid (idGrid, gridObject){

    let gridCollection = await localforage.getItem(idIndexDb) 

    let newGridCollection = []
    debugger
    if(gridCollection !== null && gridCollection !== 0){
        debugger
        newGridCollection.push(gridCollection.filter(grid => grid.id !== idGrid))
    }

    newGridCollection.push(gridObject)

    return newGridCollection
   
}
