
import Transaction from './Transaction';
import BaseEntity from './BaseEntity';
import Product from './Product';

export default class ProductFlow extends BaseEntity {
	transaction?: Transaction;
	product: Product = new Product();
	expiredDate: Date = new Date();
	count: number = 0;
	suitable: boolean = true;
	price: number = 0;
	generic: boolean = true;

}
