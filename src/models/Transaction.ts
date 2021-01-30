import User from './User';
import Customer from './Customer';
import BaseEntity from './BaseEntity';
import Supplier from './Supplier';
import HealthCenter from './HealthCenter';
import ProductFlow from './ProductFlow';
import Product from './Product';

export default class Transaction extends BaseEntity {
	code?: string;
	transactionDate: Date = new Date();
	user?: User;
	type?: string;
	supplier?: Supplier;
	customer?: Customer;
	healthCenterDestionation?: HealthCenter;
	healthCenter?: HealthCenter;
	productFlows: ProductFlow[] = [];
	 
	productFlowCount = () => { return this.productFlows.length }
	addProductToFlow = (product: Product) => {
		const productFlow: ProductFlow = new ProductFlow();
		productFlow.product = product;
		this.productFlows.push(productFlow);
	}
	addProductFlow = (productFlow:ProductFlow) => {
		this.productFlows.push(productFlow);
	}
	hasProductFlowReferenceid = (id:number) : boolean => {

		for (let i = 0; i < this.productFlows.length; i++) {
			const element = this.productFlows[i];
			if (element.referenceProductFlow && element.referenceProductFlow.id == id) {
				return true;
			}
		}
		return false;
	}

	setProductFlowValue = (index: number, key: string, value: any) => {
		try {
			this.productFlows[index][key] = value;
		} catch (e) {
			console.error(e);
		}
	}
	removeProductFlow = (index: number) => {
		for (let i = 0; i < this.productFlows.length; i++) {
			const element = this.productFlows[i];
			if (i == index) {
				this.productFlows.splice(i, 1);
				break;
			}
		}
	}

}
