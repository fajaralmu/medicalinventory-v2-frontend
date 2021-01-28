import BaseEntity from './BaseEntity';
import Unit from './Unit';

export default class Product extends BaseEntity{
	code?:string;
	name?:string;
	description?:string;
	unit?:Unit;
	utilityTool?:boolean;
	jmlobat?:number;
	stokaman?:number;
	nextorder?:number;
	hargasatuan?:number;
	kumulatifpakai?:number;
	kelas?:string;
	pemakaian?:number;
	keterangan?:string;
	imageNames?:string;

}
