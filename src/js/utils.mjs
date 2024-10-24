// retrieve data from localstorage
// export function getLocalStorage(key) {
//   const item = localStorage.getItem(key);
//   // return JSON.parse(localStorage.getItem(key));
//   return (item !== null && item !== undefined) ? JSON.parse(item) : null;
// }
export function getLocalStorage(key) {
  const item = localStorage.getItem(key);
  // Check for both null and the string "undefined"
  // netlify build doesn't like "undefined", but with local build it's ok
  if (item === null || item === "undefined") {
      return null;
  }
  try {
      return JSON.parse(item);
  } catch (error) {
      console.error(`Error parsing JSON for key: ${key}`, error);
      return null; // If parsing fails, return null
  }
}
  
  // save data to local storage
export function setLocalStorage(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}

// export function getMyData(id, key) {
  

// Function to convert the string date (MM/DD/YYYY) to a Date object
function convertToDateObj(stringDate) {
  const [month, day, year] = stringDate.split('/'); 
  return new Date(year, month - 1, day); //return a date object with string values
}

// Function to compare the two dates
export function isSameDateObj(apiDate, selectedDate) {
  const apiDateObj = convertToDateObj(apiDate); // Convert API date to Date object
  const selectedDateObj = new Date(selectedDate); // Convert selected date (Mon Oct 14 2024) to Date object

  // Compare the two dates (year, month, day)
  return apiDateObj.getFullYear() === selectedDateObj.getFullYear() &&
         apiDateObj.getMonth() === selectedDateObj.getMonth() &&
         apiDateObj.getDate() === selectedDateObj.getDate();
}

export function convertToDateString(selectedDate) {
  const dateObj = new Date(selectedDate);  // Convert the string into a Date object

  // Get the month, day, and year from the Date object
  const month = (dateObj.getMonth() + 1);   
  const day = dateObj.getDate();          
  const year = dateObj.getFullYear();                                
  
  // Return the date in MM/DD/YYYY format
  return `${month}/${day}/${year}`;
}

// convert 12-hour time to 24-hour time for sorting
// got help with this one.
export function convertTo24Hour(timeStr) {
  const [time, modifier] = timeStr.toLowerCase().split(/(a|p)/); // Split into time and AM/PM
  let [hours, minutes] = time.split(':').map(Number);

  if (modifier === 'p' && hours !== 12) {
    hours += 12; // Convert PM to 24-hour time, except for 12 PM
  }
  if (modifier === 'a' && hours === 12) {
    hours = 0; // Convert 12 AM to 00:00 in 24-hour time
  }

  // Format the result into "HH:mm" format
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
}