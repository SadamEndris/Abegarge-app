// A function to send post request to create a new employee
const api_url = import.meta.env.VITE_API_URL;
const createEmployee = async (formData) => {
  try {
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    };

    const response = await fetch(`${api_url}/api/employee`, requestOptions);

    if (!response.ok) {
      throw new Error(`Fetch failed with status: ${response.status}`);
    }

    return response;
  } catch (error) {
    console.error('Fetch failed:', error);
    throw error;
  }
};

// Export all the functions
const employeeService = {
  createEmployee,
};

export default employeeService;
