async function submitNewWrite(){
    const form = document.getElementById("submitWrite");
    const formData = new FormData(form);
    

    if(confirm("제출하시겠습니까?")){
        $.ajax({
        url: "/board/insert", 
        type: "POST",
        data: formData,
        processData: false,
        contentType: false,
        success: function (resp) {
            // 서버가 "1"/"0" 같은 텍스트를 준다고 가정
            const result = Number(resp);

            if (result > 0) {
            alert("게시글 업로드 성공!");
            location.href = "/"; // 메인으로
            } else {
            alert("게시글 업로드 실패..");
            }
        },
        error: function (xhr) {
            console.log(xhr.responseText);
            alert("게시글 업로드 오류.. 서버 요청 실패");
        }
        });


    }

    



}