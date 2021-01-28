import Transaction from './Transaction';
import ProductFlow from './ProductFlow';
import Product from './Product';

export default class DrugStock{
	id?:number;
	product?:Product;
	transaction?:Transaction;
	count?:number;
	productFlow?:ProductFlow;
	incomingCount?:number;
	disributedCount?:number;
	expStatus?:number;

}
