document.addEventListener("DOMContentLoaded", () => {
  loadWriteDetail();
});



async function loadWriteDetail(){
    const detailTitle = document.getElementById("detailTitle");
    const detailBody = document.getElementById("detailBody");

    const params = new URLSearchParams(window.location.search); // 주소창에서 게시글 번호 가져오기(param name : postId)
    const postId = params.get("postId");

    try{
        const {writeId, 
            writeTitle, 
            writeContent, 
            writeDate, 
            memberId} = await getWriteDetail(postId);
        
        detailTitle.textContent = writeTitle;
        detailBody.textContent = writeContent;
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
    }).then((dto) => {
        return{
            writeId: dto.postId,
            writeTitle: dto.postTitle,
            writeContent: dto.postContent,
            writeDate: dto.postDate,
            memberId: dto.memberId,
        }
    });
        /*
        error: function(xhr){
            console.log(xhr.responseText);
            alert("서버 요청 실패 : 글을 불러오지 못했습니다.");

        }*/
    return detail;
}