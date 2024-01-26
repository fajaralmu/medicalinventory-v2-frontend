import BaseEntity from '../BaseEntity'; 
import { uniqueId } from '../../utils/StringUtil';

export default class Menu extends BaseEntity{
	static defaultMenuIconClassName:string = "fas fa-folder";

	code:string = uniqueId();
	name:undefined|string;
	description:undefined|string;
	url:undefined|string;
	pathVariables:undefined|string; 
	iconUrl:undefined|string;
	color:undefined|string;
	fontColor:undefined|string;

	//
	active:undefined|boolean = false;
	menuClass:undefined|string = "fas fa-folder";
	authenticated:undefined|boolean = false;
	showSidebar:undefined|boolean  = false;
	subMenus:undefined|Menu[] = undefined;

	static getIconClassName = (menu:Menu) => {
		if (undefined === menu.menuClass) {
			return Menu.defaultMenuIconClassName;
		}
		return menu.menuClass;
	}
}
