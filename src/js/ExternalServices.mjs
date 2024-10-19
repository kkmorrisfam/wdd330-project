


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


    //init

    //
  }