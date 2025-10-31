// 活動頁：讀取 localStorage 中的留言並渲染
const LOCAL_COMMENTS_KEY = "localComments_eventsSteak";
const SARA_NAME = "Sarah";
const SARA_AVATAR = "assets/profile/Sarah.jpg";

document.addEventListener("DOMContentLoaded", () => {
    const list = document.getElementById("comment-list");
    if (!list) return;
    renderAll(list);
    document.addEventListener("comment:updated", () => renderAll(list, true));
});

function renderAll(listEl, scrollToBottom = false) {
    const comments = loadComments();
    listEl.innerHTML = "";
    if (!comments.length) {
        listEl.innerHTML =
            "<li class='comment-card'><p class='comment-text'>No comments yet. Be the first to share!</p></li>";
        return;
    }
    comments.forEach((c) => listEl.appendChild(renderItem(c)));
    if (scrollToBottom) {
        listEl.lastElementChild?.scrollIntoView({
            behavior: "smooth",
            block: "end",
        });
    }
}

function renderItem(c) {
    const li = document.createElement("li");
    li.className = "comment-card";

    const isSara = norm(c.name) === norm(SARA_NAME);
    const avatarSrc = c.avatar ? c.avatar : isSara ? SARA_AVATAR : null;
    const avatarHtml = avatarSrc
        ? `<img class="avatar" src="${avatarSrc}" alt="${escapeHtml(
            c.name || "User"
        )} profile photo" />`
        : `<div class="avatar placeholder" aria-hidden="true">${escapeHtml(
            (c.name || "?").trim().charAt(0).toUpperCase()
        )}</div>`;

    const when = c.created_at
        ? new Date(c.created_at).toLocaleString()
        : "Just now";

    li.innerHTML = `
    <div class="comment-top">
    ${avatarHtml}
    <div class="comment-info">
        <strong class="comment-name">${escapeHtml(
            c.name || "Anonymous"
        )}</strong>
        <span class="comment-time">${when}</span>
    </div>
    </div>
    <p class="comment-text">${escapeHtml(c.message || "")}</p>
`;
    return li;
}

// storage helpers
function loadComments() {
    try {
        const raw = localStorage.getItem(LOCAL_COMMENTS_KEY);
        return raw ? JSON.parse(raw) : [];
    } catch {
        return [];
    }
}
function saveAll(list) {
    localStorage.setItem(LOCAL_COMMENTS_KEY, JSON.stringify(list));
}
export function saveComment(commentObj) {
    const list = loadComments();
    list.push(commentObj);
    saveAll(list);
}

// utils
function norm(s) {
    return String(s || "")
        .trim()
        .toLowerCase();
}
function escapeHtml(str) {
    return String(str)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}
