function fetchTemperature() {
    const temperatureValue = document.getElementById("temperature-value");
    if (!temperatureValue) {
        console.error("Temperature widget not found in the DOM.");
        return;
    }

    const latitude = -27.4705; // Brisbane
    const longitude = 153.026;

    const apiUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`;

    fetch(apiUrl)
        .then((response) => {
            if (!response.ok)
                throw new Error(`HTTP error! Status: ${response.status}`);
            return response.json();
        })
        .then((data) => {
            console.log(data); // ← 先看回傳
            const temperature = data.current_weather?.temperature;
            if (typeof temperature === "number") {
                temperatureValue.textContent = temperature;
            } else {
                temperatureValue.textContent = "N/A";
            }
        })
        .catch((error) => {
            console.error("Error fetching temperature:", error);
            temperatureValue.textContent = "N/A";
        });
}

export { fetchTemperature };
