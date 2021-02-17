
import User from './../models/User';
import WebRequest from '../models/common/WebRequest';
import { contextPath } from './../constant/Url';
import { commonAjaxPostCalls, commonAjaxPublicPostCalls } from './Promises';
import { updateAccessToken } from '../middlewares/Common';
import WebResponse from '../models/common/WebResponse';
export default class UserService {
    private static instance?: UserService;

    static getInstance(): UserService {
        if (this.instance == null) {
            this.instance = new UserService();
        }
        return this.instance;
    }
    updateProfile = (user: User) => {

        const request: WebRequest = {
            user: user
        }

        const endpoint = contextPath().concat("api/app/account/updateprofile")
        return commonAjaxPostCalls(endpoint, request);
    }

    requestApplicationId = (callbackSuccess: (response: WebResponse) => any, callbackError: () => any) => {
        const url = contextPath() + "api/public/requestid";
        commonAjaxPostCalls(url, {}).then(data => {
            if (data.code != "00") {
                alert("Error requesting app ID");
                return;
            }
            const response = data.rawAxiosResponse;
            updateAccessToken(response);
            console.debug("response header:", response.headers['access-token']);
            callbackSuccess(data);
        }).catch(e => {
            console.error("ERROR requestApplicationId: ", e);
            callbackError();
        })

    }
    requestApplicationIdNoAuth = (callbackSuccess: (response: WebResponse) => any, callbackError: () => any) => {
        const url = contextPath() + "api/public/requestid";
        commonAjaxPublicPostCalls(url, {}).then(data => {
            if (data.code != "00") {
                alert("Error requesting app ID");
                return;
            }
            callbackSuccess(data);
        }).catch(e => {
            callbackError();
            console.error("ERROR requestApplicationIdNoAuth: ", e);
            //   alert("Error Occured, please reload OR try again");
        })

    }

}