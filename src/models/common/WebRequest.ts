 
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
	entity:undefined|string;
	user:undefined|User;
	profile:undefined|ApplicationProfile;
	customer:undefined|Customer;
	supplier:undefined|Supplier;
	healthcenter:undefined|HealthCenter;
	inventoryConfiguration:undefined|Configuration;
	unit:undefined|Unit;
	product:undefined|Product;
	transaction:undefined|Transaction;
	filter:undefined|Filter;
	entityObject:undefined|BaseEntity; 
	orderedEntities:undefined|any[];
	regularTransaction:undefined|boolean;
	imageData:undefined|string; 
}
