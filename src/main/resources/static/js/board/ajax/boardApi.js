

/*pagination에 해당하는 글 10개씩 서버에서 list 불러오기.
@param : page -> cp (기본값 1)*/ 
async function getWriteList(page = 1){

    try{
        const [{writeList, pagination}] = await $.ajax({
                                                url: "/boardList", 
                                                type: "GET",
                                                dataType: "json", // ✅ resp를 JSON 객체/배열로 받게 함
                                                data: {cp : page},})

        return {writeList, pagination};
    }catch(xhr){
      console.log(xhr.responseText);
      alert("서버 요청 실패");
        return null;
    }
    

}
/*서버 측에서 게시글 불러오기 
@param postId 
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

async function updatePost(formdata){
      $.ajax({
        url: "/board/modify", 
        type: "POST",
        data: formdata,
        processData: false,
        contentType: false,
        success: function (resp) {
            // 서버가 "1"/"0" 같은 텍스트를 준다고 가정
            return Number(resp);

          
        },
        error: function (xhr) {
            console.log(xhr.responseText);
            alert("게시글 수정 오류.. 서버 요청 실패");
        }
    });

}