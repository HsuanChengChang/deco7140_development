// commentsClient.js
// Comment system: submit via FormData and only display your own comments

import { fetchGetData } from "./modules/getData.js";
import { postFormData } from "./modules/postFormData.js";

export function initComments({
    scope = document,
    listSelector = ".comment-list",
    formSelector = ".message-form",
    textareaSelector = "#message",

    // ====== Your own API endpoints (UQCloud) ======
    getUrl = "https://deco7140-d3544e6c.uqcloud.net/decoapi/comments/",
    postUrl = "https://deco7140-d3544e6c.uqcloud.net/decoapi/comments/",

    // ====== Your unique student identifier ======
    myStudent = "s4950467",

    // ====== Default request headers (optional, can be empty {}) ======
    headers = {
        student_number: "s4950467",
        uqcloud_zone_id: "d3544e6c",
    },
} = {}) {
    const listEl = scope.querySelector(listSelector);
    const formEl = scope.querySelector(formSelector);
    const textareaEl = scope.querySelector(textareaSelector);
    if (!listEl || !formEl || !textareaEl) return;

    // ---- Identify recipe or page slug ----
    const slugInput = formEl.querySelector('input[name="slug"]');
    const slug =
        slugInput?.value ||
        new URLSearchParams(location.search).get("slug") ||
        "default-recipe";

    const queryUrl = `${getUrl}?slug=${encodeURIComponent(slug)}`;

    // ---- Fetch and display only your own comments ----
    listEl.innerHTML = '<li class="comment-card">Loading comments…</li>';

    fetchGetData(queryUrl, headers)
        .then((data) => {
            const arr = Array.isArray(data) ? data : [];
            // Only keep comments where student_number matches yours
            const mine = arr.filter((c) => c.student_number === myStudent);
            render(listEl, mine);
        })
        .catch(() => render(listEl, []));

    // ---- Handle form submission ----
    formEl.addEventListener("submit", async (e) => {
        e.preventDefault();

        const value = (textareaEl.value || "").trim();
        if (!value) return;

        // Ensure hidden fields exist and are up-to-date
        ensureHidden(formEl, "student_number", myStudent);
        ensureHidden(formEl, "slug", slug);

        // Submit form data via existing helper
        const { success } = await postFormData(formEl, postUrl, headers);

        if (success) {
            formEl.reset();
            // Refresh comment list (still filtered to your own)
            const refreshed = await fetchGetData(queryUrl, headers).catch(
                () => []
            );
            const arr = Array.isArray(refreshed) ? refreshed : [];
            const mine = arr.filter((c) => c.student_number === myStudent);
            render(listEl, mine);
        } else {
            alert("Failed to post comment.");
        }
    });
}

/* ========== Helper functions ========== */

// Ensure a hidden <input> field exists in the form with a given name and value
function ensureHidden(form, name, value) {
    let input = form.querySelector(`input[name="${name}"]`);
    if (!input) {
        input = document.createElement("input");
        input.type = "hidden";
        input.name = name;
        form.appendChild(input);
    }
    input.value = value;
}

// Render comments (list of your own only)
function render(listEl, items) {
    listEl.innerHTML = "";
    if (!items.length) {
        const li = document.createElement("li");
        li.className = "comment-card";
        li.textContent = "No comments from you yet.";
        listEl.appendChild(li);
        return;
    }

    items.forEach((c) => {
        const li = document.createElement("li");
        li.className = "comment-card";

        const author = document.createElement("strong");
        author.textContent = c.author || "Anonymous";

        const msg = document.createElement("p");
        msg.textContent = c.message || c.text || c.comment || "(no message)";

        const time = document.createElement("small");
        time.textContent = c.created_at
            ? new Date(c.created_at).toLocaleString()
            : "";

        li.append(author, msg, time);
        listEl.appendChild(li);
    });
}
