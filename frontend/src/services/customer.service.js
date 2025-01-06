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

// Export all the functions
const customerService = {
  createCustomer,
};

export default customerService;
