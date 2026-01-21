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


//normalize date
const padMMDDYYYY = (dateStr) => {
  const [m, d, y] = dateStr.split("/");
  return `${String(Number(m)).padStart(2,"0")}/${String(Number(d)).padStart(2, "0")}/${y}`;
};

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

      console.log("Target date: ", targetDate);
      console.log("Matches found: ", filteredData.length);
     
      return filteredData;
    } catch (error) {
      console.error('Error fetching or filtering data:', error);
    }
  }


  async getDataByTime(selectedDate, selectedTime = '9:00a') {
    try {
      // console.log('inside getDataByTime', selectedDate, selectedTime);
      // const jsonPath = `$[?(@.When == '${selectedDate}'${selectedTime ? ` && @.Time == '${selectedTime}'` : ''})]`;
      const dateForQuery = padMMDDYYYY(convertToDateString(selectedDate));
      const timeForQuery = (selectedTime|| "").trim();

      const jsonPath = `$[?(@.When == '${dateForQuery}' && @.Time == '${selectedTime}')]`;
      const response = await fetch(this.baseURL + `${this.binId}/latest?meta=false`, {
        method: "GET",
        headers: {
            "X-Master-Key": this.apiKey,
            'X-JSON-Path': jsonPath
          }
        });

      const myData = await response.json();
      console.log('myData in getDataByTime after response.json()', myData);      
      
      return myData;
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
    
  