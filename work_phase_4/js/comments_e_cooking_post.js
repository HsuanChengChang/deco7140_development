import { saveComment } from "./comments_e_cooking_display.js";

const SARA_NAME = "Sarah";
const SARA_AVATAR = "assets/profile/Sarah.jpg";

document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("comment-form");
    const feedback = document.getElementById("form-feedback");
    const list = document.getElementById("comment-list");
    if (!form) return;

    form.addEventListener("submit", (e) => {
        e.preventDefault();

        const message = form.message?.value?.trim();
        if (!message) {
            if (feedback)
                feedback.textContent = "Please write a comment first.";
            return;
        }
        if (feedback) feedback.textContent = "Posting…";

        const newComment = {
            name: SARA_NAME,
            message,
            created_at: new Date().toISOString(),
            avatar: SARA_AVATAR,
        };

        // 寫入本地並即時顯示
        saveComment(newComment);
        form.reset();
        if (feedback) feedback.textContent = "Comment posted!";

        if (list) {
            const li = document.createElement("li");
            li.className = "comment-card";
            li.innerHTML = `
        <div class="comment-top">
        <img class="avatar" src="${SARA_AVATAR}" alt="${SARA_NAME} profile photo" />
        <div class="comment-info">
            <strong class="comment-name">${SARA_NAME}</strong>
            <span class="comment-time">Just now</span>
        </div>
        </div>
        <p class="comment-text">${escapeHtml(message)}</p>
    `;
            list.appendChild(li);
            li.scrollIntoView({ behavior: "smooth", block: "end" });
        }

        document.dispatchEvent(new CustomEvent("comment:updated"));
    });
});

function escapeHtml(str) {
    return String(str)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}
