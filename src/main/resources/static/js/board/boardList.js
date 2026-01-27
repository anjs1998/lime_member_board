document.addEventListener("DOMContentLoaded", () => {
  loadWriteList();
});

async function loadWriteList() {
  const tbody = document.getElementById("writeTbody");
  

  // 1) 로딩 UI
  tbody.innerHTML = `
    <tr>
      <td colspan="4" class="text-center">로딩중...</td>
    </tr>
  `;
 

  $.ajax({
    url: "/boardList", 
    type: "GET",
    dataType: "json", // ✅ resp를 JSON 객체/배열로 받게 함

    success: function (boardList) {

      
    // 데이터 없을 때
    if (!boardList || boardList.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="4" class="text-center">게시글이 없습니다.</td>
        </tr>
      `;
      return;
    }else{
        // tbody 렌더링
        tbody.innerHTML = boardList.map(row => {
        // 서버에서 내려주는 키 이름에 맞추면 됨
        // (예시) nickname, postId, postTitle, postDate, commentCount
        const nickname = escapeHtml(row.nickname ?? "익명");
        const title = escapeHtml(row.postTitle ?? "(제목 없음)");
        const postId = row.postId; // 숫자라 가정
        const commentCount = row.commentCount ?? 0;

        // 날짜 포맷: "2026-01-26T09:10:00" 또는 "2026-01-26" 등 들어올 수 있음
        const dateText = formatDate(row.postDate);

        return `
          <tr>
            <td>${nickname}</td>
            <td><a href="/write/detail?postId=${postId}">${title}</a></td>
            <td>${dateText}</td>
            <td>${commentCount}개</td>
          </tr>
        `;
      }).join("");

    }

    },
    error: function (xhr) {
      console.log(xhr.responseText);
      alert("서버 요청 실패");
      
      tbody.innerHTML = `
        <tr>
          <td colspan="4" class="text-center text-danger">목록을 불러오지 못했습니다.</td>
        </tr>
      `;
  
    }
  });


}