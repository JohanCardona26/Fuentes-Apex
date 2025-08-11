/**
 * 
 * 2023
 * JUAN DAVID CASTAÑO USUGA
 * SANTIAGO RAMIREZ
 * 
 * 
 * @module recover_modules
 */

const recover_modules = {}

/**
 * 
 * Save Information
 * @function save_grid
 * 
 */

recover_modules.save_grid = (id_region) => {
    let grid = apex.region( id_region ).widget().interactiveGrid(`getViews`).grid
    const options_to_save = [`_aggregateRecs` ,`_aggregatedFields` ,`_breakEndIds` ,`_calculatedFields` ,`_changes` ,`_data` ,`_dependentFields` ,`_errors` ,`_haveAllData` ,`_identityKeys` ,`_index` ,`_metaKey` ,`_nextInsertId` ,`_numAggregateRecords` ,`_numDeletedRecords` ,`_numInsertedRecords` ,`_offset` ,`_options` ,`_requestsInProgress` ,`_selectAll` ,`_selectAllExcept` ,`_selectAnchor` ,`_selectRange` ,`_selection` ,`_staleAggFields` ,`_totalRecords` ,`_waitingPages` ,`dataOverflow` ,`instance` ,`name`]
    let _grid_config = {}
    Object.keys(grid.model).forEach((e) => {
        if(options_to_save.some(value => value === e)){
            _grid_config[e] = grid.model[e]
        }
    })
    localforage.setItem( id_region, _grid_config )
}

/**
 *
 *  Recover the grid
 *  @function save_grid
 * 
 */

recover_modules.load_grid = (id_region) => {    
    grid = apex.region(id_region).widget().interactiveGrid(`getViews`).grid
    localforage.getItem(id_region).then((data) => {
        Object.keys(data).forEach((e) => {
            grid.model[e] = data[e]
        })
        grid.refresh()
    })
}