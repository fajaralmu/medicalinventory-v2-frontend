import BaseEntity from './BaseEntity';

export default class HealthCenter extends BaseEntity{
	code?:string;
	name?:string;
	address?:string;
	monthlyProductCount?:number;

}
