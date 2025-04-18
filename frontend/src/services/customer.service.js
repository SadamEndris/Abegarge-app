const api_url = import.meta.env.VITE_API_URL;

// A function to send post request to create a new customer
const createCustomer = async (formData, token) => {
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

    const response = await fetch(`${api_url}/api/add-customer`, requestOptions);

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
const getCustomers = async (token) => {
  try {
    const requestOptions = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${token}`,
      },
    };

    const response = await fetch(
      `${api_url}/api/all-customers`,
      requestOptions
    );

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
const getCustomerById = async (id, token) => {
  const requestOptions = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      authorization: `Bearer ${token}`,
    },
  };
  const response = await fetch(
    `${api_url}/api/customers/${id}`,
    requestOptions
  );
  return response;
};

const updateCustomer = async (id, formData, token) => {
  const requestOptions = {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(formData),
  };
  const response = await fetch(
    `${api_url}/api/update-customer/${id}`,
    requestOptions
  );
  return response;
};

// Export all the functions
const customerService = {
  createCustomer,
  getCustomers,
  getCustomerById,
  updateCustomer,
};

export default customerService;
