
import Transaction from './Transaction';
import BaseEntity from './BaseEntity';
import Product from './Product';

export default class ProductFlow extends BaseEntity {
	/**
	 * creates new instance of productFlow referencing given productFlow
	 * @param availableProductFlow 
	 * @returns
	 */
    static fromReference(availableProductFlow: ProductFlow): ProductFlow {
		const pf = new ProductFlow();
		pf.referenceProductFlow = Object.assign(new ProductFlow(), availableProductFlow);
		pf.product = pf.referenceProductFlow.product;
		return pf;
    }
	transaction?: Transaction;
	product: Product = new Product();
	expiredDate: Date = new Date();
	count: number = 0;
	usedCount: number = 0;
	stock: number = 0;
	suitable: boolean = true;
	price: number = 0;
	generic: boolean = true;
	referenceProductFlow?:ProductFlow;

}
