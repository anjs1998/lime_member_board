//const postIdToModify // 수정하려는 게시글 ID 번호 전역 변수로 저장.


document.addEventListener("DOMContentLoaded", () => {
  
    //boardDetail.js에서 가져온 함수
    //loadWriteDetail();
});

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