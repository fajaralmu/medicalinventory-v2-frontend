 
export default class Filter{
	limit? :number = 5; 
	page? :number = 0;
	orderType?:string;
	orderBy?:string;
	contains?:boolean;
	beginsWith?:boolean;
	exacts?:boolean;
	day?:number;
	year?:number;
	month?:number;
	module?:string;
	fieldsFilter?:any = {};
	monthTo?:number;
	yearTo?:number;
	maxValue?:number;
	ignoreEmptyValue?:boolean = false;
	//
	useExistingFilterPage?:boolean = false; 

}
