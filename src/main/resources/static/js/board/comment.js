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
    renderComments(comments);
    bindCommentActionEvents(); //commentUtil.js
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
function renderComments(comments) { // 사용시 loadComments(renderComments(comments))방식으로 사용
  const ul = document.getElementById("commentDiv");
  if (!ul){ console.log("commentDiv를 찾을수 없습니다.");return;} 

  ul.innerHTML = "";

  comments.forEach(c => {
    const commentId = c.commentId;
    const memberId = c.memberId;
    const nickname = c.memberNickname || "";
    const date = formatDate(c.commentTime);
    const parentId = c.parentCommentId ?? 0;
    const content = c.commentContent || "";
    const isOwner = !!c.isOwner;
    const depth = c.depth ?? 0;

    console.log("depth : ", depth);
    const padding = parentId === 0 ? "2rem" : `${depth + 2}rem`

    const li = document.createElement("li");
    li.dataset.id = commentId;
    li.dataset.nickname = nickname;
    li.dataset.date = date;
    li.dataset.memberId = memberId;
    li.dataset.parentCommentId = parentId;

    

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
          <p> ${parentId ? "@" +  getParentNicknameFromId(parentId) : ""} ${escapeHtml(content)}</p>
        </div>

        <div class="commentEditor" style="display:none;"> 
          <textarea class="commentTextarea"></textarea>
          <button class="commentSubmit">확인</button>
        </div>
      </div>
      <hr class="sidebar-divider d-none d-md-block">
    `;

    ul.appendChild(li);

            /**/ 
    function getParentNicknameFromId(parentMemberId){

      const parent = ul.querySelector(`li[data-id="${parentMemberId}"]`);
      if (!parent) return null;

      return parent.dataset.nickname;

    }
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

/**************************************************************************************** */


async function insertCommentHandler(e) {
  const btn = e.target;
  if (!btn.classList.contains("commentSubmit")) return;

  const editor = btn.closest(".commentEditor");
  if (!editor) return;

  const commentDiv = btn.closest(".commentDiv"); // 이 editor가 속한 댓글 블록
  const li = btn.closest("li");                  // 이 editor가 속한 댓글 li
  if (!li) return;

  const textarea = editor.querySelector(".commentTextarea");
  const content = (textarea?.value || "").trim();
  if (!content) {
    alert("내용을 입력하세요.");
    return;
  }

  const postId = getPostIdFromUrl();

  // ✅ 기본: 새 댓글(부모 없음)
  // ✅ 답글 버튼 눌러서 열린 editor라면, "답글 대상 댓글"의 id가 필요함
  //    -> reply 모드일 때는 해당 li.dataset.no 를 parentCommentId로 사용
  const mode = editor.dataset.mode || "";
  const parentCommentId = (mode === "reply") ? Number(li.dataset.no || 0) : 0;

  try {
    const result = await insertComment({ postId, parentCommentId, content });
    closeAllEditors();
    await reloadComments();
    return result;
  } catch (err) {
    console.error("댓글 등록 실패:", err);
    alert("댓글 등록 실패");
  }
}
