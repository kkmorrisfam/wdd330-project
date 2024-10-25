import Calendar from "./Calendar.mjs";
import ExternalServices from "./ExternalServices.mjs";
import { getLocalStorage, setLocalStorage } from "./utils.mjs";
import Column from "./Column.mjs";
import { addHeaderFooter } from "./headerFooter.mjs";
import { darkMode } from "./darkMode.mjs";

const binId = process.env.PARCEL_BIN_ID;
const apiKey = process.env.PARCEL_API_MASTER_KEY;
const baseURL=process.env.PARCEL_URL;

//load calendar on screen load
document.addEventListener('DOMContentLoaded', ()=> {
    const calendar = new Calendar();
    addHeaderFooter();
    darkMode();
    
    //get local storage if there is anything there.
    const storedDataByDay = getLocalStorage('filtered-by-day') || null;
    
    console.log('storedDataByDate: ', storedDataByDay);
    // if (storedDataByDay === undefined || storedDataByDay === null) storedDataByDay = [];
    
    //if there's a date in local storage, then load the first column with that date
    if (storedDataByDay && storedDataByDay.length > 0){
        const selectedDate = storedDataByDay[0]?.When || calendar.getSelectedDate();
        console.log('Loaded data from Local Storage:', storedDataByDay);
        const column = new Column(storedDataByDay, selectedDate);
        column.renderColumnOne();
        }
        
    
    document.querySelector('.days').addEventListener('click', () => {
        const selectedDate = calendar.getSelectedDate();  // Get the selected date
        if (selectedDate) {
            console.log('Selected date:', selectedDate);  // Log it when a date is clicked
            //get new updated data with click.  Is here where I want this?           
            const myfilteredData = new ExternalServices(baseURL, binId, apiKey);            
            myfilteredData.getFilteredDataByDay(selectedDate)            
            .then(filteredData=> {
                console.log('Filtered Data in index: ', filteredData);
                setLocalStorage('filtered-by-day', filteredData);
                const columnOne = new Column(filteredData, selectedDate);
                console.log('selectedDate after creating columnOne: ', selectedDate)
                columnOne.renderColumnOne();
            });
        }

        //test 
        const newAPICall = new ExternalServices(baseURL, binId, apiKey);
        console.log('selectedDate before getDataByTime called: ', selectedDate);
        newAPICall.getDataByTime(selectedDate, '9:00a')
            .then(newArray => {
                console.log('newAPICall1: ', newArray);     //returns the array of json data   
            })
            .catch(error => {
                console.error('Error fetching data by time:', error);
            });
        // console.log('newAPICall2: ', newArray); //still returns promise, but fulfilled, not array

    });
});  //end of eventListener on initial load

// const newAPICall = new ExternalServices(baseURL, binId, apiKey);
// const newArray = newAPICall.getDataByTime()

// document.addEventListener('DOM')

//get data test
// const myAPIData = new ExternalServices(baseURL, binId, apiKey);

// myAPIData.getMyData().then(myData => {
//     console.log('myData ', myData);
// });



// let dateToday = new Date();

//console logs to see what value I can get
// console.log(dateToday);  //Fri Oct 18 2024 15:36:56 GMT-0700 (Pacific Daylight Time)
// console.log(dateToday.getFullYear()); //2024
// console.log(dateToday.getMonth());  //9  index starting at zero, so Oct = 9
// console.log(dateToday.getDate());   //18
// console.log(dateToday.getHours());  //15
// console.log(dateToday.getMinutes());  //38
// console.log(dateToday.getSeconds());  //44
