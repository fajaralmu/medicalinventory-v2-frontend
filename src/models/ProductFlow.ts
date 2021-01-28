
import Transaction from './Transaction'; 
import BaseEntity from './BaseEntity';
import Product from './Product';

export default class ProductFlow extends BaseEntity{
	transaction?:Transaction;
	product?:Product;
	expiredDate?:Date;
	count?:number; 
	suitable?:boolean;
	price?:number;
	generic?:boolean;
	hargaPerItem?:number;
	hargatotal?:number;
	jumlahobatLama?:number;
	namaobat?:string;
	terdaftar?:boolean;
	sudah_diedit?:boolean;

}
