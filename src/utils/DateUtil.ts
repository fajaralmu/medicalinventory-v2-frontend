import { join } from "path";

export const MONTHS = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December"
]

const leapMonths = [ 31, (  29  ), 31, 30, 31, 30, 31, 31, 30, 31, 30, 31 ];
const regularMonths = [ 31, (  28  ), 31, 30, 31, 30, 31, 31, 30, 31, 30, 31 ];
/**
 * 
 * @param {Number} month starts at 0
 */
export const getMonthDays = (month:number) : number=> {
    if(new Date().getFullYear() % 4 == 0){
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

const twoDigits = (value:number) :string => {
    if (value >= 10) {
        return   value.toString();
    }
    return "0"+value;
}



