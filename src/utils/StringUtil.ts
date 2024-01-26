let index = 1;
export const uniqueId = function () {
  let string = new String(new Date().getUTCMilliseconds()).toString();
  index++;
  return index + "-" + string;
}

export const greeting = (): string => {

  let hour = new Date().getHours();
  let time: string = "Datang";
  if (hour >= 3 && hour < 11) {
    time = "Pagi";
  } else if (hour >= 11 && hour < 15) {
    time = "Siang";
  } else if (hour >= 15 && hour < 18) {
    time = "Sore";
  } else {
    time = "Malam";
  }

  return "Selamat " + time;

}

export function beautifyNominal(val: any) {
  return new String(val).toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");

}

const months = [
  "January", "Ferbuary", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
]

export const monthYearString = function (m, y) {
  if (!m || !y) {
    return "-";
  }
  return months[m - 1] + " " + y;
}

export const base64StringFileSize = (base64String: string): number => {
  if (base64String.includes(",")) {
    base64String = base64String.split(",")[1];
  }
  var stringLength = base64String.length;

  var sizeInBytes = 4 * Math.ceil((stringLength / 3)) * 0.5624896334383812;
  var sizeInKb = sizeInBytes / 1000;
  return sizeInBytes;
}
export const twoDigits = (value: number): string => {
  if (value >= 10) {
    return value.toString();
  }
  return "0" + value;
}