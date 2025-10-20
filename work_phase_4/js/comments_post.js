// 本檔：處理送出留言（完全本地，不呼叫後端）
import { saveComment } from "./comments_display.js";

const SARA_NAME = "Sarah"; // 固定登入者
const SARA_AVATAR = "assets/.jpg"; // 你的頭像路徑（顯示用，會在 display.js 使用）

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

        // 建立本地留言物件
        const newComment = {
            name: SARA_NAME,
            message,
            created_at: new Date().toISOString(),
            avatar: SARA_AVATAR, // 目前未用到，但保留欄位
        };

        // 存到 localStorage
        saveComment(newComment);

        // 重置表單
        form.reset();
        if (feedback) feedback.textContent = "Comment posted!";

        // 立刻在畫面追加一筆（不等重渲染）
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

        // 通知顯示端重新渲染（保險機制）
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
