const MAX_FILES = 5;


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


function fileInputOnChangeHandler(e){

    //renderFilesToUpload()

    checkNumberOfFiles(e);


}
function renderFilesToUpload(){

}
/*파일 업로드 최대 개수 제한하는 함수.*/
function checkNumberOfFiles(e){
    if (e.target.files.length <= MAX_FILES) return;

  alert(`최대 ${MAX_FILES}개까지만 선택할 수 있어요.`);

  const dt = new DataTransfer();

  // 앞에서 5개만 다시 담기
  Array.from(e.target.files)
    .slice(0, MAX_FILES)
    .forEach(file => dt.items.add(file));

  e.target.files = dt.files;


}
