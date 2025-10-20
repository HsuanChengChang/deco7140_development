// A utility function to submit form data via POST request
const postFormData = async (formEl, endpointUrl, customHeaders = {}) => {
    // Create a FormData object from the given form element
    const formData = new FormData(formEl);

    try {
        // Send the POST request using fetch API
        const response = await fetch(endpointUrl, {
            method: "POST",
            headers: customHeaders, // Allow adding optional custom headers
            body: formData,         // The form data is sent as the request body
        });

        // Parse the server response as JSON
        const data = await response.json();

        // Return a success flag and the response data
        return {
            success: response.ok,
         // Ensure HTTP status and server status both indicate success
            data,
        };
    } catch (error) {
        // Handle network or server errors gracefully
        return {
            success: false,
            data: { message: "Network or server error.", error },
        };
    }
};

// Export the function for use in other modules
export { postFormData };