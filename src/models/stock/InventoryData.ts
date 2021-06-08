
import ProductInventory from '../common/ProductInventory';
import DataSet from '../settings/DataSet';
import { MONTHS } from '../../utils/DateUtil';
import PeriodicReviewResult from './PeriodicReviewResult';
export default class InventoryData implements DataSet {

    inventories:ProductInventory[] = [];
    totalItemsSum:number = 0;
    totalExpiredSum:number = 0;
    totalWillExpiredSum:number = 0;
    periodicReviewResult:undefined|PeriodicReviewResult;

    month:undefined|number;
    year:undefined|number;

    getLabel = () :string => {
        return MONTHS[(this.month??1) - 1] + " " + this.year;
    }
    getAmount = () : number => {
        return this.totalItemsSum;
    }
    public static toDataSets = (list:InventoryData[]) : DataSet[] => {
        const res:DataSet[] = [];
        for (let i = 0; i < list.length; i++) {
            const element = list[i];
            res.push(Object.assign(new InventoryData, element))
        }
        return res;
    }
}