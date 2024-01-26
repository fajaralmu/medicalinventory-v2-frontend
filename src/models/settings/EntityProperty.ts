
import EntityElement from "./EntityElement";
import { FieldType } from "../FieldType";
import HeaderProps from '../common/HeaderProps'; 

export default class EntityProperty{
    
	entityName:string = '';
	alias:undefined|string;
	fieldNames:undefined|string;
	idField:undefined|string;
	detailFieldName:undefined|string; 
	editable:boolean = true;
	deletable:boolean = true;
	creatable:boolean = true; 
	elements:EntityElement[] = new Array();
	fieldNameList:undefined|string[]; 
	withProgressWhenUpdated:boolean = false;
	public addElement = (element:EntityElement) => {
		this.elements.push(element);
	}
	public setOrder = (...properties:String[]) =>{
		const elements:EntityElement[] = [];
		for (let i = 0; i < this.elements.length; i++) {
			const index = properties.indexOf(this.elements[i].id);
			if (index >= 0) {
				elements[index] = this.elements[i];
			}
		}
		//remove nulls
		this.elements = elements.filter(function (el) {
			return el != null;
		 });
	}
	public keepProperties = (...properties: String[])=>{
		const elements:EntityElement[] = [];
		loop:for (let i = 0; i < this.elements.length; i++) {
			 for (let p = 0; p < properties.length; p++) {
				const id = properties[p];
				if (this.elements[i].id === id) {
					elements.push(this.elements[i]);
					continue loop;
				}
			}
		}
		this.elements = elements;
		console.debug("new elements: {}", this.elements);
    }

//////////////////

	static getEntityElement = (prop: EntityProperty, id:string) :EntityElement|undefined => {
		for (let i = 0; i < prop.elements.length; i++) {
			const element = prop.elements[i];
			if (element.id === id) {
				return element;
			}
		}
		return undefined;
	}

	static getHeaderLabels = (prop:EntityProperty) : HeaderProps[] => {
		const result:HeaderProps[] = new Array();
		if (prop.elements === undefined) {
			return result;
		}
		const elements:EntityElement[] = prop.elements;
		for (let i = 0; i < elements.length; i++) {
			
			const element = elements[i];
			const header:HeaderProps=  {
				label:element.labelName??element.id,
				value:element.id,
				isDate:element.type === 'date',
				filterable: element.filterable,
				orderable: element.orderable
			};
			result.push(header);
		}
		return result;
	}

	static getRecordId(record:any, prop:EntityProperty) {
		const elements = prop.elements;
		for (let i = 0; i < elements.length; i++) {
			const element = elements[i];
			if (element.identity) {
				return record[element.id];
			}
		}
		return null;
	}

	static hasTextEditorField = (elements:EntityElement[]) => {
		for (let i = 0; i < elements.length; i++) {
			if(elements[i].fieldType === FieldType.FIELD_TYPE_TEXTEDITOR) return true;
			
		}
		return false;
	}

}
