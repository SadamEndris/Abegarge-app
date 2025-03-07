const api_url = import.meta.env.VITE_API_URL;

// A function to send a get request to get all Services
const getServices = async (token) => {
  try {
    const requestOptions = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${token}`,
      },
    };

    const response = await fetch(`${api_url}/api/services`, requestOptions);

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

// A function to send a delete request to delete a Service
const deleteService = async (serviceId, token) => {
  try {
    const requestOptions = {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${token}`,
      },
    };

    const response = await fetch(
      `${api_url}/api/service/${serviceId}`,
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

// Function to add a new service
const addService = async (serviceData, token) => {
  const response = await fetch(`${api_url}/api/service`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(serviceData),
  });

  if (!response.ok) {
    throw new Error("Failed to add service");
  }

  return response.json();
};
// Function to update a service
const updateService = async (serviceId, serviceData, token) => {
  const response = await fetch(`${api_url}/api/service/${serviceId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(serviceData),
  });

  if (!response.ok) {
    throw new Error("Failed to update service");
  }

  return response.json();
};

// export the function
const serviceServices = {
  getServices,
  deleteService,
  addService,
  updateService,
};

export default serviceServices;
