import * as shopReducer from "./appReducer"
import * as userReducer from "./userReducer" 
import  * as servicesReducers from './servicesReducer';
import { combineReducers } from "redux";

export const rootReducer = combineReducers(
    {
        appState: shopReducer.reducer,
        userState: userReducer.reducer, 
        servicesState: servicesReducers.reducer
    }
);

export const initialState:any = {
    appState: shopReducer.initState,
    userState: userReducer.initState, 
    servicesState: servicesReducers.initState
}

export default rootReducer;