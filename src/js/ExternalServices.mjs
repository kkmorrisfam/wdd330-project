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
  
    async getData(category) {    //set default value for category if nothing is passed
    try {
    const response = await fetch(baseURL + `products/search/${category}`);   
    const data = await convertToJson(response);

    return data.Result;
    } catch (error) {
      console.error('Error fetching product data in getData:', error);
    }

    //init

    //
  }