import { join } from "path";

export const MONTHS = [
    "Januari",
    "Februari",
    "Maret",
    "April",
    "Mei",
    "Juni",
    "Juli",
    "Ahustus",
    "September",
    "Oktober",
    "November",
    "Desember"
]

const leapMonths = [ 31, (  29  ), 31, 30, 31, 30, 31, 31, 30, 31, 30, 31 ];
const regularMonths = [ 31, (  28  ), 31, 30, 31, 30, 31, 31, 30, 31, 30, 31 ];
/**
 * 
 * @param {Number} month starts at 0
 */
export const getCurrentMonthDays = (month:number) : number=> {
    if(new Date().getFullYear() % 4 == 0){
        return leapMonths[month];
    }
    return regularMonths[month];
}
export const getMonthDays = (month:number, year:number) : number=> {
    if(year % 4 == 0){
        return leapMonths[month];
    }
    return regularMonths[month];
}
 
export const getCurrentMMYY = () => {
    return [new Date().getMonth() + 1, new Date().getFullYear()];
}

export const getInputReadableDate = (date:Date) :string => {
    const year = date.getFullYear();

    const arr = [year, twoDigits(date.getMonth()+1), twoDigits(date.getDate())];
    return arr.join("-");
}
export function addDays(date:Date, days:number) :Date{
    const result:Date = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  }
  export const getDiffDays = (a:Date, b:Date) : number => {
    // Discard the time and time-zone information.

    console.debug("DIFF DATE ",a," vs ", b);
    const _MS_PER_DAY = 1000 * 60 * 60 * 24;
    const utc1 = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate());
    const utc2 = Date.UTC(b.getFullYear(), b.getMonth(), b.getDate()); 
    return Math.floor((utc2 - utc1) / _MS_PER_DAY);
}
const twoDigits = (value:number) :string => {
    if (value >= 10) {
        return   value.toString();
    }
    return "0"+value;
}



