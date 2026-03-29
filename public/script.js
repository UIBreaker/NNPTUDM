const API_POSTS = '/api/posts';
const API_COMMENTS = '/api/comments';

let currentEditCommentId = null;

// Khởi chạy khi tải trang
document.addEventListener("DOMContentLoaded", () => {
    fetchPosts();
});

// ======================= POSTS LOGIC =======================

async function fetchPosts() {
    try {
        const res = await fetch(API_POSTS);
        const posts = await res.json();
        const postsList = document.getElementById("postsList");
        postsList.innerHTML = ''; // Clear existing lists

        for (const post of posts) {
            const isSoftDeleted = post.isDeleted ? 'soft-deleted' : '';
            const btnDelete = !post.isDeleted 
                ? `<button class="btn-soft-delete" onclick="softDeletePost('${post.id}')">Gạch ngang (Xoá mềm)</button>`
                : '';

            const postCard = document.createElement('div');
            postCard.className = `post-card ${isSoftDeleted}`;
            postCard.innerHTML = `
                <h2>${post.title} (ID: ${post.id})</h2>
                <p class="content">${post.content}</p>
                ${btnDelete}
                
                <div class="comments-section" id="comments-${post.id}">
                    <h4>Bình luận</h4>
                    <div id="comments-list-${post.id}">Đang tải...</div>
                    <div style="margin-top: 10px;">
                        <input type="text" id="newCommentContent-${post.id}" placeholder="Viết bình luận mới..." style="width:70%; padding:5px;">
                        <button onclick="createComment('${post.id}')" style="padding:6px; background:#28a745; color:#fff; border:none; cursor:pointer;">Gửi</button>
                    </div>
                </div>
            `;
            postsList.appendChild(postCard);

            // Fetch comments cho Post này
            fetchComments(post.id);
        }

    } catch (err) {
        console.error("Lỗi khi fetch posts:", err);
    }
}

async function createPost() {
    const titleInput = document.getElementById('postTitle');
    const contentInput = document.getElementById('postContent');
    const title = titleInput.value.trim();
    const content = contentInput.value.trim();

    if (!title || !content) {
        alert("Vui lòng nhập cả tiêu đề và nội dung.");
        return;
    }

    try {
        const res = await fetch(API_POSTS, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ title, content })
        });
        if (res.ok) {
            titleInput.value = '';
            contentInput.value = '';
            fetchPosts(); // Refresh danh sách
        }
    } catch (err) {
        console.error("Lỗi khi tạo post:", err);
    }
}

async function softDeletePost(id) {
    if (!confirm("Bạn có chắc chắn muốn xoá mềm bài viết này?")) return;
    try {
        const res = await fetch(`${API_POSTS}/${id}`, { method: 'DELETE' });
        if (res.ok) fetchPosts();
    } catch (err) {
        console.error("Lỗi khi xoá mềm post:", err);
    }
}

// ======================= COMMENTS LOGIC =======================

async function fetchComments(postId) {
    try {
        const res = await fetch(`${API_COMMENTS}/${postId}`);
        const comments = await res.json();
        const commentsListDiv = document.getElementById(`comments-list-${postId}`);
        commentsListDiv.innerHTML = '';

        if (comments.length === 0) {
            commentsListDiv.innerHTML = '<p style="color:#777; font-size:0.9em;">Chưa có bình luận nào.</p>';
            return;
        }

        comments.forEach(comment => {
            const commentDiv = document.createElement('div');
            commentDiv.className = 'comment-card';
            commentDiv.innerHTML = `
                <div style="flex-grow:1">${comment.content}</div>
                <div class="comment-actions">
                    <button class="btn-edit" onclick="openEditModal('${comment.id}', '${comment.content.replace(/'/g, "\\'")}')">Sửa</button>
                    <button class="btn-delete" onclick="deleteComment('${comment.id}', '${postId}')">Xoá</button>
                </div>
            `;
            commentsListDiv.appendChild(commentDiv);
        });
    } catch (err) {
        console.error("Lỗi khi lấy comments cho post " + postId, err);
    }
}

async function createComment(postId) {
    const input = document.getElementById(`newCommentContent-${postId}`);
    const content = input.value.trim();
    if (!content) return;

    try {
        const res = await fetch(API_COMMENTS, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ postId, content })
        });
        if (res.ok) {
            input.value = '';
            fetchComments(postId); // Refresh current post's comments
        }
    } catch (err) {
        console.error("Lỗi khi tạo comment:", err);
    }
}

async function deleteComment(commentId, postId) {
    if (!confirm("Xoá bình luận này?")) return;
    try {
        const res = await fetch(`${API_COMMENTS}/${commentId}`, { method: 'DELETE' });
        if (res.ok) fetchComments(postId);
    } catch (err) {
        console.error("Lỗi khi xoá comment:", err);
    }
}

// ==== Modal Logic cho Sửa Comment ====
const editModal = document.getElementById("editCommentModal");
const btnSaveEdit = document.getElementById("saveEditCommentBtn");

function openEditModal(commentId, currentContent) {
    currentEditCommentId = commentId;
    document.getElementById("editCommentContent").value = currentContent;
    editModal.style.display = "block";
}

function closeEditModal() {
    editModal.style.display = "none";
    currentEditCommentId = null;
}

btnSaveEdit.onclick = async () => {
    if (!currentEditCommentId) return;
    const content = document.getElementById("editCommentContent").value.trim();
    if (!content) {
        alert("Bình luận không được trống!");
        return;
    }

    try {
        const res = await fetch(`${API_COMMENTS}/${currentEditCommentId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ content })
        });
        if (res.ok) {
            closeEditModal();
            fetchPosts(); // Refresh để đảm bảo UI update chính xác, vì post card có comment
        }
    } catch (err) {
        console.error("Lỗi khi sửa comment:", err);
    }
}

// Close modal khi click ra ngoài
window.onclick = function(event) {
    if (event.target == editModal) {
        closeEditModal();
    }
}
