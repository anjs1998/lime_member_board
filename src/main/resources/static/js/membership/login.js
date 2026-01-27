function login(){
    const form = document.querySelector('form[name="login-form"]');
    const formData = new FormData(form);

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
    });

}