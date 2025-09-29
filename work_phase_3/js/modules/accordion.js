// js/modules/accordion.js
// Initializes all .accordion containers. When singleOpen = true,
// only one item at the same level can be open at a time.
export function initAccordion(
    containerSelector = ".accordion",
    { singleOpen = false } = {}
) {
    const accordions = document.querySelectorAll(containerSelector);

    accordions.forEach((container) => {
        const headers = container.querySelectorAll(".accordion-header");

        headers.forEach((header) => {
            const item = header.closest(".accordion-item");
            const panel = item?.querySelector(".accordion-content");
            if (!panel) return;

            // a11y (accessibility): link the trigger to its panel
            // Ensure the panel has an id and wire up ARIA attributes
            const id =
                panel.id || `panel-${Math.random().toString(36).slice(2, 9)}`;
            panel.id = id;
            header.setAttribute("aria-controls", id);
            header.setAttribute("aria-expanded", "false");

            header.addEventListener("click", () => {
                const willOpen = !item.classList.contains("open");

                // If singleOpen mode, close other open items in the same container
                if (singleOpen && willOpen) {
                    container
                        .querySelectorAll(".accordion-item.open")
                        .forEach((other) => {
                            if (other !== item) {
                                other.classList.remove("open");
                                const oh =
                                    other.querySelector(".accordion-header");
                                const op =
                                    other.querySelector(".accordion-content");
                                if (oh)
                                    oh.setAttribute("aria-expanded", "false");
                                if (op) op.style.maxHeight = null;
                            }
                        });
                }

                // Toggle current item open/closed
                item.classList.toggle("open");
                header.setAttribute("aria-expanded", String(willOpen));

                // Animate height using the panel’s natural content height
                if (willOpen) {
                    panel.style.maxHeight = panel.scrollHeight + "px";
                } else {
                    panel.style.maxHeight = null;
                }
            });
        });
    });
}
