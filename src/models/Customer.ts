import BaseEntity from './BaseEntity';
import HealthCenter from './HealthCenter';

export default class Customer extends BaseEntity{
	name?:string;
	address?:string;
	gender?:string;
	birthDate?:Date;
	healthCenter?:HealthCenter;

}
