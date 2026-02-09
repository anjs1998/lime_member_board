
let commentEventsBound = false;
/*DOM 로딩시 comment들의 요소 및 event들을 세팅하는 */
function bindCommentActionEvents() {
  if (commentEventsBound) return; // ✅ 중복 바인딩 방지
  commentEventsBound = true;

  const commentDiv = document.getElementById("commentDiv");
  if (!commentDiv) return;

  commentDiv.addEventListener("click", async (e) => {
    const target = e.target;
    console.log("target : ", e.target);
    
    const commentItem = target.closest(".commentDiv");
    console.log("target.closest(.commentDiv) : ", commentItem);
    if (!commentItem) return;

    const editor = commentItem.querySelector(".commentEditor");
    const cancelBtn = commentItem.querySelector(".commentCancle");
    const contentDiv = commentItem.querySelector(".commentContent");

    // editor 없는 구조면 처리 불가
    if (!editor) return;

    const textarea = editor.querySelector(".commentTextarea");
    if (!textarea) return;

    //  답글
    if (target.classList.contains("commentReply")) {
      closeAllEditors();

      editor.style.display = "block";
      cancelBtn && (cancelBtn.style.display = "inline-block");
      textarea.value = "";
      textarea.placeholder = "답글을 입력하세요";
      editor.dataset.mode = "reply";
      return;
    }

    //  수정
    if (target.classList.contains("commentModify")) {
      closeAllEditors();
      editor.style.display = "block";
      cancelBtn && (cancelBtn.style.display = "inline-block");
      textarea.value = (contentDiv ? contentDiv.innerText : "");
      textarea.placeholder = "댓글 수정";
      editor.dataset.mode = "modify";
      return;
    }

    // ✅ 취소
    if (target.classList.contains("commentCancle")) {
      editor.style.display = "none";
      cancelBtn && (cancelBtn.style.display = "none");
      editor.dataset.mode = "";
      return;
    }

    // ✅ 확인(등록/수정)
    if (target.classList.contains("commentSubmit")) {
      const commentId = commentItem.dataset.commentId;
      const mode = editor.dataset.mode;
      const content = textarea.value.trim();

      if (!content) {
        alert("내용을 입력하세요.");
        return;
      }

      if (mode === "reply") {
        console.log("mode : " , mode);
        await insertComment({
            
          //postId: getPostIdFromUrl(),
          parentCommentId: commentId.dataset.id,
          content : content,
        });
      } else if (mode === "modify") {
        console.log("mode : " , mode);
        await modifyComment(commentId.dataset.id, content);
      } else {
        // mode가 비어있으면 뭔지 모르는 상태라 그냥 무시
        console.log("mode : " , mode);
        return;
      }

      closeAllEditors();
      await reloadComments();
    }
  });

  
}

function closeAllEditors() {
  document.querySelectorAll(".commentEditor").forEach(ed => {
    ed.style.display = "none";
    ed.dataset.mode = "";
  });
  document.querySelectorAll(".commentCancle").forEach(btn => {
    btn.style.display = "none";
  });
}


// 댓글 등록
async function insertComment({  parentCommentId = 0, content }) {
  // 서버로 보낼 JSON

  
  const payload = { postId : Number(getPostIdFromUrl()),
     parentCommentId : parentCommentId,
      commentContent : content };

  return await $.ajax({
    url: "/comment/insert",
    type: "POST",
    contentType: "application/json; charset=utf-8",
    dataType: "json",
    data: JSON.stringify(payload),
  });
}

// 댓글 수정
async function modifyComment(commentId, content) {
  const payload = { content };

  return await $.ajax({
    url: `/comment/modify?commentId=${commentId}`,
    type: "POST",
    contentType: "application/json; charset=utf-8",
    dataType: "json",
    data: JSON.stringify(payload),
  });
}

// 댓글 삭제
async function deleteComment(commentId) {
  return await $.ajax({
    url: `/comment/delete?commentId=${commentId}`,
    type: "POST",
    dataType: "json",
  });
}


// postId를 URL에서 꺼내오는 유틸 (필요하면 사용)
function getPostIdFromUrl() {
  const params = new URLSearchParams(window.location.search);
  return params.get("postId");
}