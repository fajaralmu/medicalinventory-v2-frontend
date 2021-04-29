import EntityProperty from './EntityProperty';
import { FieldType } from '../FieldType';

export default class EntityElement{
	ignoreBaseField?:boolean;
	id:string="0";
	type:string="text";
	className?:string;
	labelName :string="Label";
	optionItemName?:string;
	optionValueName?:string;
	entityReferenceName?:string;
	entityReferenceClass?:string;
	detailFields?:string;
	multiple?:boolean; 
	defaultValues?:any[];
	plainListValues:any[] = [];
	options?:any[];
	identity?:boolean;
	required?:boolean;  
	editable:boolean = true;
	filterable:boolean = true;
	orderable:boolean = true;

	entityProperty?:EntityProperty;
	additionalMap?:{};
	fieldType:FieldType =FieldType.FIELD_TYPE_TEXT;

	static isList = (el:EntityElement)  :boolean => {
		return el.fieldType == FieldType.FIELD_TYPE_FIXED_LIST || el.fieldType == FieldType.FIELD_TYPE_DYNAMIC_LIST;
	}

}
