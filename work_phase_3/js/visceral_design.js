/**
 * IMPORTS
 * Keep track of external modules being used
 * */
import { initGalleryViewer } from "./modules/viewer.js";

/**
 * CONSTANTS
 * Define values that don’t change e.g. page titles, URLs, etc.
 */
const PAGE_TITLE = "Work Phase 3 — Visceral Design";
const SELECTORS = {
    viewer: "#viewer",
    viewerImg: "#viewer-img",
    viewerCaption: "#viewer-caption",
    closeBtn: "#close-viewer",
    thumbs: ".gallery img",
};

/**
 * VARIABLES
 * Define values that will change e.g. user inputs, counters, etc.
 */
let currentIndex = -1; // Track which image is open
let lastActiveEl = null; // Store last focused element for accessibility
let thumbs = []; // Filled once DOM is loaded

/**
 * FUNCTIONS
 * Group code into functions to make it reusable
 */

// Open viewer at a specific index
function openViewerAt(index) {
    currentIndex = index;
    const img = thumbs[currentIndex];

    const viewer = document.querySelector(SELECTORS.viewer);
    const viewerImg = document.querySelector(SELECTORS.viewerImg);
    const viewerCaption = document.querySelector(SELECTORS.viewerCaption);

    viewerImg.src = img.src;
    viewerImg.alt = img.alt || "";
    viewerCaption.textContent = img.alt || "";

    lastActiveEl = document.activeElement;

    viewer.classList.add("open");
    viewer.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
    viewer.focus();
}

// Close viewer
function closeViewer() {
    const viewer = document.querySelector(SELECTORS.viewer);
    const viewerImg = document.querySelector(SELECTORS.viewerImg);
    const viewerCaption = document.querySelector(SELECTORS.viewerCaption);

    viewer.classList.remove("open");
    viewer.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "auto";

    viewerImg.src = "";
    viewerImg.alt = "";
    viewerCaption.textContent = "";

    if (lastActiveEl && typeof lastActiveEl.focus === "function") {
        lastActiveEl.focus();
    }
}

// Show next image
function showNext() {
    if (currentIndex < 0) return;
    currentIndex = (currentIndex + 1) % thumbs.length;
    openViewerAt(currentIndex);
}

// Show previous image
function showPrev() {
    if (currentIndex < 0) return;
    currentIndex = (currentIndex - 1 + thumbs.length) % thumbs.length;
    openViewerAt(currentIndex);
}

/**
 * EVENT LISTENERS
 * The code that runs when a user interacts with the page
 */
document.addEventListener("DOMContentLoaded", () => {
    thumbs = Array.from(document.querySelectorAll(SELECTORS.thumbs));
    const closeBtn = document.querySelector(SELECTORS.closeBtn);
    const viewer = document.querySelector(SELECTORS.viewer);

    // Open on thumbnail click
    thumbs.forEach((img, idx) => {
        img.addEventListener("click", () => openViewerAt(idx));
        img.setAttribute("tabindex", "0"); // keyboard access
        img.addEventListener("keydown", (e) => {
            if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                openViewerAt(idx);
            }
        });
    });

    // Close button
    closeBtn.addEventListener("click", closeViewer);

    // Close on backdrop click
    viewer.addEventListener("click", (e) => {
        if (e.target === viewer) closeViewer();
    });

    // Keyboard navigation
    document.addEventListener("keydown", (e) => {
        if (viewer.getAttribute("aria-hidden") === "true") return;
        switch (e.key) {
            case "Escape":
                closeViewer();
                break;
            case "ArrowRight":
                showNext();
                break;
            case "ArrowLeft":
                showPrev();
                break;
        }
    });
});

// when the page fully loads
document.addEventListener("DOMContentLoaded", () => {
    initGalleryViewer();
});
