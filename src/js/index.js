import Calendar from "./Calendar.mjs";
import ExternalServices from "./ExternalServices.mjs";


const binId = process.env.PARCEL_BIN_ID;
const apiKey = process.env.PARCEL_API_MASTER_KEY;
const baseURL=process.env.PARCEL_URL;

//load calendar on screen load
document.addEventListener('DOMContentLoaded', ()=> {
    const calendar = new Calendar();
    // const selectedDate = calendar.getSelectedDate();
    // console.log('Selected date:', selectedDate);    
    document.querySelector('.days').addEventListener('click', () => {
        const selectedDate = calendar.getSelectedDate();  // Get the selected date
        if (selectedDate) {
            console.log('Selected date:', selectedDate);  // Log it when a date is clicked
            //get new updated data with click.  Is there where I want this?
            const myfilteredData = new ExternalServices(baseURL, binId, apiKey);
            myfilteredData.getFilteredDataByDay(selectedDate).then(filteredData=> {console.log('Filtered Data: ', filteredData)});
        }
    });
});






//get data test
const myAPIData = new ExternalServices(baseURL, binId, apiKey);

myAPIData.getMyData().then(myData => {
    console.log('myData ', myData);
});



// let dateToday = new Date();

//console logs to see what value I can get
// console.log(dateToday);  //Fri Oct 18 2024 15:36:56 GMT-0700 (Pacific Daylight Time)
// console.log(dateToday.getFullYear()); //2024
// console.log(dateToday.getMonth());  //9  index starting at zero, so Oct = 9
// console.log(dateToday.getDate());   //18
// console.log(dateToday.getHours());  //15
// console.log(dateToday.getMinutes());  //38
// console.log(dateToday.getSeconds());  //44
