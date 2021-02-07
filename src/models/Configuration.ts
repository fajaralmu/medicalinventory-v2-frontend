import BaseEntity from './BaseEntity';

export default class Configuration extends BaseEntity{
	expiredWarningDays:number = 0;
	leadTime?:number;
	cycleTime?:number;

	constructor(){
		super();
	}

}
