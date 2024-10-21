import Calendar from "./Calendar.mjs";

// require('dotenv').config();  //this causes errors in build

document.addEventListener('DOMContentLoaded', ()=> {
    const calendar = new Calendar();
});



// let dateToday = new Date();

// //console logs to see what value I can get
// console.log(dateToday);  //Fri Oct 18 2024 15:36:56 GMT-0700 (Pacific Daylight Time)
// console.log(dateToday.getFullYear()); //2024
// console.log(dateToday.getMonth());  //9  index starting at zero, so Oct = 9
// console.log(dateToday.getDate());   //18
// console.log(dateToday.getHours());  //15
// console.log(dateToday.getMinutes());  //38
// console.log(dateToday.getSeconds());  //44

// Replace with your actual BIN_ID and API_KEY
//currently works with api key, but not with variable
const binId = process.env.BIN_ID;
const apiKey = process.env.API_MASTER_KEY;

function getMydata() {
    fetch(`https://api.jsonbin.io/v3/b/${binId}/latest`, {
    method: "GET",
    headers: {
        "X-Master-Key": apiKey
    }
    })
    .then(response => {
        if (!response.ok) {
        throw new Error('Network response was not ok ' + response.statusText);
        }
        return response.json();  
    })
    .then(data => {
        console.log(data);  
    })
    .catch(error => {
        console.error('There has been a problem with your fetch operation:', error);
    });

}

const myData = getMydata();
console.log('myData');
