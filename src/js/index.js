import Calendar from "./Calendar.mjs";

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
const binId = "67105963ad19ca34f8b9cf6b";
const apiKey = "$2a$10$mlDNyCpYZTMLYq6N57nb4.uwF0MLWmq5H2Y3IAZLE7FAr.9Sl69ni";

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
        return response.json();  // Parse the JSON from the response
    })
    .then(data => {
        console.log(data);  // Work with the retrieved data
    })
    .catch(error => {
        console.error('There has been a problem with your fetch operation:', error);
    });

}

const myData = getMydata();
console.log('myData');
