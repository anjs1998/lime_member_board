<%@ page contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<!DOCTYPE html>
<html lang="ko">
  <head>
    <meta charset="utf-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta
      name="viewport"
      content="width=device-width, initial-scale=1, shrink-to-fit=no"
    />
    <meta name="description" content="" />
    <meta name="author" content="" />

    <title>SB Admin 2 - Register</title>

    <!-- Custom fonts for this template-->
    <link
      href="/vendor/fontawesome-free/css/all.min.css"
      rel="stylesheet"
      type="text/css"
    />
    <link
      href="/https://fonts.googleapis.com/css?family=Nunito:200,200i,300,300i,400,400i,600,600i,700,700i,800,800i,900,900i"
      rel="stylesheet"
    />

    <!-- Custom styles for this template-->
    <link href="/css/sb-admin-2.min.css" rel="stylesheet" />





  </head>

  <body class="bg-gradient-primary">
    <div class="container">
      <div class="card o-hidden border-0 shadow-lg my-5">
        <div class="card-body p-0">
          <!-- Nested Row within Card Body -->
          <div class="row">
            <div class="col-lg-5 d-none d-lg-block bg-register-image"></div>
            <div class="col-lg-7">
              <div class="p-5">
                <div class="text-center">
                  <h1 class="h4 text-gray-900 mb-4">회원가입</h1>
                </div>
                <form class="user" id="register-user">
                  <div class="form-group">

                    
                    
                    <input
                      type="text"
                      name="memberNickname"
                      class="form-control form-control-user"
                      placeholder="이름"
                      maxlength="10"
                      onblur = "checkNicknameExists()"
                    />
                    <small
                      id="memberNicknameCheck"
                      class="form-text"
                      hidden
                    ></small>
                  </div>
                  <div class="form-group row">
                    <div class="col-sm-9 mb-3 mb-sm-0">

                      <input
                        type="email"
                        name="memberEmail"
                        class="form-control form-control-user"
                        placeholder="이메일주소"
                        autocomplete="off"
                      />

                    </div>
                    <div class="col-sm-3">
                      <a
                        id="checkEmailButton"
                        onclick="checkEmailExists()"
                        class="btn btn-primary btn-user btn-block"
                        data-checked = "N"
                      >
                        중복확인
                      </a>
                    </div>
                  </div>
                  <div class="form-group row">
                    <div class="col-sm-6 mb-3 mb-sm-0">

                      <input
                        type="password"
                        name="memberPw"
                        class="form-control form-control-user"
                        placeholder="비밀번호"
                        autocomplete="off"
                      />
                      
                    </div>
                    <div class="col-sm-6">
                      <input
                        type="password"
                        name="memberPwConfirm"
                        class="form-control form-control-user"
                        placeholder="비밀번호 확인"
                      />
                    </div>
                  </div>
                  <div class="form-group">
                    <input
                      type="email"
                      name="memberPhone"
                      class="form-control form-control-user"
                      placeholder="휴대폰번호"
                    />
                  </div>
                  <div class="form-group row">
                    <div class="col-sm-9 mb-3 mb-sm-0">
                      <input
                        type="email"
                        name="memberAddress"
                        class="form-control form-control-user"
                        placeholder="주소"
                        readonly
                      />
                    </div>
                    <div class="col-sm-3">
                      <a
                        onclick="execDaumPostcode()"
                        class="btn btn-primary btn-user btn-block"
                      >
                        주소찾기
                      </a>
                    </div>
                  </div>
                  <div class="form-group">
                    <input
                      type="email"
                      name="memberAddressSub"
                      class="form-control form-control-user"
                      placeholder="상세주소"
                      readonly
                    />
                  </div>
                  <div class="form-group row">
                    <div class="col-sm-6 mb-3 mb-sm-0">
                      <input
                        type="text"
                        name="memberAddressPostal"
                        class="form-control form-control-user"
                        placeholder="우편번호"

                        pattern="[0-9]{5}"
                        maxlength="5"
                        readonly
                      />
                    </div>
                    <div class="col-sm-6">
                      <input
                        type="text"
                        name="memberDescription"
                        class="form-control form-control-user"
                       
                        placeholder="참고사항"
                        readonly
                      />
                    </div>
                  </div>

                  <a
                    
                    class="btn btn-primary btn-user btn-block"
                    onclick="signup()"
                  >
                    Register Account
                  </a>
                </form>
                <hr />
                <div class="text-center">
                  <a class="small" href="login.html"
                    >Already have an account? Login!</a
                  >
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Bootstrap core JavaScript-->
    <script src="/vendor/jquery/jquery.min.js"></script>
    <script src="/vendor/bootstrap/js/bootstrap.bundle.min.js"></script>

    <!-- Core plugin JavaScript-->
    <script src="/vendor/jquery-easing/jquery.easing.min.js"></script>

    <!-- Custom scripts for all pages-->
    <script src="/js/sb-admin-2.min.js"></script>

    <!--script for phone format(반드시 signup.js 위에 와야함)-->
    <script src="/js/common/phone.js"></script>
    <!--script for signup-->
    <script src="/js/membership/signup.js"></script>
`   <!--script for daum address api-->
    <script src="https://t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js"></script>
    <script>
      function execDaumPostcode() {
          new daum.Postcode({
              oncomplete: function(data) {
                  // 도로명 주소
                  document.querySelector('input[name="memberAddress"]').value = data.roadAddress;
                  document.querySelector('input[name="memberAddressPostal"]').value = data.zonecode;
                  console.log(data);
                  document.querySelector('input[name="memberDescription"]').value =  data.buildingName; // 상세주소에 빌딩 이름 입력
                  
                  document.querySelector('input[name="memberAddressSub"]').readOnly = false;
                  document.querySelector('input[name="memberAddressSub"]').placeholder = "상세주소를 입력하세요";
                  document.querySelector('input[name="memberDescription"]').readOnly = false;
                }
          }).open();
      }
    </script>
  </body>
</html>
