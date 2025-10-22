// calendar.view.js
// View module: handles DOM rendering and user interactions

import { createCalendarState } from "./calendar.state.js";

// Example event data
const seedEvents = [
    {
        date: "2025-10-26",
        title: "Cooking lesson",
        link: "events_cooking.html",
    },
    { date: "2025-10-29", title: "Ramen Night", link: "event-detail.html" },
    { date: "2025-11-02", title: "Steak & Stories", link: "event-detail.html" },
];

document.addEventListener("DOMContentLoaded", () => {
    const monthLabelEl = document.querySelector(".calendar-month");
    const gridEl = document.querySelector(".calendar-grid");
    const prevBtn = document.querySelector('[data-cal-action="prev"]');
    const nextBtn = document.querySelector('[data-cal-action="next"]');

    // Initialize calendar state
    const today = new Date();
    const state = createCalendarState({
        startYear: today.getFullYear(),
        startMonth: today.getMonth(),
        events: seedEvents,
    });

    // Render a single week row
    const renderWeekRow = (cells) => {
        const inner = cells
            .map((c) => {
                const classes = [
                    "calendar-cell",
                    "day",
                    c.inMonth ? "" : "is-outside",
                    c.hasEvent ? "has-event" : "",
                    c.isToday ? "is-today" : "",
                ]
                    .filter(Boolean)
                    .join(" ");

                const disabled = c.inMonth ? "" : "disabled";

                return `<button
        class="${classes}"
        role="gridcell"
        ${disabled}
        data-date="${c.iso}"
        >${c.label}</button>`;
            })
            .join("");

        return `<div class="calendar-row" role="row">${inner}</div>`;
    };

    // Subscribe to state updates and render the view
    state.subscribe(({ label, matrix }) => {
        const weekdayHeader = `
        <div class="calendar-row calendar-weekdays" role="row">
        ${["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
            .map(
                (d) =>
                    `<span class="calendar-cell weekday" role="columnheader">${d}</span>`
            )
            .join("")}
    </div>
    `;

        monthLabelEl.textContent = label;
        gridEl.innerHTML = weekdayHeader + matrix.map(renderWeekRow).join("");
    });

    // Navigation buttons
    prevBtn.addEventListener("click", () => state.prevMonth());
    nextBtn.addEventListener("click", () => state.nextMonth());

    // Handle click on event days
    gridEl.addEventListener("click", (e) => {
        const btn = e.target.closest(".calendar-cell.day.has-event");
        if (!btn) return;
        const iso = btn.dataset.date;
        const event = seedEvents.find((ev) => ev.date === iso);
        if (event?.link) window.location.href = event.link;
    });

    // (Optional) You can later add a "Today" button in HTML:
    // <button data-cal-action="today">Today</button>
    // document.querySelector('[data-cal-action="today"]')
    //   ?.addEventListener('click', () => state.goToday());
});
