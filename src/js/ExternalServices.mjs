// const binId = process.env.PARCEL_BIN_ID;
// const apiKey = process.env.PARCEL_API_MASTER_KEY;

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
  constructor (binId, apiKey) {          
    this.binId = binId;
    this.apiKey = apiKey;
  }

  
  async getMyData() {
    const response = await fetch(`https://api.jsonbin.io/v3/b/${this.binId}/latest`, {
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
    // .then(response => {
    //   if (!response.ok) {
    //     throw new Error('Network response was not ok ' + response.statusText);
    //     }
    //   // console.log('response' + response);  //returns promise
    //   // console.log('resonse.json()' + response.json());  //returns promise
    //   return response.json();  
    // })
    // .then(data => {
    //   console.log('in class:')
    //   console.log(data);  
    // })
    // .catch(error => {
    //   console.error('There has been a problem with your fetch operation:', error);
    // });  
  // }
}

//set local storage here with value?

    //can I work these options into one method or do I need multiple methods?
    //get Filtered Data By Day
    //get Filtered Data by Day & Time
    //get Filtered Data by Day & Client
    
  