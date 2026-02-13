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





/************댓글 CRUD용 ajax요청보내는 함수들.**************************************************************** */
// 댓글 등록
async function insertComment({postId, parentCommentId = null, content }) {

  const payload = {
    postId: postId,
    parentCommentId : parentCommentId,
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