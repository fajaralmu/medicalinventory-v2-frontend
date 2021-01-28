import BaseEntity from './BaseEntity';

export default class ApplicationProfile extends BaseEntity{
	name?:string;
	appCode?:string;
	shortDescription?:string;
	about?:string;
	welcomingMessage?:string;
	address?:string;
	contact?:string;
	website?:string;
	iconUrl?:string;
	pageIcon?:string;
	backgroundUrl?:string;
	footerIconClass?:string;
	color?:string;
	fontColor?:string;

}
