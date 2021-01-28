import BaseEntity from './BaseEntity'; 
import { uniqueId } from './../utils/StringUtil';

export default class Menu extends BaseEntity{
	static defaultMenuIconClassName:string = "fas fa-folder";

	code:string = uniqueId();
	name?:string;
	description?:string;
	url?:string;
	pathVariables?:string; 
	iconUrl?:string;
	color?:string;
	fontColor?:string;

	//
	active?:boolean = false;
	menuClass?:string = "fas fa-folder";
	authenticated?:boolean = false;
	showSidebar?:boolean  = false;
	subMenus?:Menu[] = undefined;

	static getIconClassName = (menu:Menu) => {
		if (undefined == menu.menuClass) {
			return Menu.defaultMenuIconClassName;
		}
		return menu.menuClass;
	}
}
