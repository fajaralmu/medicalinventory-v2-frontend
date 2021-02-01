 
import { contextPath } from '../constant/Url';
import { commonAjaxPostCallsWithBlob } from './Promises'; 
import HealthCenter from './../models/HealthCenter';
import Filter from './../models/Filter';
export default class ReportService {
    loadStockOpnameReport = (filter:Filter, location:HealthCenter) => {
        const endpoint = contextPath().concat("api/app/report/stockopname")
        return commonAjaxPostCallsWithBlob(endpoint, {
            healthcenter: location,
            filter: filter
        });
    }

   
    private static instance?: ReportService;

    static getInstance(): ReportService {
        if (this.instance == null) {
            this.instance = new ReportService();
        }
        return this.instance;
    }
     

}