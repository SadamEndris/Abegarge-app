const api_url = import.meta.env.VITE_API_URL;

// A function to send post request to create a new employee
const createEmployee = async (formData, loggedInEmployeeToken) => {
  try {
    const requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-access-token": loggedInEmployeeToken,
      },
      body: JSON.stringify(formData),
    };

    console.log("Request options:", requestOptions);

    const response = await fetch(`${api_url}/api/employee`, requestOptions);

    // if (!response.ok) {
    //   throw new Error(`Fetch failed with status: ${response.status}`);
    // }

    // Return parsed JSON response for easier data handling
    return response;
  } catch (error) {
    console.error("Fetch failed:", error);
    throw error;
  }
};

// Export all the functions
const employeeService = {
  createEmployee,
};

export default employeeService;
