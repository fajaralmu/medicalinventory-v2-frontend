import { Component, ChangeEvent } from 'react';
import WebResponse from '../models/common/WebResponse';
import ApplicationProfile from './../models/ApplicationProfile';
import User from './../models/User';
import HealthCenter from './../models/HealthCenter';
import InventoryData from '../models/stock/InventoryData';
import Configuration from './../models/Configuration';
import { doItLater } from './../utils/EventUtil';
import { resolve } from 'inversify-react';
import DialogService from './../services/DialogService';
import App from '../App';

export default abstract class BaseComponent extends Component<any, any> {

    @resolve(DialogService)
    private dialog: DialogService;

    parentApp: typeof App;
    state: any = { };
    constructor(props: any) {
        super(props);
        this.state = {
            ...this.state
        }
        this.parentApp = this.props.mainApp;

    }
    getInventoryData = (): InventoryData | undefined => {
        return this.props.inventoryData;
    }
    getInventoryConfig = (): Configuration | undefined => {
        return this.props.inventoryConfig;
    }
    getMasterHealthCenter = (): HealthCenter => {
        return this.props.masterHealthCenter ?? new HealthCenter();
    }
    setPageTitle = (title: string) => {
        document.title = title;
    }
    getApplicationProfile = (): ApplicationProfile => {
        return this.props.applicationProfile == null ? new ApplicationProfile() : this.props.applicationProfile;
    }

    handleInputChange = (event: ChangeEvent) =>{
        const target = event.target as HTMLInputElement | HTMLTextAreaElement;

        let value;
        if (target instanceof HTMLInputElement) {
            if (target.type === 'checkbox') {
                value = target.checked;
            } else {
                value = target.value;
            }
        } else {
            value = target.value;
        }
        this.setState({ [target.name]: value });
    }
    /**
     * 
     * @param {boolean} withProgress 
     */
    startLoading(withProgress: boolean) {
        this.parentApp.startLoading(withProgress);
    }

    endLoading() {
        this.parentApp.endLoading();
    }
    /**
     * api response must be instance of WebResponse
     * @param method 
     * @param withProgress 
     * @param successCallback 
     * @param errorCallback 
     * @param params 
     */
    doAjax = (method: Function, withProgress: boolean, successCallback: Function, errorCallback:undefined| Function, ...params: any) => {
        this.startLoading(withProgress);

        method(...params).then(function (response: WebResponse) {
            if (successCallback) {
                successCallback(response);
            }
        }).catch(function (e) {
            if (errorCallback) {
                errorCallback(e);
            } else {
                if (typeof (e) == 'string') {
                    alert("Operation Failed: " + e);
                }
                alert("resource not found");
            }
        }).finally((e: any) => {
            this.endLoading();
        })
    }

    scrollTop = () => {
        // console.info("SCROLL TOP");
        const opt:ScrollToOptions = { top:0,  behavior: 'smooth' };
        doItLater(()=>{
        window.scrollTo(opt);
        }, 100);
    }
    commonAjax = (method: Function, successCallback: Function, errorCallback: Function, ...params: any) => {
        this.doAjax(method, false, successCallback, errorCallback, ...params);
    }
    commonAjaxWithProgress = (method: Function, successCallback: Function, errorCallback: Function, ...params: any) => {
        this.doAjax(method, true, successCallback, errorCallback, ...params);
    }
    getLoggedUser = (): User | undefined => {
        const user: User | undefined = this.props.loggedUser;
        if (!user) return undefined;
        user.password = "^_^";
        return user;
    }

    isUserLoggedIn = (): boolean => {
        return true == this.props.loginStatus && null != this.props.loggedUser;
    }
    showConfirmation = (body: any): Promise<boolean> => {
        return this.dialog.showConfirm("Konfirmasi", body);

    }
    showConfirmationDanger = (body: any): Promise<any> => {
        return this.dialog.showConfirmDanger("Konfirmasi", body);
    }
    showInfo(body: any) {
        this.dialog.showInfo("Information", body);
    }
    showError(body: any) {
        this.dialog.showError("Error", body);
    }
    refresh() {
        this.forceUpdate();;
    }

    showCommonErrorAlert = (e: any) => {
        console.error(e);

        let message;
        if (e.response && e.response.data) {
            console.error("e.response: ", e.response);
            message = e.response.data.message;
        } else {
            message = e;
        }
        this.showError("Operation Failed: " + message);
    }
    
}