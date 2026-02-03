//const postIdToModify // 수정하려는 게시글 ID 번호 전역 변수로 저장.


document.addEventListener("DOMContentLoaded", () => {
  loadContent();
    //boardDetail.js에서 가져온 함수
    //loadWriteDetail();
});

/*제목, 내용을 form에 다시 loading하는 함수.*/ 
async function loadContent(){
    const detailPostId = document.getElementById("postId");
    const detailTitle = document.querySelector('input[name="title"]');
    const detailBody = document.querySelector('input[name="content"]');
    

   
    
    const params = new URLSearchParams(window.location.search); // 주소창에서 게시글 번호 가져오기(param name : postId)
    const postId = params.get("postId");

    try{
        const {writeId, 
            writeTitle, 
            writeContent, 
            writeDate, 
            memberId, uploadFiles, isOwner}  = await getWriteDetail(postId);
        
        detailTitle.value = writeTitle;
        detailBody.value = writeContent;
        
        //todo : 파일목록도 표시해야함.
         // 내가 쓴 글이 아니라면
        if (!isOwner) {
            alert("잘못된 접근입니다 : 로그인을 안하셧거나, 본인이 쓴 글만 수정할수 있습니다.");
            window.history.back(); // 이전 페이지로
        }

        return;


    }catch(e){
        console.log(e);
        detailTitle.value = "서버 통신 실패 : 제목을 불러오지 못했습니다. 새로고침 하십시오.";
        detailBody.value =  "서버 통신 실패 : 내용을 불러오지 못했습니다. 새로고침 하십시오.";

    }


}
async function submitModify(){
    const form = document.getElementById("submitModify");
    const formData = new FormData(form);
    

    if(confirm("제출하시겠습니까?")){
        $.ajax({
        url: "/board/modify", 
        type: "POST",
        data: formData,
        processData: false,
        contentType: false,
        success: function (resp) {
            // 서버가 "1"/"0" 같은 텍스트를 준다고 가정
            const result = Number(resp);

            if (result > 0) {
            alert("게시글 수정 성공!");
            location.href = "/"; // 메인으로
            } else {
            alert("게시글 수정 실패..");
            }
        },
        error: function (xhr) {
            console.log(xhr.responseText);
            alert("게시글 수정 오류.. 서버 요청 실패");
        }
        });


    }

    



}