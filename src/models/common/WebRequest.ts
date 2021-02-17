 
import User from '../User'; 
import BaseEntity from '../BaseEntity';   
import Filter from './Filter'; 
import ApplicationProfile from '../ApplicationProfile'; 
import Customer from '../Customer';
import Supplier from '../Supplier';
import HealthCenter from '../HealthCenter';
import Unit from '../Unit';
import Product from '../Product';
import Transaction from '../Transaction';
import Configuration from '../Configuration';

export default class WebRequest{
	entity?:string;
	user?:User;
	profile?:ApplicationProfile;
	customer?:Customer;
	supplier?:Supplier;
	healthcenter?:HealthCenter;
	inventoryConfiguration?:Configuration;
	unit?:Unit;
	product?:Product;
	transaction?:Transaction;
	filter?:Filter;
	entityObject?:BaseEntity; 
	orderedEntities?:any[];
	regularTransaction?:boolean;
	imageData?:string; 
}
