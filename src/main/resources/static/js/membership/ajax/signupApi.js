
/*닉네임 중복체크

@param memberNicknameString = memberNickname.value.trim()*/
async function isNicknameExists(memberNicknameString){

    
    //const memberNickname = document.querySelector('input[name="memberNickname"]');
    


    const fd = new FormData();
    //fd.append("memberNickname", memberNickname.value.trim());
    fd.append("memberNickname", memberNicknameString); //memberNickname.value.trim()
    try{
        const resp = await $.ajax({
            url : "/checkNickname",
            type: "POST",
            data: fd,
            processData: false,
            contentType: false,})

        if (typeof resp === "string" && resp.includes("<html")) { // redirect 대책
            return {isOk : false, message : "wrong response from server"};;// 닉네임이 비었거나 다른 오류가 생김.
        }  
        // resp가 boolean(false/true) 또는 문자열("false"/"true")일 수 있어서 처리
        const result = (resp === true || resp === "true");

        console.log(result);

        if(result === true ){
            return {isOk : true, isExist : true}; // 닉네임이 이미 존재함.

        }else if(result === false ){
            return {isOk : true, isExist : false}; // 존재하지 않는 새로운 닉네암
        }else{
            return {isOk : false, message : "check if the nickname input is empty!"};;// 닉네임이 비었거나 다른 오류가 생김.
        }

    }catch (xhr) {
        
        console.log("닉네임 중복검사 실패");
        console.log(xhr.status);

        return { isOk: false, message: `${xhr.status} ERROR` };
    }

        

    
    

}


/*이메일 중복체크
@param memberEmailString = memberEmail.value.trim()
*/
/*
async function isEmailExists(memberEmailString){


}*/
/*회원가입 ajax 요청*/ 
async function signupAjax(formData){
    try{
        const resp = await $.ajax({
            url: "/signup",
            type: "POST",
            data: formData,
            processData: false,   // FormData 그대로 전송
            contentType: false    // multipart/form-data 자동 설정
        });

        return Number(resp);  // "1" / "0" → 숫자로 변환해서 반환

    }catch(e){
        console.error("회원가입 요청 실패:", e);
        return null;   // 서버 요청 자체 실패
    }
}


