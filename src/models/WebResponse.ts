import EntityProperty from './EntityProperty';
import User from './User';
import Filter from './Filter';
import BaseEntity from './BaseEntity';
import ApplicationProfile from './ApplicationProfile'; 

export default class WebResponse{
	date?:Date;
	user?:User;
	code?:string;
	message?:string;
	entities?:any[];
	generalList?:any[];
	entity?:BaseEntity;
	filter?:Filter;
	totalData?:number;
	storage?:{};
	entityProperty?:EntityProperty;
	maxValue?:number;
	quantity?:number;
	applicationProfile?:ApplicationProfile;
	percentage?:number;
	transactionYears?:any[];
	requestId?:string;
	token?:string;
	loggedIn?:Boolean;
	success?:boolean;
	entityClass?:any; 

}
