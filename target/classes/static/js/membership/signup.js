document.addEventListener("DOMContentLoaded", () => {
  const phoneInput = document.querySelector('input[name="memberPhone"]');

  phoneInput.addEventListener("input", (e) => {
    e.target.value = formatPhoneHypen(e.target.value);
  });
}); // DOM 로딩후 전번 하이픈 자동변환 함수 실행,


function signup(){
   

    // 1. confirm("회원가입 하시겟습니까?")


    const form = document.getElementById("register-user");
    const formData = new FormData(form);

    if(!isAllSubmitValid()) return;
    else if (confirm("회원가입 하시겠습니까?")) {

        
        // 휴대폰 번호 하이픈 제거 후 재세팅
        const memberPhone = document.querySelector('input[name="memberPhone"]');
        const noHypenPhone = memberPhone.value.trim().replace(/-/g, "");
        formData.set("memberPhone", noHypenPhone);

        fetch("/signup", {

            method:"POST",
            body : formData
        }).then(async (res) => {

        resp = await res.text(); // 회원가입 성공시 1, 실패시 0 반환
        res = Number(resp);
        console.log("res: " , res);
        if(res === 1 ){
            alert("회원가입이 완료되었습니다.");
            location.href="/membership/login"
        }else{
             alert("회원가입 실패");

        }
        })
    } else {

        // 취소 눌렀을 때
    }



}

//모든 필수 사항들이 작성되었는지 체크하는 함수.
//만약 필수 사항들이 빈채로 회원가입 버튼을 눌렀다면, alert실행.
function isAllSubmitValid(){
    
    function isInputEmpty(input){
        return !(input.value.trim())
    }
    // form 자체
    const registerForm = document.querySelector("#register-user");

    // 개별 input들
    const memberNickname = document.querySelector('input[name="memberNickname"]');
    const memberEmail = document.querySelector('input[name="memberEmail"]');
    const memberPw = document.querySelector('input[name="memberPw"]');
    const memberPhone = document.querySelector('input[name="memberPhone"]');
    const memberAddress = document.querySelector('input[name="memberAddress"]');
    const memberAddressSub = document.querySelector('input[name="memberAddressSub"]'); // 필수사항 아님
    const memberAddressPostal = document.querySelector('input[name="memberAddressPostal"]');
    const memberDescription = document.querySelector('input[name="memberDescription"]'); // 필수사항 아님

    // 비밀번호 확인 (name이 없어서 위치로 잡음)
    const memberPwConfirm = document.querySelector(
    'input[name="memberPwConfirm"]'
    );
    const emailCheckButton = document.getElementById("checkEmailButton");

    console.log("emailcheckbutton:" , emailCheckButton);
    //이메일 체크용 정규식
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    //휴대폰 번호 체크용 정규식    
    const phoneRegex = /^01[016789]-?\d{3,4}-?\d{4}$/;
    //우편번호 체크용 정규식
    const postalRegex = /^\d{5}$/;
    
    

    // 개별 input들의 empty check
    if (isInputEmpty(memberNickname)) {
        alert("이름을 입력하세요!");
        memberNickname.focus();
        return false;

    } else if (isInputEmpty(memberEmail)) {
        alert("이메일을 입력하세요!");
        memberEmail.focus();
        return false;

    } else if (!emailRegex.test(memberEmail.value.trim())) {
        alert("이메일 형식이 올바르지 않습니다 (예: test@example.com)");
        memberEmail.focus();
        return false;
    } else if(!isEmailExists()){
        alert("이미 사용중인 이메일입니다.");
        return false;}
    else if(emailCheckButton.dataset.checked === "N"){
        alert("이메일 중복체크를 해주세요!");
        return false;}
    else if (isInputEmpty(memberPw)) {
        alert("비밀번호를 입력하세요!");
        memberPw.focus();
        return false;

    } else if (isInputEmpty(memberPwConfirm)) {
        alert("비밀번호 확인을 입력하세요!");
        memberPwConfirm.focus();
        return false;

    } else if (memberPw.value !== memberPwConfirm.value) {
        alert("비밀번호가 일치하지 않습니다!");
        memberPwConfirm.focus();
        return false;

    } else if (isInputEmpty(memberPhone)) {
        alert("휴대폰 번호를 입력하세요!");
        memberPhone.focus();
        return false;

    } else if(
        !phoneRegex.test(memberPhone.value.trim())
    ) {
        alert("휴대폰 번호 형식이 올바르지 않습니다 (예: 010-1234-5678)");
        memberPhone.focus();
        return false;
    }else if (isInputEmpty(memberAddress)) {
        alert("주소를 입력하세요!");
        memberAddress.focus();
        return false;

    } /*else if (isInputEmpty(memberAddressSub)) {
    alert("상세주소를 입력하세요!");
    memberAddressSub.focus();

    } */else if (isInputEmpty(memberAddressPostal)) {
        alert("우편번호를 입력하세요!");
        memberAddressPostal.focus();
        return false;

    } else if (!postalRegex.test(memberAddressPostal.value.trim())) {
        alert("우편번호는 5자리 숫자여야 합니다 (예: 06236)");
        memberAddressPostal.focus();
        return false;
    }

    // 모든 검증 통과
    return true;
}


/*이메일 중복체크 html용 wrapper*/
async function checkEmailExists(){
    
    
    isExist = await isEmailExists();
    if(isExist){  alert("이미 존재하거나 사용 불가능한 이메일입니다");}
    else{ alert("사용 가능한 이메일입니다.");}

}
/*이메일 중복체크*/
async function isEmailExists(){

    const checkButton = document.getElementById("checkEmailButton");
    memberEmail = document.querySelector('input[name="memberEmail"]');
    //이메일 체크용 정규식
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(memberEmail.value.trim())) {
        alert("이메일 형식이 올바르지 않습니다 (예: test@example.com)");
        memberEmail.focus();
        return true;
    }else{
        const fd = new FormData();
        fd.append("memberEmail", memberEmail.value.trim());
        const isExists = await fetch("/checkEmailExists", {

            method:"POST",

            body: fd
        }).then( res => res.json())
        checkButton.dataset.checked = isExists ? "N" :"Y"; // checkEmailButton의 data-checked의 값을 수정.
        return isExists;
    }

}