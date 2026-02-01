function renderPagination(paginationDto) {
  // p 예시:
  // {
  //   currentPage: 1,
  //   startPage: 1,
  //   endPage: 5,
  //   totalPages: 13,
  //   totalCount: 123,
  //   pageSize: 10,
  //   hasPrev: false,
  //   hasNext: true
  // }

  const ul = document.getElementById("pagination");
  ul.innerHTML = "";



  // li 만들기
  const addItem = ({ label, page, disabled = false, active = false }) => {
    const li = document.createElement("li");
    li.className = `page-item${disabled ? " disabled" : ""}${active ? " active" : ""}`; // class추가 : page-item, disabled, active

    const a = document.createElement("a");
    a.className = "page-link";
    a.href = "#";
    a.textContent = label;

    a.addEventListener("click", (e) => {
      e.preventDefault();
      if (disabled || active) return;
      // ✅ 여기서 목록 다시 불러오기 (AJAX)
      loadWriteList(page);
    });

    li.appendChild(a);
    ul.appendChild(li);
  };

  // 이전(«)
  addItem({
    label: "Previous",
    page: paginationDto.currentPage - 1,
    disabled: !(paginationDto.hasPrev),
    active: paginationDto.hasPrev
  });

  // 페이지 번호들
  for (let page = paginationDto.startPage; page <= paginationDto.endPage; page++) {
    addItem({
      label: String(page),
      page,
      active: page === paginationDto.currentPage
    });
  }

  // 다음(»)
  addItem({
    label: "Next",
    page: paginationDto.currentPage + 1,
    disabled: !(paginationDto.hasNext),
    active: paginationDto.hasNext
  });
}