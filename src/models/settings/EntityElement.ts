import EntityProperty from './EntityProperty';
import { FieldType } from '../FieldType';

export default class EntityElement{
	ignoreBaseField:undefined|boolean;
	id:string="0";
	type:string="text";
	className:undefined|string;
	labelName :string="Label";
	optionItemName:undefined|string;
	optionValueName:undefined|string;
	entityReferenceName:undefined|string;
	entityReferenceClass:undefined|string;
	detailFields:undefined|string;
	multiple:undefined|boolean; 
	defaultValues:undefined|any[];
	plainListValues:any[] = [];
	options:undefined|any[];
	identity:undefined|boolean;
	required:undefined|boolean;  
	editable:boolean = true;
	filterable:boolean = true;
	orderable:boolean = true;

	entityProperty:undefined|EntityProperty;
	additionalMap:undefined|{};
	fieldType:FieldType =FieldType.FIELD_TYPE_TEXT;

	static isList = (el:EntityElement)  :boolean => {
		return el.fieldType === FieldType.FIELD_TYPE_FIXED_LIST || el.fieldType === FieldType.FIELD_TYPE_DYNAMIC_LIST;
	}

}
