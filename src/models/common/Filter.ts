 
export default class Filter{
    
	static FLAG_ALL:string = "ALL";
	static FLAG_DEFAULT:string = "DEFAULT";
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
	dayTo?:number;
	monthTo?:number;
	yearTo?:number;
	maxValue?:number;
	ignoreEmptyValue?:boolean = false;
	filterExpDate?:boolean = false;
	flag?:string = Filter.FLAG_DEFAULT;
	//
	useExistingFilterPage?:boolean = false; 

	public static setFieldsFilterValue = (f:Filter, name: string, value: any) => {
        if (f.fieldsFilter == undefined) {
            f.fieldsFilter = {};
        }
        f.fieldsFilter[name] = value;
    }

}
