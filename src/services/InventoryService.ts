 
import { contextPath } from '../constant/Url';
import { commonAjaxPostCalls } from './Promises'; 
import HealthCenter from './../models/HealthCenter';
export default class InventoryService {
    getAvailableProducts = (productCode: string, location:HealthCenter) => {
        const endpoint = contextPath().concat("api/app/inventory/availableproducts/"+productCode)
        return commonAjaxPostCalls(endpoint, {
            healthcenter: location
        });
    }
    private static instance?: InventoryService;

    static getInstance(): InventoryService {
        if (this.instance == null) {
            this.instance = new InventoryService();
        }
        return this.instance;
    }
     

}