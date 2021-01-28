
import User from './../models/User';
import WebRequest from './../models/WebRequest';
import { contextPath } from './../constant/Url';
import { commonAjaxPostCalls } from './Promises';
export default class UserService
{
    private static instance?:UserService;

    static getInstance(): UserService {
        if (this.instance == null) {
            this.instance = new UserService();
        }
        return this.instance;
    }
    updateProfile = (user:User) => {
        
        const request:WebRequest = {
           user:user
        }

        const endpoint = contextPath().concat("api/app/account/updateprofile")
        return commonAjaxPostCalls(endpoint, request);
    }

}