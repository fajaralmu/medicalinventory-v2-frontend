

import EntityProperty from './../settings/EntityProperty';
export default class HeaderProps {

	label:string = "";
	value:string = "";
	isDate:boolean = false;
	filterable:boolean = true;

	public static fromEntityProperty = (prop:EntityProperty) : HeaderProps[] => {
		return EntityProperty.getHeaderLabels(prop);
	}
}