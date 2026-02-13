

window.addEventListener("DOMContentLoaded", () => {
  const savedEmail = getCookie("savedEmail");
  if (savedEmail) {
    document.querySelector('input[name="username"]').value = savedEmail;
    document.getElementById('emailRememberCheckBox').checked = true;
  }
});

async function login(){
    
    const form = document.querySelector('form[name="login-form"]');
    
    const formData = new FormData(form);
    const result = await loginAjax(formData);
    if (result === 1) {
      alert("로그인 성공!");
      location.href = "/"; // 메인으로
    } else if(result === null){
      alert("서버 요청 실패.");
    }else{
      alert("이메일 또는 비밀번호가 올바르지 않습니다.");
    }
  
  
   /*
    $.ajax({
      url: "/login", // ✅ 너 컨트롤러 매핑에 맞춰서 변경
      type: "POST",
      data: formData,
      processData: false,
      contentType: false,
      success: function (resp) {
        // 서버가 "1"/"0" 같은 텍스트를 준다고 가정
        const result = Number(resp);

        if (result === 1) {
          alert("로그인 성공!");
          location.href = "/"; // 메인으로
        } else {
          alert("이메일 또는 비밀번호가 올바르지 않습니다.");
        }
      },
      error: function (xhr) {
        console.log(xhr.responseText);
        alert("서버 요청 실패");
      }
    });*/

}
async function logout() {

  const result = await logoutAjax();

  if (result === 1) {
    alert("로그아웃 성공!");
    location.href = "/";
  } else if (result === null) {
    alert("서버 요청 실패");
  } else {
    alert("로그아웃 failed");
  }
}/*
function logout(){

  if(confirm("로그아웃 하시겟습니까?")){
        

    
      $.ajax({
      url: "/logout", // ✅ 너 컨트롤러 매핑에 맞춰서 변경
      type: "GET",
      
      processData: false,
      contentType: false,
      success: function (resp) {
        // 서버가 "1"/"0" 같은 텍스트를 준다고 가정
        const result = Number(resp);

        if (result === 1) {
          alert("로그아웃 성공!");
          location.href = "/"; // 메인으로
        } else {
          alert("로그아웃 failed");
          
        }
      },
      error: function (xhr) {
        console.log(xhr.responseText);
        alert("서버 요청 실패");
      }
    });
  }



}*/

function getCookie(name) {
  const parts = document.cookie.split("; ").map(v => v.split("="));
  const found = parts.find(([k]) => k === name);
  return found ? decodeURIComponent(found[1]) : null;
}