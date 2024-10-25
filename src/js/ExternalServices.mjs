// const binId = process.env.PARCEL_BIN_ID;
// const apiKey = process.env.PARCEL_API_MASTER_KEY;
//const baseURL='https://api.jsonbin.io/v3/b/'
// const baseURL=process.env.PARCEL_URL;


import { convertToDateString } from "./utils.mjs";

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

export default class ExternalServices {
  //constructor
  constructor (baseURL, binId, apiKey) {          
    this.baseURL = baseURL;
    this.binId = binId;    
    this.apiKey = apiKey;
    
  }

  
  async getMyData() {
    
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

  async getFilteredDataByDay(selectedDate) {
    try {
      const response = await fetch(this.baseURL + `${this.binId}/latest`, {
        method: "GET",
        headers: {
            "X-Master-Key": this.apiKey
          }
      });
      const myData = await response.json();
      const formattedDate = convertToDateString(selectedDate);
      const filteredData = myData.record.filter(item=> item.When && item.When === formattedDate);
      console.log('filteredData in ES: ', filteredData);
      return filteredData;
    } catch (error) {
      console.error('Error fetching or filtering data:', error);
    }
  }

  //?jsonPath=${encodeURIComponent(jsonPath)
  async getDataByTime(selectedDate = '10/14/2024', selectedTime = '9:00a') {
    try {
      console.log('inside getDataByTime', selectedDate, selectedTime);
      // const jsonPath = `$.record[?(@.When == '${selectedDate}'${selectedTime ? ` && @.Time == '${selectedTime}'` : ''})]`;
      // const jsonPath = "$.record[?(@.When == '10/14/2024')]";
      const jsonPath = `$[?(@.When == '${selectedDate}'${selectedTime ? ` && @.Time == '${selectedTime}'` : ''})]`;

      const response = await fetch(this.baseURL + `${this.binId}/latest?meta=false`, {
        method: "GET",
        headers: {
            "X-Master-Key": this.apiKey,
            'X-JSON-Path': jsonPath
          }
        });

      const myData = await response.json();
      console.log('myData in getDataByTime', myData);      
      // Convert selected date to the format used in the JSON data
      const formattedDate = convertToDateString(selectedDate);
      
      // Filter the data by the selected date
      // let filteredData = myData.record.filter(item => item.When && item.When === formattedDate);
      
      // If a selected time is provided, filter by time as well
      // if (selectedTime) {
      //     filteredData = filteredData.filter(item => item.Time && item.Time === selectedTime);
      // }

      // Return the filtered data
      // console.log('Filtered Data by Date and Time:', filteredData);
      // return filteredData;
      // return myData;
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
    
  