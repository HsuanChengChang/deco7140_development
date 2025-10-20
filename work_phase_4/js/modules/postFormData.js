// POST wrapper for form submission
export async function postFormData(form, url, headers = {}) {
    try {
        const formData = new FormData(form);
        const response = await fetch(url, {
            method: "POST",
            headers: {
                ...headers,
            },
            body: formData,
        });

        const data = await response.json();
        if (!response.ok) {
            console.error("POST failed:", data);
            return { success: false, data };
        }

        return { success: true, data };
    } catch (err) {
        console.error("POST error:", err);
        return { success: false, data: { message: err.message } };
    }
}
