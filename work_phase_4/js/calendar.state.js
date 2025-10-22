// calendar.state.js
// Logic-only module for managing the calendar state (month navigation, event data, today highlight)

export function createCalendarState({ startYear, startMonth, events = [] }) {
    // startMonth uses 0-based index (e.g., 9 = October)
    let current = new Date(startYear, startMonth, 1);
    let subscribers = [];

    // Helper: Convert a date to ISO string (YYYY-MM-DD)
    const toISO = (d) =>
        new Date(d.getFullYear(), d.getMonth(), d.getDate())
            .toISOString()
            .slice(0, 10);

    // Build a 6×7 matrix representing the current month's days (with previous and next month padding)
    function buildMatrix(date) {
        const year = date.getFullYear();
        const month = date.getMonth();
        const firstDay = new Date(year, month, 1);
        const startWeekday = firstDay.getDay(); // 0 = Sunday
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        const prevMonthDays = new Date(year, month, 0).getDate();
        const todayISO = toISO(new Date());

        const weeks = [];
        let dayNum = 1;
        let nextMonthDay = 1;

        for (let row = 0; row < 6; row++) {
            const cells = [];
            for (let col = 0; col < 7; col++) {
                const cellIndex = row * 7 + col;
                let d, inMonth;

                if (cellIndex < startWeekday) {
                    // Days from previous month
                    const day = prevMonthDays - (startWeekday - col - 1);
                    d = new Date(year, month - 1, day);
                    inMonth = false;
                } else if (dayNum > daysInMonth) {
                    // Days from next month
                    d = new Date(year, month + 1, nextMonthDay++);
                    inMonth = false;
                } else {
                    // Days from current month
                    d = new Date(year, month, dayNum++);
                    inMonth = true;
                }

                const iso = toISO(d);
                const hasEvent = !!events.find((ev) => ev.date === iso);
                const isToday = iso === todayISO;

                cells.push({
                    iso, // 'YYYY-MM-DD'
                    label: d.getDate(),
                    inMonth,
                    hasEvent,
                    isToday,
                });
            }
            weeks.push(cells);
        }
        return weeks;
    }

    // Return formatted month name (e.g. "October 2025")
    function monthLabel(date) {
        return date.toLocaleString("default", {
            month: "long",
            year: "numeric",
        });
    }

    // Create a snapshot of current state (for rendering)
    function snapshot() {
        return {
            current: new Date(current),
            label: monthLabel(current),
            matrix: buildMatrix(current),
        };
    }

    // Notify all subscribers (e.g., UI renderers)
    function notify() {
        const snap = snapshot();
        subscribers.forEach((cb) => cb(snap));
    }

    // Public API
    return {
        subscribe(cb) {
            subscribers.push(cb);
            cb(snapshot()); // Trigger immediately once
            return () => (subscribers = subscribers.filter((x) => x !== cb));
        },
        nextMonth() {
            current.setMonth(current.getMonth() + 1);
            notify();
        },
        prevMonth() {
            current.setMonth(current.getMonth() - 1);
            notify();
        },
        goToday() {
            const t = new Date();
            current = new Date(t.getFullYear(), t.getMonth(), 1);
            notify();
        },
        setEvents(newEvents) {
            events = Array.isArray(newEvents) ? newEvents : [];
            notify();
        },
    };
}
