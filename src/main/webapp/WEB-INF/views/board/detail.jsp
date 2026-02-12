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
                <div class="card shadow mb-4 h-100">
                  <div class="card-header py-3">
                    <h6
                      id="detailTitle"
                      class="m-0 font-weight-bold text-primary btn float-left"
                    >
                      글 제목 로딩중...
                    </h6>
                    <a aria-hidden="" class="owner-only" hidden>
                      <button
                        name="modify-post-button"
                        type="button"
                        class="btn btn-primary btn float-right ml-1 owner-only"
                        onclick="modifyPostButtonHandler()"
                        hidden>
                        수정
                      </button>
                    </a>
                    <button
                      name="delete-post-button"
                      type="button"
                      class="btn btn-danger btn float-right owner-only"
                      onclick="deletePostButtonHandler()"
                    hidden>
                      삭제
                    </button>
                  </div>
                  <div
                    id="detailBody"
                    class="card-body navbar-nav-scroll"
                    style="height: 290px !important"
                  >
                    글 본문내용 로딩중...
                  </div>
				  <div class="card-body fileUpLoad">
                 <label class="fileUpLoadBtn">파일</label>
                 <div id="fileName" class="fileName">
                 
                    <a href="#" data-savename="1711943118813_listener.ora">listener.ora</a>
                 
                 
                 </div>
               </div>
                  <div class="card-footer">
                  

                    <ul id="commentDiv" style="max-height: 500px; overflow-y: scroll;overflow-x: hidden;">
                       댓글 로딩중....
                       
                    </ul>
                   
                     
                  <form action="#" class="flex" id="commentForm" name="commentForm">
                      <input type="hidden" name="postId">
                       <textarea id="a3" cols="30" row="5" name="content" class="form-control flex" style="width: 90%" placeholder="내용
                         "></textarea>
                       <a href="#" class="commentAdd flex" style="width: 9%">
                         <button type="button" class="btn btn-primary btn ml-1" 
                         style="margin-top: 0.75rem;width: 100%"
                         onclick = "submitCommentHandler(event)">등록</button>
                       </a>
                  </form>
                     
                  </div>
                </div>
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
              <span>Copyright &copy; Your Website 2020</span>
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
            <a class="btn btn-primary"  onclick = "logout()">Logout</a>
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

    <!-- login.js for logout-->
    <script src="/js/membership/login.js"></script>
    <!-- contents and comments for post-->
    <script src="/js/board/commentUtil.js"></script>
    <script src="/js/board/comment.js"></script>
    <script src="/js/board/boardDetail.js"></script>
  </body>
</html>
