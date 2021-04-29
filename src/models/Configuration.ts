import BaseEntity from './BaseEntity';

export default class Configuration extends BaseEntity{
	expiredWarningDays:number = 10;
	leadTime?:number;
	cycleTime?:number;

	constructor(){
		super();
	}

}
