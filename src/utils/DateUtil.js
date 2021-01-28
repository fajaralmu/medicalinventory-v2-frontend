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

const kabisatMonths = [ 31, (  29  ), 31, 30, 31, 30, 31, 31, 30, 31, 30, 31 ];
const regularMonths = [ 31, (  28  ), 31, 30, 31, 30, 31, 31, 30, 31, 30, 31 ];
/**
 * 
 * @param {Number} month starts at 0
 */
export const getMonthDays = (month) => {
    if(new Date().getFullYear() % 4 == 0){
        return kabisatMonths[month];
    }
    return regularMonths[month];
}

/**
 * 
 */
export const getCurrentMMYY = () => {
    return [new Date().getMonth() + 1, new Date().getFullYear()];
}

