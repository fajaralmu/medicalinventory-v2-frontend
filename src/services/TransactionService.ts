
import User from '../models/User';
import WebRequest from '../models/common/WebRequest';
import { contextPath } from '../constant/Url';
import { commonAjaxPostCalls } from './Promises';
import Transaction from './../models/Transaction';
export default class TransactionService {
    
    
    private static instance:undefined| TransactionService;

    static getInstance(): TransactionService {
        if (this.instance == null) {
            this.instance = new TransactionService();
        }
        return this.instance;
    }
    submitTransactionOUT = (object: Transaction) => {

        console.debug("object: ", object);
         
        const request: WebRequest = Object.assign(new WebRequest(),{
            transaction: object
        });

        const endpoint = contextPath().concat("api/app/transaction/transactionout")
        return commonAjaxPostCalls(endpoint, request);
    }
    submitTransactionIN = (object: Transaction) => {

        const request: WebRequest = Object.assign(new WebRequest(),{
            transaction: object
        });

        const endpoint = contextPath().concat("api/app/transaction/transactionin")
        return commonAjaxPostCalls(endpoint, request);
    }

    getTransactionByCode = (code: string) => {
        const endpoint = contextPath().concat("api/app/transaction/gettransaction/"+code)
        return commonAjaxPostCalls(endpoint, {});
    }
    getTransactionRelatedRecord = (code: string) => {
        const endpoint = contextPath().concat("api/app/transaction/relatedrecord/"+code)
        return commonAjaxPostCalls(endpoint, {});
    }
    deleteTransactionByCode = (code: string) => {
        const endpoint = contextPath().concat("api/app/transaction/deleterecord/"+code)
        return commonAjaxPostCalls(endpoint, {});
    }

}