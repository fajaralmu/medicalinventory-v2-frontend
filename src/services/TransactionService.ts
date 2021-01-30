
import User from '../models/User';
import WebRequest from '../models/WebRequest';
import { contextPath } from '../constant/Url';
import { commonAjaxPostCalls } from './Promises';
import Transaction from './../models/Transaction';
export default class TransactionService {
    
    getTransactionByCode = (code: string) => {
        const endpoint = contextPath().concat("api/app/transaction/gettransaction/"+code)
        return commonAjaxPostCalls(endpoint, {});
    }
    private static instance?: TransactionService;

    static getInstance(): TransactionService {
        if (this.instance == null) {
            this.instance = new TransactionService();
        }
        return this.instance;
    }
    submitTransactionOUT = (object: Transaction) => {

        console.debug("object: ", object);
         
        const request: WebRequest = {
            transaction: object
        }

        const endpoint = contextPath().concat("api/app/transaction/transactionout")
        return commonAjaxPostCalls(endpoint, request);
    }
    submitTransactionIN = (object: Transaction) => {

        const request: WebRequest = {
            transaction: object
        }

        const endpoint = contextPath().concat("api/app/transaction/transactionin")
        return commonAjaxPostCalls(endpoint, request);
    }

}