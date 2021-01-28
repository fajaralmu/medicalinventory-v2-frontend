
import { commonAuthorizedHeader } from '../middlewares/Common';
import WebResponse from '../models/WebResponse';
import { updateAccessToken } from './../middlewares/Common';

const axios = require('axios');

export const rejectedPromise = (message: any) => {
    return new Promise((res, rej) => {
        rej(message);
    });
}

export const emptyPromise = (defaultResponse: any) => new Promise(function (res, rej) {
    res(defaultResponse);
});

export const commonAjaxPostCalls = (endpoint: string, payload?: any) => {
    const request = payload == null ? {} : payload;
    return new Promise<WebResponse>(function (resolve, reject) {
        axios.post(endpoint, request, {
            headers: commonAuthorizedHeader()
        })
            .then(axiosResponse => {
                updateAccessToken(axiosResponse);
                const response: WebResponse = axiosResponse.data;
                if (response.code == "00") {

                    resolve(response);
                }
                else { reject(response); }
            })
            .catch((e: any) => { console.error(e); reject(e); });
    })
}