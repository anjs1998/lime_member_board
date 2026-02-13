async function loginAjax(formData){
    try{
        const resp = await $.ajax({
                                    url: "/login", // ✅ 너 컨트롤러 매핑에 맞춰서 변경
                                    type: "POST",
                                    data: formData,
                                    processData: false,
                                    contentType: false,
                                    
                                    });
        return Number(resp);

    }catch(e){
        console.log(e);
        //alert("서버 요청 실패");
        return null;
    }
    
}

async function logoutAjax() {
  try {
    const resp = await $.ajax({
      url: "/logout",
      type: "GET"
    });

    return Number(resp);

  } catch (e) {
    console.log(e);   // ⚠ xhr 아님! e임!
    return null;
  }
}