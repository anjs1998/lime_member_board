

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

    return detail;
}

async function updatePost(formdata){
    try{
        const resp = await $.ajax({
            url: "/board/modify", 
            type: "POST",
            data: formdata,
            processData: false,
            contentType: false,

        });

        return resp;
    }catch(e){
            console.log(e?.responseText ?? e);
            return null; // 여기서 alert까지 하면 호출부에서 중복 alert 날 수 있음
     }
      
}

async function deletePost(postId){
    try{
        const resp = await $.ajax({
                                    url: `/board/delete?postId=${postId}`, 
                                    type: "POST",
                                    
                                    processData: false,
                                    contentType: false,
                                    })

        

        return resp;
    }catch(e){
            console.log(e?.responseText ?? e);
            return null; // 여기서 alert까지 하면 호출부에서 중복 alert 날 수 있음
     }


}