// Import the helper function for submitting form data via POST
import { postFormData } from "./modules/postFormData.js";

// Wait until the entire HTML document has finished loading
document.addEventListener("DOMContentLoaded", () => {
    // Select the form element by its ID
    const form = document.getElementById("community-form");
    // Select the feedback element where messages will be displayed
    const feedback = document.getElementById("form-feedback");

    // Add an event listener for the form submission
    form.addEventListener("submit", async (e) => {
        e.preventDefault(); // Prevent the default form submission (page reload)

        // Show a temporary status message to the user
        feedback.textContent = "Submitting...";

        // Call the reusable postFormData function to send form data to the API
        const { success, data } = await postFormData(
            form,
            "https://damp-castle-86239-1b70ee448fbd.herokuapp.com/decoapi/community/",
            {
                student_number: "s4950467", // Example student number header
                uqcloud_zone_id: "d3544e6c", // Example uqcloud zone header
            }
        );

        // If the submission is successful
        if (success) {
            feedback.textContent = data.message; // Display the success message from the server
            form.reset(); // Clear the form after successful submission
        } else {
            // Display error message from server or a fallback message
            feedback.textContent = data.message || "Something went wrong.";
        }
    });
});
