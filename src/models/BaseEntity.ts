
export default class BaseEntity{
	id?:undefined|number = undefined;
	createdDate?:Date;
	modifiedDate?:Date;
	nulledFields?:string[] | undefined;

	// get identity(){
	// 	if (this.id && this.id != undefined) return this.id;
	// 	return 0;
	// }
	 

}
