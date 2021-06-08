
export default class BaseEntity{
	id:number = -1;
	createdDate?:Date;
	modifiedDate?:Date;
	nulledFields?:string[] | undefined;
	 

}
