import BaseEntity from './BaseEntity';
import Unit from './Unit';
import { baseImageUrl } from './../constant/Url';

export default class Product extends BaseEntity{
	code?:string;
	name?:string;
	description?:string;
	unit?:Unit;
	utilityTool?:boolean;
	imageNames?:string;

	getDefaultImageUrl():string {
		if (this.imageNames == undefined) return baseImageUrl()+"default.bmp";
		return  baseImageUrl()+this.imageNames.split("~")[0];
	}

}
