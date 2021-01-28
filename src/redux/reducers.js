import * as shopReducer from "./shopReducer"
import * as userReducer from "./userReducer"
import * as transactionReducer from "./transactionReducer" 
import  * as servicesReducers from './servicesReducer';
import { combineReducers } from "redux";

export const rootReducer = combineReducers(
    {
        appState: shopReducer.reducer,
        userState: userReducer.reducer,
        transactionState: transactionReducer.reducer, 
        servicesState: servicesReducers.reducer
    }
);

export const initialState = {
    appState: shopReducer.initState,
    userState: userReducer.initState,
    transactionState: transactionReducer.initState, 
    servicesState: servicesReducers.initState
}

export default rootReducer;