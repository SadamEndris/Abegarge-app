// A function to send the login request to the server
const api_url = import.meta.env.VITE_API_URL;
const logIn = async (formData) => {
  try {
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    };
    console.log('About to send request');
    console.log(requestOptions.body);
    const response = await fetch(
      `${api_url}/api/employee/login`,
      requestOptions
    );
    if (!response.ok) {
      throw new Error(`Fetch failed with status: ${response.status}`);
    }

    return response;
  } catch (error) {
    console.error('Fetch failed:', error);
    throw error;
  }
};

// Export the logIn function
const loginService = {
  logIn,
};

export default loginService;
