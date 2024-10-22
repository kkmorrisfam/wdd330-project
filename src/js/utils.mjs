// retrieve data from localstorage
export function getLocalStorage(key) {
    return JSON.parse(localStorage.getItem(key));
  }
  // save data to local storage
export function setLocalStorage(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}

// export function getMyData(id, key) {
  

// Function to convert the string date (MM/DD/YYYY) to a Date object
function convertToDate(stringDate) {
  const [month, day, year] = stringDate.split('/'); 
  return new Date(year, month - 1, day); //return a date object with string values
}

// Function to compare the two dates
export function isSameDate(apiDate, selectedDate) {
  const apiDateObj = convertToDate(apiDate); // Convert API date to Date object
  const selectedDateObj = new Date(selectedDate); // Convert selected date (Mon Oct 14 2024) to Date object

  // Compare the two dates (year, month, day)
  return apiDateObj.getFullYear() === selectedDateObj.getFullYear() &&
         apiDateObj.getMonth() === selectedDateObj.getMonth() &&
         apiDateObj.getDate() === selectedDateObj.getDate();
}
