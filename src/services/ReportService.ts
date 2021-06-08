 
import { contextPath } from '../constant/Url';
import { commonAjaxPostCallsWithBlob } from './Promises'; 
import HealthCenter from './../models/HealthCenter';
import Filter from '../models/common/Filter';
export default class ReportService {
    loadStockOpnameReport = (filter:Filter, location:HealthCenter) => {
        const endpoint = contextPath().concat("api/app/report/stockopname")
        return commonAjaxPostCallsWithBlob(endpoint, {
            healthcenter: location,
            filter: filter
        });
    }
    loadMontlyReport = (filter:Filter ) => {
        const endpoint = contextPath().concat("api/app/report/monthly")
        return commonAjaxPostCallsWithBlob(endpoint, { 
            filter: filter
        });
    }
    printTransactionReceipt = (code:string ) => {
        const endpoint = contextPath().concat("api/app/report/transactionreceipt/"+code)
        return commonAjaxPostCallsWithBlob(endpoint, {  });
    }
    printReceiveRequestSheet = (filter:Filter  , location:HealthCenter ) => {
        const endpoint = contextPath().concat("api/app/report/receiverequestsheet")
        return commonAjaxPostCallsWithBlob(endpoint, { 
            healthcenter: location,
            filter: filter
        });
    }

   
    private static instance:undefined| ReportService;

    static getInstance(): ReportService {
        if (this.instance == null) {
            this.instance = new ReportService();
        }
        return this.instance;
    }
     

}