// Simple accordion toggle
document.querySelectorAll(".accordion button").forEach((button) => {
    button.addEventListener("click", () => {
        const acc = button.parentElement;
        acc.classList.toggle("active");
    });
});

import { fetchGetData } from "./modules/getData.js";

document.addEventListener("DOMContentLoaded", () => {
    const container = document.getElementById("community-list");

    fetchGetData(
        "https://damp-castle-86239-1b70ee448fbd.herokuapp.com/decoapi/community/",
        {
            student_number: "s4950467",
            uqcloud_zone_id: "d3544e6c",
        }
    ).then((data) => {
        if (!data) {
            container.innerHTML =
                '<p class="text-danger">Unable to load community members.</p>';
            return;
        }

        data.forEach((member) => {
            console.log("Single member object:", member);  //NEW
            const card = document.createElement("div");
            card.className = "card mb-3";
            card.innerHTML = `
            <div class="card-body">
            <h5 class="card-title">${member.name}</h5>
            <p class="card-text">${member.message || "No message provided."}</p>
            </div>
        `;
            container.appendChild(card);
        });
    });
});
