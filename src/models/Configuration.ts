import BaseEntity from './BaseEntity';

export default class Configuration extends BaseEntity{
	expiredWarningDays?:number;
	leadTime?:number;
	cycleTime?:number;

}
