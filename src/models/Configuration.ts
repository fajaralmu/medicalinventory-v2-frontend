import BaseEntity from './BaseEntity';

export default class Configuration extends BaseEntity{
	expiredWarningDays:number =1;
	leadTime?:number;
	cycleTime?:number;

	constructor(){
		super();
	}

}
