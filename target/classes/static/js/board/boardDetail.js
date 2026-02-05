document.addEventListener("DOMContentLoaded", () => {
  
    

    loadWriteDetail();
});


/*제목, 내용, 파일 loading하는 함수*/ 
async function loadWriteDetail(){
    const detailTitle = document.getElementById("detailTitle");
    const detailBody = document.getElementById("detailBody");
    

    const detailModifyBtn = document.querySelector('button[name="modify-post-button"]'); // 글 수정 버튼
    const detailDeleteBtn = document.querySelector('button[name="delete-post-button"]'); // 글 삭제 버튼
    
    const params = new URLSearchParams(window.location.search); // 주소창에서 게시글 번호 가져오기(param name : postId)
    const postId = params.get("postId");

    try{
        const {writeId, 
            writeTitle, 
            writeContent, 
            writeDate, 
            memberId, uploadFiles, isOwner}  = await getWriteDetail(postId);
        
        detailTitle.textContent = writeTitle;
        detailBody.textContent = writeContent;
        
        renderUploadFiles(uploadFiles);
         // 내가 쓴 글이면 "DOMContentLoaded"때 숨긴 수정/삭제 버튼 다시 표시
        if (isOwner) {
            document.querySelectorAll(".owner-only").forEach(el => {
            el.hidden = false;
            el.style.display = ""; // 원래 상태로(버튼은 inline-block, a는 inline 등)
            el.removeAttribute("hidden"); 
            });
        }

        return;


    }catch(e){
        

    }
    

}


function renderUploadFiles(files) {
  const container = document.getElementById("fileName");

  // 초기화
  container.innerHTML = "";

  // 파일 없을 때
  if (!files || files.length === 0) {
    container.innerHTML = `<span class="text-muted">첨부파일 없음</span>`;
    return;
  }

  // 파일 있을 때
  files.forEach(file => {
    const a = document.createElement("a");

    a.href = `/download/file?fileId=${file.fileId}`; // 다운로드 URL
    a.textContent = file.fileNameOriginal;
    a.dataset.savename = file.fileNameSaved;

    // 새 창 방지 + 안전
    a.target = "_self";

    container.appendChild(a);
    container.appendChild(document.createElement("br"));
  });
}



/*서버 측에서 게시글 불러오기 @param postid 
*/ 
async function getWriteDetail(postId){

    const detail = $.ajax({
        url: "/boardDetail",
        type: "GET",
        dataType: "json",
        data : {postId:postId},
    }).then((resp) => {

    const { isOwner, write, uploadFiles } = resp;
    const { postId, postTitle, postContent, postDate, memberId, memberNickname } = write;
    const files = uploadFiles?.files ?? [];
    //if(files.length === 0) 
       return{
            writeId: postId,
            writeTitle: postTitle,
            writeContent: postContent,
            writeDate: postDate,
            memberId: memberId,
            nickname: memberNickname,
            isOwner: isOwner,
            uploadFiles : files
        }
    });
        /*
        error: function(xhr){
            console.log(xhr.responseText);
            alert("서버 요청 실패 : 글을 불러오지 못했습니다.");

        }*/
    return detail;
}

/**************************************************************** */


/*글 수정 페이지로*/ 
function modifyPostButtonHandler(){
    const params = new URLSearchParams(window.location.search);
    const postId = params.get("postId");


    location.href = `/write/modify?postId=${postId}`;


}
/*글 삭제*/ 
async function deletePostButtonHandler(){
    const params = new URLSearchParams(window.location.search);
    const postId = params.get("postId");

    if(confirm("정말로 삭제하시겠습니까?")){
        $.ajax({
        url: `/board/delete?postId=${postId}`, 
        type: "POST",
        
        processData: false,
        contentType: false,
        success: function (resp) {
            // 서버가 "1"/"0" 같은 텍스트를 준다고 가정
            const result = Number(resp);

            if (result > 0) {
            alert("게시글 삭제 성공!");
            location.href = "/"; // 메인으로
            } else {
            alert("게시글 삭제 실패..");
            }
        },
        error: function (xhr) {
            console.log(xhr.responseText);
            alert("게시글 삭제 오류.. 서버 요청 실패");
        }
        });
        return ;

    }
}