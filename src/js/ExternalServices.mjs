//Do I need to put json test data into public folder?
//How do I add an env file with parcel?

//baseURL = 


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

  export default ExternalServices() {
    //constructor
    constructor () {    
    }
  
    //getData
    //setData

    //can I work these options into one method or do I need multiple methods?
    //get Filtered Data By Day
    //get Filtered Data by Day & Time
    //get Filtered Data by Day & Client
    
  }