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
    // const response = await fetch(`https://api.jsonbin.io/v3/b/${this.binId}/latest`, {
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

  

} //end class

//set local storage here with value?

    //can I work these options into one method or do I need multiple methods?
    //get Filtered Data By Day
    //get Filtered Data by Day & Time
    //get Filtered Data by Day & Client
    
  