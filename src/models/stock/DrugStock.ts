import Transaction from '../Transaction';
import ProductFlow from '../ProductFlow';
import Product from '../Product';

export default class DrugStock{
	id:undefined|number;
	product:undefined|Product;
	transaction:undefined|Transaction;
	count:undefined|number;
	productFlow:undefined|ProductFlow;
	incomingCount:undefined|number;
	disributedCount:undefined|number;
	expStatus:undefined|number;

}
