import BaseEntity from './BaseEntity';

export default class User extends BaseEntity{
	username?:string;
	displayName?:string;
	password?:string;
	profileImage?:string;
	authorities?:any[];
	requestId?:string;
	processingDate?:Date;

}
