
import Transaction from './Transaction';
import BaseEntity from './BaseEntity';
import Product from './Product';

export default class ProductFlow extends BaseEntity {
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
	suitable: boolean = true;
	price: number = 0;
	generic: boolean = true;
	referenceProductFlow?:ProductFlow;

}
