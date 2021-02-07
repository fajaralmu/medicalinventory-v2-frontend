import * as types from './types'

export const initState = { 
    mainApp: undefined,
    inventoryData: undefined,
    inventoryConfig: undefined,

};

export const reducer = (state = initState, action) => {
    switch (action.type) {
        case types.SET_MAIN_APP:
              
            return { ...state, mainApp: action.payload }; 
        case types.SET_INVENTORY_DATA:

        return {...state, inventoryData: action.payload.inventoryData, inventoryConfig: action.payload.inventoryConfig}
        default:
            return state;
    }
}

export default reducer;