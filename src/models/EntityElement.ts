import EntityProperty from './EntityProperty';
import { FieldType } from './FieldType';

export default class EntityElement{
	ignoreBaseField?:boolean;
	isGrouped?:boolean;
	id:string="0";
	type:string="text";
	className?:string;
	lableName :string="Label";
	jsonList?:string;
	optionItemName?:string;
	optionValueName?:string;
	entityReferenceName?:string;
	entityReferenceClass?:string;
	detailFields?:string;
	inputGroupname?:string;
	previewLink?:string;
	defaultValues?:any[];
	plainListValues:any[] = [];
	options?:any[];
	identity?:boolean;
	required?:boolean;
	idField?:boolean;
	skipBaseField?:boolean;
	hasJoinColumn?:boolean;
	multiple?:boolean;
	showDetail?:boolean;
	detailField?:boolean;
	multipleSelect?:boolean;
	hasPreview?:boolean;
	entityProperty?:EntityProperty;
	additionalMap?:{};
	fieldType:FieldType =FieldType.FIELD_TYPE_TEXT;

	static isList = (el:EntityElement)  :boolean => {
		return el.fieldType == FieldType.FIELD_TYPE_FIXED_LIST || el.fieldType == FieldType.FIELD_TYPE_DYNAMIC_LIST;
	}

}
