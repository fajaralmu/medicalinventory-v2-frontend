import * as types from './types'
import * as url from '../constant/Url'
import { contextPath } from '../constant/Url'; 
import User from './../models/User';
import ApplicationProfile from './../models/ApplicationProfile';
import InventoryData from './../models/InventoryData';
import WebResponse from './../models/WebResponse';

const usedHost = url.contextPath();
const apiBaseUrl = usedHost + "api/public/"
const apiEntityBaseUrl = usedHost + "api/app/entity/"
const apiAccount = usedHost + "api/app/account/"
const apiAdmin = usedHost + "api/app/admin/"    

export const getEntityProperty = (entityName, app) => {
    app.startLoading();
    let requested = {
        type: types.GET_ENTITY_PROPERTY,
        payload: {
            entity: entityName
        },
        meta: {
            type: types.GET_ENTITY_PROPERTY,
            url: apiEntityBaseUrl.concat("config"),
            app: app,
        }
    };
    return requested;
}


export const getManagementMenus = (app) => {
    app.startLoading();
    let requested = {
        type: types.GET_MANAGEMENT_MENUS,
        payload: {},
        meta: {
            type: types.GET_MANAGEMENT_MENUS,
            url: apiEntityBaseUrl.concat("managementpages"),
            app: app,
        }
    };
    return requested;
}

export const requestAppId = (app) => {
    app.startLoading();
    return {
        type: types.REQUEST_ID,
        payload: {},
        meta: {
            app: app, type: types.REQUEST_ID,
            url: apiBaseUrl.concat("requestid")
        }
    };
}

export const getMessageList = (app) => {
    app.startLoading();
    return {
        type: types.GET_MESSAGE,
        payload: {},
        meta: {
            type: types.GET_MESSAGE, app: app,
            url: apiAdmin.concat("getmessages")
        }
    };
}

export const storeMessageLocally = (messages) => {

    return {
        type: types.STORE_MESSAGE,
        payload: {
            entities: messages
        },
        meta: {
            type: types.STORE_MESSAGE,
        }
    };
}
    

export const performLogout = (app) => {
    app.startLoading();
    let loginRequest = {
        type: types.DO_LOGOUT,
        payload: {},
        meta: { app: app, type: types.DO_LOGOUT, url: apiAccount.concat("logout") }
    };
    return loginRequest;
}

export const performLogin = (username, password, app) => {
    app.startLoading();
    let loginRequest = {
        type: types.DO_LOGIN,
        payload: {},
        meta: {
            type: types.DO_LOGIN, url: contextPath().concat("login?username=" + username + "&password=" +
                password + "&transport_type=rest"), app: app
        }
    };
    return loginRequest;
}

export const getLoggedUser = (app) => {
    app.startLoading();
    let request = {
        type: types.GET_LOGGED_USER,
        payload: {},
        meta: { type: types.GET_LOGGED_USER, url: apiAccount.concat("user"), app: app }
    };
    return request;
}

export const setLoggedUser = (user: User) => {

    let request = {
        type: types.SET_LOGGED_USER,
        payload: { user: user },
        meta: { type: types.SET_LOGGED_USER }
    };
    return request;
}

export const setApplicationProfile = (applicationProfile: ApplicationProfile) => {

    let request = {
        type: types.SET_APPLICATION_PROFILE,
        payload: { applicationProfile: applicationProfile },
        meta: { type: types.SET_APPLICATION_PROFILE }
    };
    return request;
}
 
export const  setMainApp = (mainApp:any) => ({
    type: types.SET_MAIN_APP,
    payload: mainApp,
    meta: { type: types.SET_MAIN_APP }
})
 
export const  setInventoryData = (payload: WebResponse) => ({
    type: types.SET_INVENTORY_DATA,
    payload: {inventoryData:payload.inventoryData, inventoryConfig: payload.configuration},
    meta: { type: types.SET_INVENTORY_DATA }
})

