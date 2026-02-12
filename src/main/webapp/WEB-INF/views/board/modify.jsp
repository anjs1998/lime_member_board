<%@ page contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta
      name="viewport"
      content="width=device-width, initial-scale=1, shrink-to-fit=no"
    />
    <meta name="description" content="" />
    <meta name="author" content="" />

    <title>Tables</title>

    <!-- Custom fonts for this template -->
    <link
      href="/vendor/fontawesome-free/css/all.min.css"
      rel="stylesheet"
      type="text/css"
    />
    <link
      href="https://fonts.googleapis.com/css?family=Nunito:200,200i,300,300i,400,400i,600,600i,700,700i,800,800i,900,900i"
      rel="stylesheet"
    />

    <!-- Custom styles for this template -->
    <link href="/css/sb-admin-2.min.css" rel="stylesheet" />

    <!-- Custom styles for this page -->
    <link
      href="/vendor/datatables/dataTables.bootstrap4.min.css"
      rel="stylesheet"
    />

    <script src="/js/board/ajax/boardApi.js"></script>
    <!-- For loading existing posts-->
    <script src="/js/board/boardDetail.js"></script>
    <!-- source code for this page-->
    <script src="/js/board/boardModify.js"></script>

  </head>

  <body id="page-top">
    <!-- Page Wrapper -->
    <div id="wrapper">
      <!-- Sidebar -->
      <%@ include file="/WEB-INF/views/common/sidebar.jsp" %>

      <!-- Content Wrapper -->
      <div id="content-wrapper" class="d-flex flex-column">
        <!-- Main Content -->
        <div id="content">
          <!-- Topbar -->
          <%@ include file="/WEB-INF/views/common/topbar.jsp" %>


          <!-- Begin Page Content -->
          <div class="container-fluid h-100">
            <!-- Page Heading -->
            <h1 class="h3 mb-2 text-gray-800">게시판</h1>

            <!-- DataTales Example -->
            <div class="card shadow mb-4 h-75">
              <div class="card-body">
                <!-- Basic Card Example -->
                <form  id = "submitModify" action="#" method="post" enctype="multipart/form-data" class="h-100">
                  <div class="card shadow mb-4 h-100">
                    <div class="card-header py-3">
                      <div class="col-sm-11 float-left">
                        <input id="postId" name="postId" hidden>
                        <input
                          type="text"
                          id="a1"
                          name="title"
                          class="form-control"
                          placeholder="제목"
                          value="test 제목"
                          maxlength="1333"
                        />
                      </div>
                      <a>
                        <button
                          type="button"
                          class="btn btn-primary btn float-right ml-1"
                          onclick = "submitModify()"
                        >
                          수정완료
                        </button></a
                      >
                    </div>
                    <div class="card-body h-100">
                      <textarea
                        id="a3"
                        name="content"
                        cols="30"
                        class="form-control h-100"
                        placeholder="내용
                        "
                        style="resize: none"
                        maxlength="1333"
                      >
The styling for this basic card example is created by using default Bootstrap utility classes. By using utility classes, the style of the card component can be easily modified with no need for any custom CSS! The styling for this basic card example is created by using default Bootstrap utility classes. By using utility classes, the style of the card component can be easily modified with no need for any custom CSS! The styling for this basic card example is created by using default Bootstrap utility classes. By using utility classes, the style of the card component can be easily modified with no need for any custom CSS! The styling for this basic card example is created by using default Bootstrap utility classes. By using utility classes, the style of the card component can be easily modified with no need for any custom CSS! The styling for this basic card example is created by using default Bootstrap utility classes. By using utility classes, the style of the card component can be easily modified with no need for any custom CSS! The styling for this basic card example is created by using default Bootstrap utility classes. By using utility classes, the style of the card component can be easily modified with no need for any custom CSS! The styling for this basic card example is created by using default Bootstrap utility classes. By using utility classes, the style of the card component can be easily modified with no need for any custom CSS! The styling for this basic card example is created by using default Bootstrap utility classes. By using utility classes, the style of the card component can be easily modified with no need for any custom CSS! The styling for this basic card example is created by using default Bootstrap utility classes. By using utility classes, the style of the card component can be easily modified with no need for any custom CSS! The styling for this basic card example is created by using default Bootstrap utility classes. By using utility classes, the style of the card component can be easily modified with no need for any custom CSS! Bootstrap utility classes. By using utility classes, the style of the card component can be easily modified with no need for any custom CSS! Bootstrap utility classes. By using utility classes, the style of the card component can be easily modified with no need for any custom CSS! Bootstrap utility classes. By using utility classes, the style of the card component can be easily modified with no need for any custom CSS! Bootstrap utility classes. By using utility classes, the style of the card component can be easily modified with no need for any custom CSS!</textarea
                      >
                    </div>
                  </div>

                  <div class="card-body fileUpLoad">
                    <label class="fileUpLoadBtn" id="addFileBtn">추가 파일</label>

                    <!-- 실제 파일 선택 input -->
                    <input type="file" id="fileInput" name="newFiles" style="" multiple>
                    <!-- 삭제할 파일 id 목록 -->
                    <input type="hidden" name="deletedFileIds" id="deletedFileIds" value="">
                    <div id="fileName" class="fileName">
                      <!-- 기존 파일 -->
                      <div class="file-item">
                        <a href="#" data-savename="1711943118813_listener.ora">listener.ora</a>
                        <button type="button"
                                class="close remove-file"
                                aria-label="파일 삭제">
                          <span aria-hidden="true">&times;</span>
                        </button>
                      </div>
                    </div>
                  </div>

                </form>
              </div>
            </div>
          </div>
          <!-- /.container-fluid -->
        </div>
        <!-- End of Main Content -->

        <!-- Footer -->
        <footer class="sticky-footer bg-white">
          <div class="container my-auto">
            <div class="copyright text-center my-auto">
              <span>풋터</span>
            </div>
          </div>
        </footer>
        <!-- End of Footer -->
      </div>
      <!-- End of Content Wrapper -->
    </div>
    <!-- End of Page Wrapper -->

    <!-- Scroll to Top Button-->
    <a class="scroll-to-top rounded" href="#page-top">
      <i class="fas fa-angle-up"></i>
    </a>

    <!-- Logout Modal-->
    <div
      class="modal fade"
      id="logoutModal"
      tabindex="-1"
      role="dialog"
      aria-labelledby="exampleModalLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="exampleModalLabel">Ready to Leave?</h5>
            <button
              class="close"
              type="button"
              data-dismiss="modal"
              aria-label="Close"
            >
              <span aria-hidden="true">×</span>
            </button>
          </div>
          <div class="modal-body">
            Select "Logout" below if you are ready to end your current session.
          </div>
          <div class="modal-footer">
            <button
              class="btn btn-secondary"
              type="button"
              data-dismiss="modal"
            >
              Cancel
            </button>
            <a class="btn btn-primary" href="login.html">Logout</a>
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

    <!-- Page level plugins -->
    <script src="/vendor/datatables/jquery.dataTables.min.js"></script>
    <script src="/vendor/datatables/dataTables.bootstrap4.min.js"></script>

    <!-- Page level custom scripts -->
    <script src="/js/demo/datatables-demo.js"></script>


  </body>
</html>
