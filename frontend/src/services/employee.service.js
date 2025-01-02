const api_url = import.meta.env.VITE_API_URL;

// A function to send post request to create a new employee
const createEmployee = async (formData, token) => {
  try {
    const requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(formData),
    };

    console.log("Request options:", requestOptions);

    const response = await fetch(`${api_url}/api/employee`, requestOptions);

    if (!response.ok) {
      throw new Error(`Fetch failed with status: ${response.status}`);
    }

    // Return parsed JSON response for easier data handling
    return response;
  } catch (error) {
    console.error("Fetch failed:", error);
    throw error;
  }
};

// A function to send a get request to get all the employees
const getEmployees = async (token) => {
  try {
    const requestOptions = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${token}`,
      },
    };

    const response = await fetch(`${api_url}/api/employees`, requestOptions);

    if (!response.ok) {
      throw new Error(`Fetch failed with status: ${response.status}`);
    }

    // Return response
    return response;
  } catch (error) {
    console.error("Fetch failed:", error);
    throw error;
  }
};

// A function to get employee by ID
const getEmployeeById = async (id, token) => {
  const requestOptions = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      authorization: `Bearer ${token}`,
    },
  };
  const response = await fetch(`${api_url}/api/employee/${id}`, requestOptions);
  return response;
};

// A function to update an employee
const updateEmployee = async (id, formData, token) => {
  const requestOptions = {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(formData),
  };
  const response = await fetch(`${api_url}/api/employee/${id}`, requestOptions);
  return response;
};

// A function to Delete an employee by ID (Admin only)
const deleteEmployee = async (id, token) => {
  const requestOptions = {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      authorization: `Bearer ${token}`,
    },
  };
  return await fetch(`${api_url}/api/employee/${id}`, requestOptions);
};

// Export all the functions
const employeeService = {
  createEmployee,
  getEmployees,
  getEmployeeById,
  updateEmployee,
  deleteEmployee,
};

export default employeeService;
