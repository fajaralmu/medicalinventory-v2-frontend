
import ProductInventory from './ProductInventory';
export default class InventoryData {

    inventories:ProductInventory[] = [];
    totalItemsSum:number = 0;
    totalExpiredSum:number = 0;
    totalWillExpiredSum:number = 0;

    month?:number;
    year?:number;
}