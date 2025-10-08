// js/reflective_design.js

import { fetchGetData } from "./modules/getData.js";

document.addEventListener("DOMContentLoaded", () => {
    // Accordion toggle
    document.querySelectorAll(".accordion button").forEach((button) => {
        button.addEventListener("click", () => {
            const acc = button.parentElement;
            if (acc) acc.classList.toggle("active");
        });
    });

    // Community list container
    const container = document.getElementById("community-list");
    if (!container) return;

    // Show temporary skeletons
    showSkeletons(container, 3);

    fetchGetData(
        "https://damp-castle-86239-1b70ee448fbd.herokuapp.com/decoapi/community/",
        {
            student_number: "s4950467",
            uqcloud_zone_id: "d3544e6c",
        }
    )
        .then((data) => {
            container.innerHTML = ""; // Clear skeletons

            if (!Array.isArray(data) || data.length === 0) {
                container.innerHTML = `
        <div class="empty-state" aria-live="polite">
            <p>No community submissions yet. Be the first to share!</p>
        </div>`;
                return;
            }

            // Render each member card
            [...data].reverse().forEach((member) => {
                const card = renderMemberCard(member);
                container.appendChild(card);
            });
        })
        .catch(() => {
            container.innerHTML = `
        <div class="empty-state">
        <p class="text-danger">Unable to load community members.</p>
        </div>`;
        });
});

/* ================= Helpers ================= */

/**
 * Build a formatted card for a single member.
 */
function renderMemberCard(member) {
    const {
        name = "Anonymous",
        message = "",
        email = "",
        photo = "",
    } = member || {};

    const card = document.createElement("article");
    card.className = "community-card";

    const avatar = photo
        ? `<img class="avatar" src="${photo}" alt="${escapeHtml(
            name
        )}'s photo">`
        : `<div class="avatar" aria-hidden="true">${(name || "?")
            .trim()
            .charAt(0)
            .toUpperCase()}</div>`;

    card.innerHTML = `
    <div class="top">
    ${avatar}
    <div class="info-block">
        <p><strong>Name:</strong> ${escapeHtml(name)}</p>
        ${email ? `<p><strong>Email:</strong> ${escapeHtml(email)}</p>` : ""}
        <p><strong>Message:</strong> ${
            escapeHtml(message) || "No message provided."
        }</p>
    </div>
    </div>
`;
    return card;
}

/**
 * Show skeleton placeholders while loading.
 */
function showSkeletons(container, count = 3) {
    for (let i = 0; i < count; i++) {
        const sk = document.createElement("div");
        sk.className = "skeleton skel-card";
        container.appendChild(sk);
    }
}

/**
 * Escape HTML to prevent XSS.
 */
function escapeHtml(str) {
    return String(str)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}
