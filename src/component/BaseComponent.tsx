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
import LoadingService from './../services/LoadingService';

export default abstract class BaseComponent<P, S> extends Component<P, S> {

  @resolve(DialogService)
  private dialog: DialogService;
  @resolve(LoadingService)
  private loading: LoadingService;

  parentApp: typeof App;
  constructor(props: any) {
    super(props);
    this.parentApp = (this.props as any).mainApp;
    this.state = {
      ...this.state
    };

  }
  getInventoryData = (): InventoryData | undefined => {
    return (this.props as any).inventoryData;
  }
  getInventoryConfig = (): Configuration | undefined => {
    return (this.props as any).inventoryConfig;
  }
  getMasterHealthCenter = (): HealthCenter => {
    return (this.props as any).masterHealthCenter ?? new HealthCenter();
  }
  setPageTitle = (title: string) => {
    document.title = title;
  }
  getApplicationProfile = (): ApplicationProfile => {
    return (this.props as any).applicationProfile == null ? new ApplicationProfile() : (this.props as any).applicationProfile;
  }

  handleInputChange = (event: ChangeEvent, callback?: () => any) => {
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
    const updated = { [target.name]: value }
    this.setState(updated as any, callback);
  }
  /**
   * 
   * @param {boolean} withProgress 
   */
  startLoading(withProgress: boolean) {
    this.loading.start(withProgress);
  }

  endLoading() {
    this.loading.stop();
  }
  /**
   * api response must be instance of WebResponse
   * @param method 
   * @param withProgress 
   * @param successCallback 
   * @param errorCallback 
   * @param params 
   */
  doAjax = (method: Function, withProgress: boolean, successCallback: Function, errorCallback: undefined | Function, ...params: any) => {
    this.startLoading(withProgress);

    method(...params).then((response: WebResponse) => {
      if (successCallback) {
        successCallback(response);
      }
    }).catch((e) => {
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
    const opt: ScrollToOptions = { top: 0, behavior: 'smooth' };
    doItLater(() => {
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
    const user: User | undefined = (this.props as any).loggedUser;
    if (!user) return undefined;
    user.password = "^_^";
    return user;
  }

  isUserLoggedIn = (): boolean => {
    return true == (this.props as any).loginStatus && null != (this.props as any).loggedUser;
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