document.addEventListener("DOMContentLoaded", () => {
  // 일단 수정/삭제 버튼 숨기기.
    document.querySelectorAll(".owner-only").forEach(el => {
        el.hidden = true;                // display:none과 비슷한 효과
        el.style.display = "none";       // Bootstrap 등 영향 방지용(확실하게)
    });
    loadWriteDetail();
});



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
            memberId, isOwner}  = await getWriteDetail(postId);
        
        detailTitle.textContent = writeTitle;
        detailBody.textContent = writeContent;
    
         // 내가 쓴 글이면 "DOMContentLoaded"때 숨긴 수정/삭제 버튼 다시 표시
        if (isOwner) {
            document.querySelectorAll(".owner-only").forEach(el => {
            el.hidden = false;
            el.style.display = ""; // 원래 상태로(버튼은 inline-block, a는 inline 등)
            });
        }

        return;


    }catch(e){
        

    }
    

}



async function getWriteDetail(postId){

    const detail = $.ajax({
        url: "/boardDetail",
        type: "GET",
        dataType: "json",
        data : {postId:postId},
    }).then((resp) => {

    const { isOwner, write } = resp;
    const { postId, postTitle, postContent, postDate, memberId } = write;
        return{
            writeId: postId,
            writeTitle: postTitle,
            writeContent: postContent,
            writeDate: postDate,
            memberId: memberId,
            isOwner: isOwner
        }
    });
        /*
        error: function(xhr){
            console.log(xhr.responseText);
            alert("서버 요청 실패 : 글을 불러오지 못했습니다.");

        }*/
    return detail;
}