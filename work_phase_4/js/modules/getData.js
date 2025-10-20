// GET wrapper for JSON endpoints
export async function fetchGetData(url, headers = {}) {
    try {
        const response = await fetch(url, {
            method: "GET",
            headers: {
                Accept: "application/json",
                ...headers,
            },
        });
        if (!response.ok) {
            console.error("GET failed:", response.status);
            return null;
        }
        return await response.json();
    } catch (err) {
        console.error("GET error:", err);
        return null;
    }
}
