 
import { contextPath } from '../constant/Url';
import { commonAjaxPostCalls } from './Promises'; 
import HealthCenter from './../models/HealthCenter';
import Filter from './../models/Filter';
export default class InventoryService {
    getAvailableProducts = (productCode: string, location:HealthCenter) => {
        const endpoint = contextPath().concat("api/app/inventory/availableproducts/"+productCode)
        return commonAjaxPostCalls(endpoint, {
            healthcenter: location
        });
    }

    getProductsInHealthCenter = (filter:Filter, location:HealthCenter) => {
        const endpoint = contextPath().concat("api/app/inventory/getproducts")
        return commonAjaxPostCalls(endpoint, {
            healthcenter: location,
            filter: filter
        });
    }
    adjustStocks = () => {
        const endpoint = contextPath().concat("api/app/inventory/recalculatestock")
        return commonAjaxPostCalls(endpoint, {  });
    }
    getInventoriesData = () => {
        const endpoint = contextPath().concat("api/app/inventory/getinventoriesdata")
        return commonAjaxPostCalls(endpoint, {  });
    }
    private static instance?: InventoryService;

    static getInstance(): InventoryService {
        if (this.instance == null) {
            this.instance = new InventoryService();
        }
        return this.instance;
    }
     

}