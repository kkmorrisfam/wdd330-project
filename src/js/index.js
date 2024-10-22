import Calendar from "./Calendar.mjs";
import ExternalServices from "./ExternalServices.mjs";

const binId = process.env.PARCEL_BIN_ID;
const apiKey = process.env.PARCEL_API_MASTER_KEY;

document.addEventListener('DOMContentLoaded', ()=> {
    const calendar = new Calendar();
});



let dateToday = new Date();

//console logs to see what value I can get
console.log(dateToday);  //Fri Oct 18 2024 15:36:56 GMT-0700 (Pacific Daylight Time)
console.log(dateToday.getFullYear()); //2024
console.log(dateToday.getMonth());  //9  index starting at zero, so Oct = 9
console.log(dateToday.getDate());   //18
console.log(dateToday.getHours());  //15
console.log(dateToday.getMinutes());  //38
console.log(dateToday.getSeconds());  //44





const myAPIData = new ExternalServices(binId, apiKey);
// myAPIData.getMyData().then(data=>{console.log('Fetched Data', data)});
// console.log('myData');
// const myData = myAPIData.getMyData();  //still just gets a promise this way
// console.log('myData ' + myData);

myAPIData.getMyData().then(myData => {
    console.log('myData ', myData);
});