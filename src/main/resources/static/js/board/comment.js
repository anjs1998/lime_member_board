/**
 * comments: [
 *   {
 *     commentId,
 *     memberNickname,
 *     commentTime,
 *     parentCommentId, // null or number
 *     commentContent,
 *     isMine
 *   }
 * ]
 */


/**
 * /comments?postId=... 로 댓글 목록을 가져온다.
 * 서버 반환: CommentDto 리스트(JSON 배열)
 * 예) [{ commentId, content, memberId, nickname, createdAt, ... }, ...]
 */

document.addEventListener("DOMContentLoaded", async ()=>{

    const comments = await loadComments();
    console.log(comments);
    renderCommentsToTree(comments);

})
async function loadComments(postId = getPostIdFromUrl()) {
  if (!postId) {
    console.error("postId가 없습니다.");
    return [];
  }

  try {
    const commentList = await $.ajax({
      url: "/comments",
      type: "GET",
      dataType: "json",
      data: { postId }
    });

    //return Array.isArray(commentList) ? commentList : [];
    return commentList.comments;
  } catch (err) {
    console.error("댓글 조회 실패:", err);
    return [];
  }
}


/*Comment Dto들을 표시하는 함수.*/ 
function renderCommentsToTree(comments) { // 사용시 loadComments(renderComments(comments))방식으로 사용
  const ul = document.getElementById("commentDiv");
  if (!ul){ console.log("commentDiv를 찾을수 없습니다.");return;} 

  ul.innerHTML = "";

  comments.forEach(c => {
    const commentId = c.commentId;
    const nickname = c.memberNickname || "";
    const date = formatDate(c.commentTime);
    const parentId = c.parentCommentId ?? 0;
    const content = c.commentContent || "";
    const isOwner = !!c.isOwner;

    const padding = parentId === 0 ? "2rem" : "3rem";

    const li = document.createElement("li");
    li.dataset.no = commentId;
    li.dataset.name = nickname;
    li.dataset.date = date;
    li.dataset.parent = parentId;

    li.innerHTML = `
      <div class="commentDiv" style="padding-left: ${padding};">
        <div class="commentHead">
          <div class="commentHead1">
            <div class="commentName">${escapeHtml(nickname)}</div>
            <div class="commentDate">${escapeHtml(date)}</div>
          </div>

          <div class="commentHead2">
            <div class="commentReply">답글</div>
            ${
              isOwner
                ? `<div class="commentModify">수정</div>
                   <div class="commentRemove">삭제</div>`
                : ``
            }
            <div class="commentCancle" style="display:none;">취소</div>
          </div>
        </div>

        <div class="comment">
          <p>${escapeHtml(content)}</p>
        </div>
      </div>
      <hr class="sidebar-divider d-none d-md-block">
    `;

    ul.appendChild(li);
  });
}

/* 날짜 포맷 */
function formatDate(value) {
  if (!value) return "";
  if (typeof value === "string") {
    return value.replace("T", " ").replace(/\.\d+$/, "");
  }
  return String(value);
}

/* XSS 방지 */
function escapeHtml(str) {
  return String(str)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

// postId를 URL에서 꺼내오는 유틸 (필요하면 사용)
function getPostIdFromUrl() {
  const params = new URLSearchParams(window.location.search);
  return params.get("postId");
}
