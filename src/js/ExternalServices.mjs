import { convertToDateString } from "./utils.mjs";

const binId = process.env.PARCEL_BIN_ID;
const apiKey = process.env.PARCEL_API_MASTER_KEY;
const baseURL=process.env.PARCEL_URL;


async function convertToJson(res) {
    const jsonResponse = await res.json();  // Convert the response to JSON first
    
    if (res.ok) {
      return jsonResponse;  // If response is okay, return the JSON data
    } else {
      // Throw a custom error object with the response body
      throw { 
        name: 'servicesError', 
        message: jsonResponse 
      };
    }
  }


//normalize date to MM/DD/YYYY
const padMMDDYYYY = (dateStr) => {
  if (!dateStr || typeof dateStr !== "string") return null;

  const parts = dateStr.split("/");
  if (parts.length !== 3) return null;

  const [monthRaw, dayRaw, yearRaw] = parts;

  const mm = String(parseInt(monthRaw, 10)).padStart(2, "0");
  const dd = String(parseInt(dayRaw, 10)).padStart(2, "0");
  let yyyy = String(parseInt(yearRaw, 10));

  // add 20 to year if only two numbers (2/9/26 -> 02/09/2026)
  if (yyyy.length === 2) {
    yyyy = `20${yyyy}`;
  }

  if (!yyyy || yyyy.length !== 4) return null;

  return `${mm}/${dd}/${yyyy}`;
};

const normalizeTime = (timeStr) => {
  return String(timeStr ?? "")
    .trim()
    .toLocaleLowerCase()
    .replace(/\s+/g, "");
}

export default class ExternalServices {
  //constructor
  constructor () {          
    this.baseURL = baseURL;
    this.binId = binId;    
    this.apiKey = apiKey;
    
  }


  //test function to get all data - this is working
  async getMyData() {
   try{   
      const response = await fetch(this.baseURL + `${this.binId}/latest`, {  
        method: "GET",
        headers: {
            "X-Master-Key": this.apiKey
          }
      });
      if (!response.ok) {
        throw new Error('Network response was not ok ' + response.statusText);
      }

      const data = await response.json();
      return data;  // Return the fetched data here
    } catch (error) {
      console.error('There has been a problem with your fetch operation:', error);
    }
  }

  async getFilteredDataByDay(selectedDate) {
    try {
      const response = await fetch(this.baseURL + `${this.binId}/latest`, {
        method: "GET",
        headers: {
            "X-Master-Key": this.apiKey
          }
      });
      const myData = await response.json();
      // console.log('Data for ColumnOne after response.json(): ', myData);
      const formattedDate = convertToDateString(selectedDate);
      

      const targetDate = padMMDDYYYY(formattedDate);  

      //normalize filtered data
      const filteredData = myData.record.filter((item)=> {
        if(!item.When) return false;
        return padMMDDYYYY(item.When) === targetDate;
      });

      // console.log("Target date: ", targetDate);
      // console.log("Matches found: ", filteredData.length);
     
      return filteredData;
    } catch (error) {
      console.error('Error fetching or filtering data:', error);
    }
  }


  async getDataByTime(selectedDate, selectedTime = '9:00a') {
    try {
      // console.log('inside getDataByTime', selectedDate, selectedTime);      
      
      //normalize date and time
      const normalDate = padMMDDYYYY(convertToDateString(selectedDate));
      const normalTime = normalizeTime(selectedTime);

      // const jsonPath = `$[?(@.When == '${dateForQuery}' && @.Time == '${timeForQuery}')]`;
      
      const response = await fetch(this.baseURL + `${this.binId}/latest?meta=false`, {
        method: "GET",
        headers: {
            "X-Master-Key": this.apiKey,
            // 'X-JSON-Path': jsonPath
          }
        });

      const myData = await response.json();
      // console.log('myData in getDataByTime after response.json()', myData);      
      
      // handle both array or record object of arrays
      const records = Array.isArray(myData) ? myData : myData?.record;

      if (!Array.isArray(records)) {
        console.warn("Unexpected data type/shape: ", myData);
        return [];
      }

      const matches = records.filter((item) => {
        if (!item.When || !item.Time) return false;

        const itemDate = padMMDDYYYY(item.When);
        const itemTime = normalizeTime(item.Time);

        return itemDate === normalDate && itemTime === normalTime;
      })

      // console.log("Normalized Date/Time: ", normalDate, normalTime);
      // console.log("Time Matches found: ", matches.length);

      return matches;
    } catch (error) {
        console.error('Error fetching or filtering data by date and time:', error);
        return [];
    }
  }  

} //end class




//set local storage here with value?

    //can I work these options into one method or do I need multiple methods?
    //get Filtered Data By Day
    //get Filtered Data by Day & Time
    //get Filtered Data by Day & Client
    
  