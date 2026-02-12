
let commentEventsBound = false;
/*DOM 로딩시 comment들의 요소 및 event들을 세팅하는 */
function bindCommentActionEvents() {
  if (commentEventsBound) return; // ✅ 중복 바인딩 방지
  commentEventsBound = true;

  const commentDiv = document.getElementById("commentDiv");
  if (!commentDiv) return;

  commentDiv.addEventListener("click", async (e) => {
    const target = e.target;
    /*console.log("target : ", e.target);*/
    
    const commentItem = target.closest(".commentDiv");
    /*console.log("target.closest(.commentDiv) : ", commentItem);*/
    if (!commentItem) return;

    const editor = commentItem.querySelector(".commentEditor");
    const cancelBtn = commentItem.querySelector(".commentCancle");
    const contentDiv = commentItem.querySelector(".comment");

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
      contentDiv.style.display="none"; // contentDiv 숨기고 textarea를 show
      cancelBtn && (cancelBtn.style.display = "inline-block");
      const content = contentDiv?.querySelector(".comment-text").innerText || "";
      textarea.value = content;
      //textarea.value = (contentDiv ? contentDiv.innerText : "");
      textarea.placeholder = "댓글 수정";
      editor.dataset.mode = "modify";
      return;
    }

    // ✅ 취소
    if (target.classList.contains("commentCancle")) {
      editor.style.display = "none";
      cancelBtn && (cancelBtn.style.display = "none");
      editor.dataset.mode = "";
      contentDiv.style.display="block";
      return;
    }

    // ✅ 확인(등록/수정)
    if (target.classList.contains("commentSubmit")) {
      const commentId = commentItem.dataset.id;
      const mode = editor.dataset.mode;
      const content = textarea.value.trim();

      if (!content) {
        alert("내용을 입력하세요.");
        return;
      }

      if (mode === "reply") {
        console.log("mode : " , mode);
        const newComment = await insertComment({
            
          //postId: getPostIdFromUrl(),
          parentCommentId: commentId,
          content : content,
        });
        if(newComment !== null){
          closeAllEditors();
          insertNewCommentAsync(newComment);
          
          
        }
      } else if (mode === "modify") {
        console.log("mode : " , mode);
        const modifiedComment = await modifyComment(commentId, content);
        if(modifiedComment){
          modifyCommentAsync(modifiedComment, commentItem, getParentNicknameFromId(commentItem.dataset.parentId));
          contentDiv.style.display="block"; // contentDiv 숨기고 textarea를 show
        }
      } else {
        // mode가 비어있으면 뭔지 모르는 상태라 그냥 무시
        console.log("mode : " , mode);
        return;
      }

      closeAllEditors();
      //await reloadComments();

      function getParentNicknameFromId(parentMemberId){

        const parent = target.querySelector(`div.commentDiv[data-id="${parentMemberId}"]`);
        if (!parent) return null;

        return parent.dataset.nickname;

      }
    }
    /* ✅ 삭제.*/ 
    if (target.classList.contains("commentRemove")){

      if(confirm("코멘트를 삭제하시겠습니까?")){

        const result = await deleteComment(commentItem.dataset.id);
        if(result){
          alert("댓글이 삭제되었습니다!");
          deleteCommentAsync(commentItem);

        }
      }
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

/************댓글 CRUD용 ajax요청보내는 함수들.**************************************************************** */
async function submitCommentHandler(event) {
  event.preventDefault(); // a 태그 / 버튼 기본 동작 막기


  const form = document.getElementById("commentForm");
  form.querySelector('input[name="postId"]').value = getPostIdFromUrl();
  const postId = form.querySelector('input[name="postId"]').value;
  const content = form.querySelector('textarea[name="content"]').value.trim();

  if (!content) {
    alert("댓글 내용을 입력해주세요.");
    return;
  }

  $.ajax({
    url: "/comment/insert",
    type: "POST",
    contentType: "application/json; charset=UTF-8",
    data: JSON.stringify({ postId :  getPostIdFromUrl(),
      parentCommentId: null,
      commentContent : content }),
    success: function (res) {
      // 성공 시
      form.querySelector('textarea[name="content"]').value = "";
      
      // 필요하면 댓글 다시 로딩
      // loadComments(postId);

      const {success, newComment} = res;
      if(success == true){
        insertNewCommentAsync(newComment);

      }
      
      
      
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
      console.log("댓글 등록 성공", res);
    },
    error: function (err) {
      console.error("댓글 등록 실패", err);
      alert("댓글 등록 중 오류가 발생했습니다.");
    }
  });
}
// 댓글 등록
async function insertComment({ parentCommentId = 0, content }) {

  const payload = {
    postId: Number(getPostIdFromUrl()),
    parentCommentId,
    commentContent: content
  };

  try {
    const resp = await $.ajax({
      url: "/comment/insert",
      type: "POST",
      contentType: "application/json; charset=utf-8",
      dataType: "json",
      data: JSON.stringify(payload),
    });

    // 👉 성공했을 때 Comment DTO만 반환
    if (resp.success === true) {
      return resp.newComment; // ★ 여기!
    }

    // 실패 응답
    console.error(resp.message);
    return null;

  } catch (err) {
    console.error("댓글 등록 중 오류:", err);
    return null;
  }
}

// 댓글 수정
async function modifyComment(commentId, content) {

  const payload = {
    commentContent: content
  };

  try {
    const resp = await $.ajax({
      url: `/comment/modify?commentId=${commentId}`,
      type: "POST",
      contentType: "application/json; charset=utf-8",
      dataType: "json",
      data: JSON.stringify(payload),
    });

    // 👉 성공 시: 수정된 Comment DTO만 반환
    if (resp.success === true) {
      return resp.newComment;   // ★ insert와 완전히 동일한 패턴
    }

    console.error(resp.message);
    return null;

  } catch (err) {
    console.error("댓글 수정 중 오류:", err);
    return null;
  }
}

// 댓글 삭제
async function deleteComment(commentId) {

  try {
    const resp = await $.ajax({
      url: `/comment/delete?commentId=${commentId}`,
      type: "POST",
      dataType: "json",
    });

    // 👉 성공 시 true 반환
    if (resp.success === true) {
      return true;
    }

    console.error(resp.message);
    return false;

  } catch (err) {
    console.error("댓글 삭제 중 오류:", err);
    return false;
  }
}
/************************************************************************************************ */
// postId를 URL에서 꺼내오는 유틸 (필요하면 사용)
function getPostIdFromUrl() {
  const params = new URLSearchParams(window.location.search);
  return params.get("postId");
}

/*비동기로 댓글 삽입 결과를 보여주는 함수.*/ 
function insertNewCommentAsync(commentDto) {
  if (!commentDto) return;
  console.log(commentDto);
  const {
    commentId,
    memberId,
    memberNickname,
    commentTime,
    parentCommentId,
    commentContent,
    isOwner,
    depth
  } = commentDto;

  const nickname = memberNickname || "";
  const date = formatDate(commentTime);
  const parentId = parentCommentId ?? 0;
  const content = commentContent || "";
  const owner = !!isOwner;
  const d = depth ?? 0; 

  const padding = parentId === 0 ? "2rem" : `${d + 2}rem`;

  // 🔹 부모 댓글 li,div 찾기 (data-no 기준)
  
  const parentDiv = document.querySelector(`div.commentDiv[data-id="${parentId}"]`);

  if (!parentDiv) {
    console.warn("부모 댓글을 찾지 못했습니다:", parentId);
        
    const ul = document.getElementById("commentDiv");
    if (!ul){ console.log("commentDiv를 찾을수 없습니다.");return;} 
    // 🔹 새 li 생성
    const li = document.createElement("li");


    li.innerHTML = `
      <div class="commentDiv" style="padding-left: ${d + 2}rem;">
        <div class="commentHead">
          <div class="commentHead1">
            <div class="commentName">${escapeHtml(nickname)}</div>
            <div class="commentDate">${escapeHtml(date)}</div>
          </div>

          <div class="commentHead2">
            <div class="commentReply">답글</div>
            ${
              owner
                ? `<div class="commentModify">수정</div>
                  <div class="commentRemove">삭제</div>`
                : ``
            }
            <div class="commentCancle" style="display:none;">취소</div>
          </div>
        </div>

        <div class="comment">
          <p>
            ${
              parentId
                ? `<span class="reply-target">@${escapeHtml(getParentNicknameFromId(parentCommentId))}</span> `
                : ""
            }
            <span class="comment-text">${escapeHtml(content)}</span>
          </p>
        </div>

        <div class="commentEditor" style="display:none;">
          <textarea class="commentTextarea"></textarea>
          <button class="commentSubmit">확인</button>
        </div>
      </div>
      <hr class="sidebar-divider d-none d-md-block">
    `;


    const commentDiv = li.querySelector('div[class = "commentDiv"]');
    if(commentDiv !== null){
      commentDiv.dataset.id = commentId;
      commentDiv.dataset.nickname = nickname;
      commentDiv.dataset.date = date;
      commentDiv.dataset.memberId = memberId;
      commentDiv.dataset.parentCommentId = parentId;
      li.dataset.depth =  d;
    }else{
      console.log("error : commentDiv does not exist on current commentId : ", commentId);

    }

    ul.appendChild(li);
    return;
  }else{
    console.log("parentDiv : ", parentDiv);
    const parentLi = parentDiv.closest("li");;


    // 🔹 새 li 생성
    const li = document.createElement("li");


    li.innerHTML = `
      <div class="commentDiv" style="padding-left: ${Number(parentLi.dataset.depth) + 3}rem;">
        <div class="commentHead">
          <div class="commentHead1">
            <div class="commentName">${escapeHtml(nickname)}</div>
            <div class="commentDate">${escapeHtml(date)}</div>
          </div>

          <div class="commentHead2">
            <div class="commentReply">답글</div>
            ${
              owner
                ? `<div class="commentModify">수정</div>
                  <div class="commentRemove">삭제</div>`
                : ``
            }
            <div class="commentCancle" style="display:none;">취소</div>
          </div>
        </div>

        <div class="comment">
          <p>
            ${parentId ? "@" + parentDiv.dataset.nickname : ""}
            ${escapeHtml(content)}
          </p>
        </div>

        <div class="commentEditor" style="display:none;">
          <textarea class="commentTextarea"></textarea>
          <button class="commentSubmit">확인</button>
        </div>
      </div>
      <hr class="sidebar-divider d-none d-md-block">
    `;

    // 🔹 부모 댓글 바로 아래에 삽입
    parentLi.after(li);
    const liDiv = li.querySelector('div.commentDiv');
    liDiv.dataset.id = commentId;
    liDiv.dataset.parent = parentId;
    li.dataset.depth = (
                        Number(parentLi.dataset.depth) + 1
                        ).toString();
    liDiv.dataset.nickname = nickname;        
  }




    function getParentNicknameFromId(parentCommentId){

    const parent = ul.querySelector(`div.commentDiv[data-id="${parentCommentId}"]`);
    if (!parent) return null;

    return parent.dataset.nickname;

  }
}
/*비동기로 댓글 수정 결과를 보여주는 함수.
@param : parentNickname --> parentDiv.dataset.nickname
*/ 
function modifyCommentAsync(commentDto, commentDiv, parentNickname) {
  if (!commentDto || !commentDiv) return;


  console.log("commentDto : ", commentDto
    , ", commentDiv : ", commentDiv
    , ", parentNickname : ", parentNickname
  )
  const { parentCommentId, commentContent } = commentDto;

  const p = commentDiv.querySelector("div.comment > p");
  if (!p) return;

  // @닉네임 + 내용 구성
  const mention = parentCommentId ? `@${parentNickname ?? ""} ` : "";

  // ✅ innerHTML을 쓸 거면 escapeHtml 필요
p.innerHTML = `
  ${mention 
    ? `<span class="reply-target">${escapeHtml(mention)}</span> `
    : ""
  }
  <span class="comment-text">${escapeHtml(commentContent ?? "")}</span>
`;

  // 또는 ✅ textContent로 가면 escapeHtml 필요 없음 (대신 줄바꿈/공백 표현은 제한)
  // p.textContent = `${mention}${commentContent ?? ""}`;
}
/*비동기로 댓글 삭제를 실행하는 함수.

*/ 
function deleteCommentAsync(commentDiv){
  if(!commentDiv) return;
  const commentHead2 = commentDiv.querySelector(".commentHead2");
  const commentBody = commentDiv.querySelector(".comment");
  const commentEditor = commentDiv.querySelector(".commentEditor");
  
  commentHead2.innerHTML = "";
  commentBody.innerHTML = `<p style="font-style: italic; color: gray;">
          댓글이 삭제되었습니다.
        </p>`;
  commentEditor.innerHTML = "";

}