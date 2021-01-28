import User from './User';
import Customer from './Customer';
import BaseEntity from './BaseEntity';
import Supplier from './Supplier';
import HealthCenter from './HealthCenter';

export default class Transaction extends BaseEntity{
	code?:string;
	transactionDate?:Date;
	user?:User;
	type?:string;
	supplier?:Supplier;
	customer?:Customer;
	healthCenterDestionation?:HealthCenter;
	healthCenter?:HealthCenter;
	listAliranObat?:any[];
	listStokObat?:any[];

}
