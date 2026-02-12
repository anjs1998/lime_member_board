
const MAX_FILES = 5;

document.addEventListener("DOMContentLoaded", () => {
    
  
    loadContent();

});

/*제목, 내용을 form에 다시 loading하는 함수.*/ 
async function loadContent(){
    const detailPostId = document.getElementById("postId");
    const detailTitle = document.querySelector('input[name="title"]');
    const detailBody = document.querySelector('textarea[name="content"]');
    

   
    
    const params = new URLSearchParams(window.location.search); // 주소창에서 게시글 번호 가져오기(param name : postId)
    const postId = params.get("postId");
    document.getElementById("postId").value = postId;
    try{
        const {writeId, 
            writeTitle, 
            writeContent, 
            writeDate, 
            memberId, uploadFiles, isOwner}  = await getWriteDetail(postId);
        
        detailTitle.value = writeTitle;
        detailBody.textContent = writeContent;
        
        renderUploadedFiles(uploadFiles);
        //todo : 파일목록도 표시해야함.
         // 내가 쓴 글이 아니라면
        if (!isOwner) {
            alert("잘못된 접근입니다 : 로그인을 안하셧거나, 본인이 쓴 글만 수정할수 있습니다.");
            window.history.back(); // 이전 페이지로
        }

        return;


    }catch(e){
        
        detailTitle.value = "서버 통신 실패 : 제목을 불러오지 못했습니다. 새로고침 하십시오.";
        detailBody.value =  "서버 통신 실패 : 내용을 불러오지 못했습니다. 새로고침 하십시오.";

    }


}



function renderUploadedFiles(files) {
  const fileNameDiv = document.getElementById("fileName");
  fileNameDiv.innerHTML = ""; // 초기화

  if (files.length === 0) return;
  
  files.forEach(file => {
    const div = document.createElement("div");
    div.className = "file-item";
    div.dataset.fileId = file.fileId; // data-file-id = "file.fileId"
    
    div.innerHTML = `
      <a href="#">
         ${file.fileNameOriginal}
      </a>
      <button type="button" class="remove-file">삭제</button>
    `;

    fileNameDiv.appendChild(div);
  });

  fileNameDiv.addEventListener("click", (e) => { // x 버튼을 누르면 삭제가 되는 event handler 함수 적용
    // 이벤트 버블링 사용 - x 버튼 이벤트가 아니라, 최상위 fileNameDiv에서 eventHandler함수를 정의하되, 그 자식중 x버튼이 아니면 return 을 하는 방식으로 적용시킨다.
    // 결과적으로 x버튼에만 삭제동작이 실행된다.
        
        const removeBtn = e.target.closest(".remove-file");
        if (!removeBtn) return;

        const fileItem = removeBtn.closest(".file-item");
        const fileId = fileItem.dataset.fileId; // 🔥 여기서 가져옴

        console.log("삭제 대상 fileId:", fileId);

        // hidden input에 누적
        appendDeleteFileId(fileId);

        // 화면에서 제거
        fileItem.remove();
    });
}


async function submitModify(){
    const form = document.getElementById("submitModify");
    const formData = new FormData(form);
    const params = new URLSearchParams(window.location.search);
    const postId = params.get("postId");
    console.log("formData : ", form);
    if(confirm("제출하시겠습니까?")){
        /*
        const resp = await updatePost(formData);
        
        
        
        */ 
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
            location.href = `/write/detail?postId=${postId}`; // 메인으로
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


/*삭제된 파일 id를 추가하는 함수.*/ 
function appendDeleteFileId(fileId) {
  const input = document.getElementById("deletedFileIds");

  const current = input.value
    ? input.value.split(",")
    : [];

  if (!current.includes(String(fileId))) {
    current.push(fileId);
  }

  input.value = current.join(",");
}


/*파일 업로드를 5개로 제한하는 함수.*/ 
function limitMaxFiles(){
    const fileInput = document.getElementById("fileInput");
    const fileNameDiv = document.getElementById("fileName");

    fileInput.addEventListener("change", function () {
    // 1️⃣ 현재 기존 파일 개수
    const existingCount = fileNameDiv.querySelectorAll(".file-item").length;

    // 2️⃣ 남은 업로드 가능 개수
    const availableCount = MAX_FILES - existingCount;

    if (availableCount <= 0) {
        alert("이미 최대 5개의 파일이 업로드되어 있어요.");
        this.value = "";
        return;
    }

    // 3️⃣ 새로 선택한 파일이 초과한 경우
    if (this.files.length > availableCount) {
        alert(`파일은 최대 ${MAX_FILES}개까지 업로드할 수 있어요.\n` +
            `새 파일은 ${availableCount}개만 추가할게요.`);

        const dt = new DataTransfer();

        Array.from(this.files)
        .slice(0, availableCount)
        .forEach(file => dt.items.add(file));

        this.files = dt.files;
    }

    // 4️⃣ 선택된 신규 파일 화면에 표시
    renderNewFiles(this.files);
});


}
